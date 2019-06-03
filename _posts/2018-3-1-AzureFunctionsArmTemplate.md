---
layout: post
title:  "Creating an Azure Function ARM template"
date: 2018-01-03
categories: Azure Functions ARM Templates Infrastructure as Code DevOps
tags: pipelines infrastructure-as-code azure azure-functions
comments: true
---

Creating Azure functions is easy. Managing them can be a challenge. Much like microservices, functions can get problematic to maintain when having multiple environments. 
This is where _Infrastructure as Code_ can help. Although I don't particularly enjoy creating Azure Resource Manager (ARM) templates, I do enjoy the benefits of ARM.
**I can confidently say that my development environment is configured like production.**

> :raised_hand: Caution! Today, an azure function app whose plan is _consumption-based_ cannot be created in an existing resource group with a regular app service plan. The **workaround** is to create the consumption app service plan first, then the other app service plans for regular web apps.

## The ARM Template

If you're not already familiar with how to create ARM Templates, the [MSFT docs](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-create-first-template) have a great quickstart.

### The Resources

1. Storage Account
    - With the following connection strings:
        - `AzureWebJobsDashboard`
        - `AzureWebJobsStorage`
        - `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`
        - `WEBSITE_CONTENTSHARE`
2. Site (_kind: function_)
3. Service Plan (Consumption or App Service)

### Example

``` json
{
        "type": "Microsoft.Storage/storageAccounts",
        "name": "[variables('names-function-storage')]",
        "apiVersion": "2016-01-01",
        "location": "[resourceGroup().location]",
        "sku": {
          "name": "Standard_LRS"
        },
        "kind": "Storage",
        "properties": {}
    },
    {
        "apiVersion": "2015-08-01",
        "name": "[concat(parameters('environment-name'), '-', parameters('names-function-apps')[copyIndex()], '-fn')]",
        "copy": { 
            "name": "functionappscopy", 
            "count": "[length(parameters('names-function-apps'))]" 
         }, 
        "type": "Microsoft.Web/sites",
        "kind": "functionapp", 
        "location": "[resourceGroup().location]",
        "tags": {
            "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', variables('names-function-sp'))]": "Resource",
            "displayName": "[concat(parameters('environment-name'), '-', parameters('names-function-apps')[copyIndex()], '-fn')]"
        },
        "dependsOn": [
            "[concat('Microsoft.Web/serverfarms/', variables('names-function-sp'))]"
        ],
        "properties": {
            "name": "[concat(parameters('environment-name'), '-', parameters('names-function-apps')[copyIndex()], '-fn')]",
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', variables('names-function-sp'))]"
        }
    },
    {
        "apiVersion": "2014-06-01",
        "name": "[variables('names-function-sp')]",
        "type": "Microsoft.Web/serverfarms",
        "location": "[resourceGroup().location]",
        "tags": {
            "displayName": "[variables('names-function-sp')]"
        },
        "properties": {
            "name": "[variables('names-function-sp')]",
            "computeMode": "Dynamic",
            "sku": "Dynamic"
        }
    }
```

#### Parameters
- `environment-name` - A prefix that indicates the environment that the function belongs to (e.g. dev, staging, prod)
- `names-function-apps` - A list of names for the Azure function apps to deploy. (e.g. emails, voting, etc)

``` json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "environment-name": {
         "value": "dev-functions"
     }, 
     "names-function-apps": {
         "value": ["emails", "voting"]
     }
  }
}
```

#### Run the ARM Template

I enjoy using the [Azure CLI]. However, you could do the same using Powershell.

First login and select your Azure subscription.

Then create a resource group to deploy these functions to. 

``` bash
az group create -n dev-functions-example-rg -l EastUs
```

This resource group will represent your environment. I use the convention that the resource group also contains the environment name so that it's easy to find.

Then create a deployment and specifying the arm template and its parameters:

```
 az group deployment create -g dev-functions-example-rg -n ManualDeployment1 --template-file "Azure function arm template.json" --mode Incremental --parameters @functions.parameters.json
```

Example using `dev-facundo2` and an environment

![]({{site.baseurl}}/assets/2018-2-1/functionsarm_2.gif)

#### The Result

![]({{site.baseurl}}/assets/2018-2-1/functionsarm_1.PNG)




