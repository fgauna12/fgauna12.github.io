---
layout: post
title: Using resource group locks from a pipeline
tags:
  - devops
  - azure
date: 2020-01-03T13:28:45.682Z
featured: false
hidden: false
comments: false
---
A few days ago, I talked about one of [the most underutilized features](https://gaunacode.com/the-most-underutilized-feature-in-azure) in Azure - resource group locks. Resource group locks lessen the chance to manual mistakes and especially *read-only resource group locks*. Especially when coupled with the use of a pipeline, we can then create a process where only changes to production can be made by first committing to source control and secondly pushing the change through a pipeline.

<!--more-->

First, create a service principal that has `Owner` rights on the subscription. It's by design that only owners can apply and remove resource group locks. Once you have a service principal, create an Azure Resource Manager service connection in Azure DevOps. You can try do it backwards and grant an auto-generated service principal *Owner* rights. I prefer to use a script like [this one](https://gaunacode.com/admin/#/collections/blog/entries/2019-12-08-creating-secure-service-connections-in-azure-devops) to create the service connection and service principal.

After you have a service connection using a service principal with Owner rights, you will be able to apply a resource group lock using Powershell, ARM Template, or Azure CLI. My preferred way is to use the ARM Template. 

Here's what it can look like: 

``` json
{
    "type": "Microsoft.Authorization/locks",
    "apiVersion": "2016-09-01",
    "name": "readonly",
    "dependsOn": [
        "[resourceId('Microsoft.Web/sites', parameters('name'))]",
        "[concat('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]"
    ],
    "properties": {
        "level": "ReadOnly",
        "notes": "Resource group is readonly"
    }
}
```

Once you are applying the resource group lock, you'll also want to remove any existing locks prior to deployment because otherwise your deployment will fail. You can do this via Azure Powershell or Azure CLI. Using the CLI it's very simple: `az group lock delete -g myresourcegroup -n readonly`. Just notice how the name of the lock is `readonly` and it's used in both the creation and deletion. 

## Putting it all together

So from your pipeline, the flow would be:

1. Remove any existing resource group locks.
2. Apply any resource group locks 
3. Perform the deployment

Using YAML and an ARM template, it could look like this:

``` yaml
- task: AzureCLI@2
  displayName: "Delete resource group lock"
  inputs:
    azureSubscription: '$(Azure.ServiceConnection)'
    scriptType: bash
    scriptLocation: 'inlineScript'
    inlineScript: 'az group lock delete -g $(ResourceGroup) -n readonly'
- task: AzureResourceManagerTemplateDeployment@3
  displayName: ARM Template Deployment
  inputs:
    deploymentScope: 'Resource Group'
    azureResourceManagerConnection: '$(Azure.ServiceConnection)'
    action: 'Create Or Update Resource Group'
    resourceGroupName: '$(ResourceGroup)'
    location: 'East US'
    templateLocation: 'Linked artifact'
    csmFile: '$(Pipeline.Workspace)/iac/armdeploy.json'
    csmParametersFile: '$(Pipeline.Workspace)/iac/armdeploy.parameters.json'
    overrideParameters: "-name azapp-codecampster-$(Environment)-001
                        -hostingPlanName azapp-codecampster-$(Environment)-001-sp
                        -fullImageTag $(FullImageTag)"
    deploymentMode: 'Incremental'
```

You can see the full pipeline example [here](https://github.com/onetug/Codecampster/blob/master/pipelines/main.yml)
