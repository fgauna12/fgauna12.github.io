---
layout: post
title: Migrating apps from one AKS cluster to another using Velero
tags:
  - devops
  - azure
  - kubernetes
date: 2021-01-29T20:24:52.230Z
featured: false
hidden: false
featured_image_thumbnail: /assets/uploads/baby_yoda.jpg
featured_image: /assets/uploads/baby_yoda.jpg
comments: false
---
Assuming you already set-up Velero on your primary cluster, you can restore all the configuration and applications in a similar cluster using Velero. This can be really useful for scenarios where you want to test dangerous changes without impacting app dev teams using a cluster. 

I recently had this scenario where I wanted to experiment with far fetched ideas on a cluster. However, I needed to use all the existing configurations. Because I was not using GitOps or extensive re-hydration CI/CD pipelines, I was able to use Velero to restore my Kubernetes configuration onto a new 1-node "sandbox" cluster.

<!--more--> 

## Install Velero on new cluster

Assuming you already configured Velero on your main cluster, [like this](https://gaunacode.com/aks-best-practice-backing-up-aks-with-velero), then start by creating a namespace.

``` bash
kubectl create ns velero
```

Then from your existing cluster, get the `velero-credentials` secret holding the connection information to your Azure storage account. For example, 

``` bash
# Against the main cluster (cluster #1)
kubectl get secret -o yaml velero-credentials -n velero > velero-credentials.yaml
```
Then switch to the new cluster and place it back. 

``` bash
# Against the new cluster (cluster #2)
kubectl apply -f velero-credentials.yaml   
rm velero-credentials.yaml 
```

Then install Velero on the new cluster. I used the same Helm command I used on the main cluster (cluster #1) some while back.

``` bash
# Against new cluster (cluster #2)
export AZURE_SUBSCRIPTION_ID="" # to get current sub: az account show --query "id" -o tsv
export STORAGE_RESOURCE_GROUP="" 
export STORAGE_ACCOUNT=""
export STORAGE_CONTAINER_NAME=""

helm install velero vmware-tanzu/velero --namespace velero --version 2.13.2 \
--set "initContainers[0].image=velero/velero-plugin-for-microsoft-azure:v1.1.0" \
--set "initContainers[0].imagePullPolicy=IfNotPresent" \
--set "initContainers[0].volumeMounts[0].mountPath=/target" \
--set "initContainers[0].volumeMounts[0].name=plugins" \
--set "initContainers[0].name=velero-plugin-for-azure" \
--set credentials.existingSecret='velero-credentials' \
--set configuration.provider='azure' \
--set configuration.backupStorageLocation.bucket=$STORAGE_CONTAINER_NAME \
--set configuration.backupStorageLocation.config.resourceGroup=$STORAGE_RESOURCE_GROUP \
--set configuration.backupStorageLocation.config.storageAccount=$STORAGE_ACCOUNT \
--set configuration.backupStorageLocation.config.subscriptionId=$AZURE_SUBSCRIPTION_ID \
--set configuration.volumeSnapshotLocation.name='azure-eastus' \
--set configuration.volumeSnapshotLocation.config.resourceGroup=$STORAGE_RESOURCE_GROUP \
--set configuration.volumeSnapshotLocation.config.subscriptionId=$AZURE_SUBSCRIPTION_ID
```

This also assumes that you're using Azure as the provider/backend for Velero.

## Modify Velero's backend to read-only

Find the backup location configured. It's probably `default`.
``` shell
# Against new cluster (cluster #2)
$ kubectl -n velero get backupstoragelocation.velero.io
NAME      PROVIDER   BUCKET/PREFIX                          PHASE       LAST VALIDATED                  ACCESS MODE
default   azure      backups-azaks-blah-blahh-staging-001   Available   2021-01-29 12:57:49 -0800 PST   ReadWrite
```
Now, unfortunately, there's no CLI option on Velero 1.5.1 to edit a `backup-location`. So, let's edit the CRD instead.

```
kubectl -n velero edit backupstoragelocation.velero.io <NAME>
```
Using Vim, add/set the `spec.accessMode` to `ReadOnly`.

Then, verify that the backup-location is `ReadOnly` instead of `ReadWrite`.

``` shell
# Against new cluster (cluster #2)
$ velero get backup-locations                                                                                                                                                              
NAME      PROVIDER   BUCKET/PREFIX                          PHASE       LAST VALIDATED                  ACCESS MODE
default   azure      backups-azaks-blah-blahh-staging-001   Available   2021-01-29 12:57:49 -0800 PST   ReadOnly
```

## Try a restore

Great! Now let's try restoring from a _scheduled_ backup. This is assuming that you have some scheduled backups on your main cluster (cluster #1). If not, you'll have to skip this and create a manual backup.

``` shell
# Against new cluster (cluster #2)
$ velero backup get                                                                                                                                                                        
NAME                            STATUS      ERRORS   WARNINGS   CREATED                         EXPIRES   STORAGE LOCATION   SELECTOR
every-day-at-1-20210129010007   Completed   0        2          2021-01-28 17:00:07 -0800 PST   29d       default            <none>
every-day-at-1-20210128010006   Completed   0        2          2021-01-27 17:00:06 -0800 PST   28d       default            <none>
every-day-at-1-20210127010006   Completed   0        2          2021-01-26 17:00:06 -0800 PST   27d       default            <none>
every-day-at-1-20210126010006   Completed   0        2          2021-01-25 17:00:06 -0800 PST   26d       default            <none>
every-day-at-1-20210125010005   Completed   0        2          2021-01-24 17:00:05 -0800 PST   25d       default            <none>
every-day-at-1-20210124010005   Completed   0        2          2021-01-23 17:00:05 -0800 PST   24d       default            <none>
```

Pick a backup and restore it.

``` shell
velero restore create --from-backup every-day-at-1-20210129010007
```

Velero will also give you the command to check the progress. For example:
``` shell
# Against new cluster (cluster #2)
$ velero restore describe every-day-at-1-20210129010007-20210129130618
Name:         every-day-at-1-20210129010007-20210129130618
Namespace:    velero
Labels:       <none>
Annotations:  <none>

Phase:  InProgress

Started:    2021-01-29 13:06:19 -0800 PST
Completed:  <n/a>

Backup:  every-day-at-1-20210129010007

Namespaces:
  Included:  all namespaces found in the backup
  Excluded:  <none>

Resources:
  Included:        *
  Excluded:        nodes, events, events.events.k8s.io, backups.velero.io, restores.velero.io, resticrepositories.velero.io
  Cluster-scoped:  auto

Namespace mappings:  <none>

Label selector:  <none>

Restore PVs:  auto

```

It took only about a minute or two. For me, there were a few warnings and some errors. It tried to restore itself, therefore, there were some warnings related to that. But, most of the deployments did not work because of the container registry. In my case, I <mark>did not add the ACR integration with my new cluster</mark> so many of the images failed to pull down. Once I "attached" the ACR to AKS,  the deployments self-healed. 

## There might be unhealthy deployments

<mark>Expect some of the Kubernetes deployments to not work</mark>. In my case, the Rancher agent was not working because one with the same name and secret was already running in my main cluster (cluster #1). Therefore, Rancher server was denying my second agent.

Also, my NGINX ingress controller was not healthy. This was because when I configured it on my main cluster, I tied it to a public static IP on Azure. The new cluster's identity did not have permissions to modify that static IP nor did I want it to.

That's it. Thanks for reading.



