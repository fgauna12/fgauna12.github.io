---
layout: post
title: "AKS Cost Savings: Stopping dev/test AKS clusters during off hours"
tags:
  - devops
  - azure
  - kubernetes
date: 2020-09-18T19:03:54.760Z
featured: false
hidden: false
featured_image_thumbnail: /assets/uploads/coins.jpg
featured_image: /assets/uploads/coins.jpg
comments: false
---
Today, it's possible to stop the virtual machine scale set (vmss) driving an AKS cluster. 
You can do this in many ways, including the Azure CLI. In this post, I'll guide you through running an Azure CLI script to stop the vmss of an AKS cluster for dev/test purposes. We'll use Azure DevOps pipelines for the scheduling portion since Azure Automation Accounts do not support Azure CLI.

Based on rough calculations, this approach could save you roughly <mark>46%</mark> on costs.

<!--more--> 

Edit: As suspected, Microsoft released a way to start/stop AKS clusters through the CLI, you no longer need to stop the AKS scale sets yourself.

## Option A (Preferred)

Microsoft released the preview feature as an Azure CLI extension. Follow the steps on [this Microsoft docs page](https://docs.microsoft.com/en-us/azure/aks/start-stop-cluster) on how to install this extension. <mark>You can come back to this page to see how to schedule a script</mark> to start/stop a cluster during off hours using Azure Pipelines.

## Option B (DIY)
### Stopping the cluster

Create a bash script called `aks-stop.sh`. 

```sh
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

```sh
CLUSTER_NAME="[your cluster name]"
RESOURCE_GROUP="[resource group name]"

source ./aks-stop.sh "$CLUSTER_NAME" "$RESOURCE_GROUP"
```

Once the script runs, a `kubectl` command will show that the nodes are not ready.

```console
$ kubectl get nodes
NAME                       STATUS     ROLES   AGE    VERSION
aks-default-1-vmss000000   NotReady   agent   5d2h   v1.18.6
aks-default-2-vmss000001   NotReady   agent   5d2h   v1.18.6
aks-default-3-vmss000002   NotReady   agent   5d2h   v1.18.6
```

#### What does it do?

It finds the resource group where the underlying vmss are for the AKS cluster. Then it iterates through all the vmss in the resource group and deallocates them.

<mark>If you have more than one node pool, it will stop all the node pools.</mark>

## Start the vmss

Create a bash script called `aks-start.sh`.

```sh
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

```sh
CLUSTER_NAME="[your cluster name]"
RESOURCE_GROUP="[resource group name]"

source ./aks-start.sh "$CLUSTER_NAME" "$RESOURCE_GROUP"
```

Then you will see shortly that the nodes are ready.

``` console
$ kubectl get nodes
NAME                       STATUS   ROLES   AGE    VERSION
aks-default-1-vmss000000   Ready    agent   5d2h   v1.18.6
aks-default-2-vmss000001   Ready    agent   5d2h   v1.18.6
aks-default-3-vmss000002   Ready    agent   5d2h   v1.18.6
```

## Scheduling for off-hours

Here's how to "stop" your AKS cluster after-hours and then start it in the morning.

Azure Automation accounts unfortunately don't support the Azure CLI. I find using Azure DevOps very good for this since YAML pipelines support cron-style scheduled triggers.

For example, this is how to trigger a pipeline starting at 6 pm EST. (Note: Azure Pipeline schedules have to be in UTC).
For more information on the format, [here's the detailed documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/scheduled-triggers?view=azure-devops&tabs=yaml).

```yaml
pr: none 
trigger: none
schedules:
- cron: "0 23 * * 1-5"
  displayName: "After-hours (11 pm UTC)"
  always: true
  branches:
    include:
    - master
```

Another example, to trigger pipelines at 7 am EST:

```yaml
pr: none 
trigger: none
schedules:
- cron: "0 11 * * 1-5"
  displayName: "Mornings (11 am UTC)"
  always: true
  branches:
    include:
    - master
```

### Putting it together

Here's an example of a pipeline **starting** the cluster each morning at 7 am EST.

```yaml
pr: none 
trigger: none
schedules:
- cron: "0 11 * * 1-5"
  displayName: "Mornings (11 am UTC)"
  always: true
  branches:
    include:
    - master

variables:
  ClusterName: [name of cluster]
  ResourceGroup: [name of resource group]

steps:
  - task: AzureCLI@2
    inputs:
      azureSubscription: '[subscription service connection]'
      scriptType: 'bash'
      scriptLocation: 'scriptPath'
      scriptPath: './aks-start.sh'
      arguments: '"$(ClusterName)" "$(ResourceGroup)"'
```

Here's an example of a pipeline **stopping** the cluster each morning at 7 pm EST.

```yaml
pr: none 
trigger: none
schedules:
- cron: "0 23 * * 1-5"
  displayName: "After-hours (11 pm UTC)"
  always: true
  branches:
    include:
    - master

variables:
  ClusterName: [name of cluster]
  ResourceGroup: [name of resource group]

steps:
  - task: AzureCLI@2
    inputs:
      azureSubscription: '[subscription service connection]'
      scriptType: 'bash'
      scriptLocation: 'scriptPath'
      scriptPath: './aks-stop.sh'
      arguments: '"$(ClusterName)" "$(ResourceGroup)"'
```