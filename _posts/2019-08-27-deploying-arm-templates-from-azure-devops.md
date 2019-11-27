---
layout: post
title: ARM Template Outputs from Azure Pipelines
categories: Azure DevOps
date: 2019-08-27T00:00:00.000Z
featured: false
hidden: false
featured_image_thumbnail: /assets/uploads/quick-start-center.svg
featured_image: ''
comments: true
---
Deploying Azure Resource Manager (ARM) templates from Azure DevOps is very powerful. It encourages developers and operators to maintain a declarative file describing the infrastructure on Azure. Also helps prevent pesky environment drifts because of someone clicking from the portal to make changes. But, deploying these ARM templates can be daunting. Here's some tips.

<!--more-->

## Getting Started

Assuming you have an ARM template ready and committed to a repository, you'll want to start with adding the [Azure Resource Group Deployment task](AzureResourceGroupDeployment@2)

## 1. Deploying the ARM template

In YAML, your task could look like this:

```yaml
- task: AzureResourceGroupDeployment@2
  displayName: Deploy ARM Template to Create CDN
  inputs:
    azureSubscription: $(azureServiceEndpoint)
    action: 'Create Or Update Resource Group'
    resourceGroupName: $(resourceGroup)
    location: 'East US'
    templateLocation: 'Linked artifact'
    csmFile: '$(Pipeline.Workspace)/drop/arm/cdn-blob.json'
    overrideParameters: '-environment $(environment) -appName $(spaNameNoDashes)'
    deploymentMode: 'Incremental'
```

## 2. Reading Output Variables from the ARM template

It's often useful to use ARM template output variables so that you can use those variables from subsequent tasks.

For example:

* What's the FQDN for a resource that was just created?
* What's the storage account key that was just created?

After having assigned output variables, you can read them from the pipeline by specifying a name for the `outputVariable`. For instance:

```yaml
- task: AzureResourceGroupDeployment@2
  displayName: Deploy ARM Template to Create CDN
  inputs:
    azureSubscription: $(azureServiceEndpoint)
    action: 'Create Or Update Resource Group'
    resourceGroupName: $(resourceGroup)
    location: 'East US'
    templateLocation: 'Linked artifact'
    csmFile: '$(Pipeline.Workspace)/drop/arm/cdn-blob.json'
    overrideParameters: '-environment $(environment) -appName $(spaNameNoDashes)'
    deploymentMode: 'Incremental'
    outputVariable: 'ArmOutputs'
```

## 3. Reading the output variables (Powershell)

Using Powershell, you could use the following script:

```powershell
function Convert-ArmOutputToPsObject {
  param (
    [Parameter(Mandatory=$true)]
    [string]
    $ArmOutputString
  )

  if ($PSBoundParameters['Verbose']) {
    Write-Host "Arm output json is:"
    Write-Host $ArmOutputString
  }

  $armOutputObj = $ArmOutputString | ConvertFrom-Json

  $armOutputObj.PSObject.Properties | ForEach-Object {
      $type = ($_.value.type).ToLower()
      $keyname = "ArmOutputs.$($_.name)"
      $value = $_.value.value

      if ($type -eq "securestring") {
          Write-Host "##vso[task.setvariable variable=$keyname;issecret=true]$value"
          Write-Host "Added Azure DevOps secret variable '$keyname' ('$type')"
      } elseif ($type -eq "string") {
          Write-Host "##vso[task.setvariable variable=$keyname]$value"
          Write-Host "Added Azure DevOps variable '$keyname' ('$type') with value '$value'"
      } else {
          Throw "Type '$type' is not supported for '$keyname'"
      }
  }
}
```

So from the pipeline, it could look like this:

```yaml
- powershell: |
    function Convert-ArmOutputToPsObject {
      param (
        [Parameter(Mandatory=$true)]
        [string]
        $ArmOutputString
      )

      if ($PSBoundParameters['Verbose']) {
        Write-Host "Arm output json is:"
        Write-Host $ArmOutputString
      }

      $armOutputObj = $ArmOutputString | ConvertFrom-Json

      $armOutputObj.PSObject.Properties | ForEach-Object {
          $type = ($_.value.type).ToLower()
          $keyname = "ArmOutputs.$($_.name)"
          $value = $_.value.value

          if ($type -eq "securestring") {
              Write-Host "##vso[task.setvariable variable=$keyname;issecret=true]$value"
              Write-Host "Added Azure DevOps secret variable '$keyname' ('$type')"
          } elseif ($type -eq "string") {
              Write-Host "##vso[task.setvariable variable=$keyname]$value"
              Write-Host "Added Azure DevOps variable '$keyname' ('$type') with value '$value'"
          } else {
              Throw "Type '$type' is not supported for '$keyname'"
          }
      }
    }

    Convert-ArmOutputToPsObject -ArmOutputString '$(ArmOutputs)' -Verbose
  displayName: "Parsing outputs from ARM deployment to pipeline variables"
```

## But why?

There is an extension called [Arm Outputs](https://marketplace.visualstudio.com/items?itemName=keesschollaart.arm-outputs). It works by quering the Azure Resource Manager API to see the last deployment and query the outputs from this API. Therefore, theoretically it's possible if multiple pipelines deploy to the same resource group, there could be a race condition.
