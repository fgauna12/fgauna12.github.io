---
layout: post
title: Creating Secure Service Connections in Azure DevOps
tags:
  - devops
date: 2019-12-08T13:33:21.920Z
featured: true
hidden: true
featured_image: /assets/uploads/programming-593312_640.jpg
comments: false
---
Creating quick service connections to Azure from Azure DevOps can be easy. Creating secured, easy-to-manage, connections is harder. 

<!--more-->

## The Easy Connections

If you're a Project Administrator or Endpoint Administrator on a Team project, you can create a new Service Connection. 
For Azure Service Connections, you also need Owner rights to the respective subscription and the ability on Azure Active Directory to create new app registrations. 

From a Team Project, you can go to _Settings_ and _Service Connections_. From there, you can create a new service connection. 

For more information, here's the [Microsoft docs](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure?view=azure-devops).

## Guidelines

Following the **principle of least priviledge**, the smaller the scope for a service principal the better. In other words, if you can scope it down to a _resource group_ even better. 

## The Problem

Today, when creating multiple Azure DevOps service principals with limited access, they will all show up with unfriendly names in Azure Active Directory. For a Team Project with many Azure service connections, you might end up with several service principals with the same name - making it very difficult to segregate access for each one.

### For example

I created two service connections with Azure DevOps. I scoped these to a `facundo-rg` resource group. 

From the IAM blade in `facundo-rg`, there's the service principals created for this team project. 

Although there's two service connections, they have the name names! The name is just a combination of the _Team Project_ and the _Subscription ID_.

It's impossible to see which service principal belongs to which Azure DevOps service connections.

## The Solution - Do it yourself

Note: Inspiration taken from the [Azure DevOps labs](https://azuredevopslabs.com/labs/devopsserver/azureserviceprincipal/)

**Bash**
``` bash

subscriptionId=[Some subscription Id]
resourceGroupName1=facundo-rg
resourceGroupName2=facundo2-rg
az ad sp create-for-rbac -n "test-my-app3" --role contributor \
    --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName1 \
             /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName2

```

Result will look like

``` json

{
  "appId": "[some app id]",
  "displayName": "test-my-app3",
  "name": "http://test-my-app3",
  "password": "[some password]",
  "tenant": "[some tenant]"
}

```

Then from Azure DevOps, use the link to manually complete the service connection.

- **Service Principal Client ID** - `appId`
- **Service Principal Key** - `password`
- **Tenant** - `tenant`
- **Subscription ID** - your subscription id
- **Subscription Name** - the name of your subscription

### Extra Credit 

Use the Azure DevOps extension for the Azure CLI to also automate the creation of the service connection. 
[See more here](https://docs.microsoft.com/en-us/cli/azure/ext/azure-devops/devops/service-endpoint/azurerm?view=azure-cli-latest#ext-azure-devops-az-devops-service-endpoint-azurerm-create).

_Note:_ [Install](https://docs.microsoft.com/en-us/azure/devops/cli/index?view=azure-devops) the Azure DevOps CLI extension first.


``` bash

teamProject="Service Principals Demo"
subscriptionId=$(az account show | jq -r '.id')
subscriptionName=$(az account show | jq -r '.name')
resourceGroupName1=facundo-rg
resourceGroupName2=facundo2-rg
name="test-my-app3"

response=$(az ad sp create-for-rbac -n $name --role contributor \
    --scopes /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName1 \
             /subscriptions/$subscriptionId/resourceGroups/$resourceGroupName2)

appId=$(echo $response | jq -r '.appId')
tenantId=$(echo $response | jq -r '.tenant')
export AZURE_DEVOPS_EXT_AZURE_RM_SERVICE_PRINCIPAL_KEY=$(echo $response | jq -r '.password')

az devops service-endpoint azurerm create --azure-rm-service-principal-id "$appId" \
                                          --azure-rm-subscription-id "$subscriptionId" \
                                          --azure-rm-subscription-name "$subscriptionName" \
                                          --azure-rm-tenant-id "$tenantId" \
                                          --name "$name" \
                                          --project "$teamProject"

```

