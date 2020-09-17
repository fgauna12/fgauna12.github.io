---
layout: post
title: "AKS Cost Savings: Stopping dev/test AKS clusters during off hours"
tags:
  - devops
  - azure
  - kubernetes
date: 2020-09-18T21:43:12.131Z
featured: false
hidden: false
comments: false
---
Today, it's possible to stop the virtual machine scale set (vmss) driving an AKS cluster. 
You can do this in many ways, including the Azure CLI. In this post, I'll guide you through running an Azure CLI script to stop an AKS' cluster vmss for dev/test purposes. We'll use Azure DevOps pipelines for the scheduling portion since Azure Automation Accounts do not support Azure CLI.

<!--more--> 
## Beware
:warning: Looks like the AKS team is working on a more elegant solution through the Azure CLI. So parts of this post will become irrelevant in the future. 

Also, only use this for <mark>dev/test purposes</mark> please.

## Stopping the vmss

Create a bash script called `aks-stop.sh`. 

``` sh
#!/bin/bash

CLUSTER_NAME=$1
RESOURCE_GROUP=$2

NODE_RESOURCE_GROUP=$(az aks show -g $RESOURCE_GROUP -n $CLUSTER_NAME --query "nodeResourceGroup" -o tsv)

az vmss list -g $NODE_RESOURCE_GROUP --query "[].name" -o tsv | while read -r scale_set
do 
    echo "Shutting down scaleset in the AKS resource group. Scale Set: $scale_set"
    az vmss deallocate -g $NODE_RESOURCE_GROUP -n $scale_set
done
```

To test it, login to Azure (`az login`) and the correct subscription (`az account set -s [subscription id]`. 

Invoke the script. 

``` sh
CLUSTER_NAME="[your cluster name]"
RESOURCE_GROUP="[resource group name]"

source ./aks-stop.sh "$CLUSTER_NAME" "$RESOURCE_GROUP"
```

### What does it do?

It looks up the AKS cluster and gets the resource group where the underlying vmss are. Then it iterates through all the vmss in the resource group and deallocates them.

<mark>If you have more than one node pool, it will stop all the node pools.</mark>

Once the vmss is deallocated, a `kubectl` command will show that the nodes are not ready.

```
$ kubectl get nodes
NAME                       STATUS     ROLES   AGE    VERSION
aks-default-1-vmss000000   NotReady   agent   5d2h   v1.18.6
aks-default-2-vmss000001   NotReady   agent   5d2h   v1.18.6
aks-default-3-vmss000002   NotReady   agent   5d2h   v1.18.6

```

## Start the vmss

Create a bash script called `aks-start.sh`.

``` sh
#!/bin/bash

CLUSTER_NAME=$1
RESOURCE_GROUP=$2

NODE_RESOURCE_GROUP=$(az aks show -g $RESOURCE_GROUP -n $CLUSTER_NAME --query "nodeResourceGroup" -o tsv)

az vmss list -g $NODE_RESOURCE_GROUP --query "[].name" -o tsv | while read -r scale_set
do 
    echo "Starting scaleset in the AKS resource group. Scale Set: $scale_set"
    az vmss start -g $NODE_RESOURCE_GROUP -n $scale_set
done
```

Invoke the script. 

``` sh
CLUSTER_NAME="[your cluster name]"
RESOURCE_GROUP="[resource group name]"

source ./aks-start.sh "$CLUSTER_NAME" "$RESOURCE_GROUP"

### What does it do?

Similarly to the first script, it will start all the vmss. If you have more than one node pool, it will do so as well. 

```
$ kubectl get nodes
NAME                       STATUS   ROLES   AGE    VERSION
aks-default-1-vmss000000   Ready    agent   5d2h   v1.18.6
aks-default-2-vmss000001   Ready    agent   5d2h   v1.18.6
aks-default-3-vmss000002   Ready    agent   5d2h   v1.18.6

```

## Scheduling for off-hours

Azure Automation accounts unfortunately don't support the Azure CLI. It is possible to run Python. I find using Azure DevOps very good for this since YAML pipelines support cron-style scheduled triggers.


