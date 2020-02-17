---
layout: post
title: Using Terraform from an Azure DevOps pipeline
tags:
  - devops
  - azure
date: 2020-02-17T01:59:48.553Z
featured: false
hidden: false
comments: false
---
There's a [lab out there](https://www.azuredevopslabs.com/labs/vstsextend/terraform/) showing how to use Terraform with Azure DevOps. I found it clunky. Here's a similar take using YAML pipelines.

<!--more-->

### Pre-Requisites

* [A service connection](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/connect-to-azure?view=azure-devops)
* [Azure DevOps extension](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.custom-terraform-tasks)
* A terraform configuration file with an Azure back-end declared

```hcl
provider "azurerm" {
 version = "~>1.43"
}
```

### Overview

Terraform uses *state files* to keep track of the desired state. When working in teams, it's very useful to keep this statefile in a central location so that you and your team members don't override each others changes. Terraform has many backends that store this state file including Azure.

The lab mentioned above, makes you create the storage account that will persist this state file. With these instructions, the pipeline will do it instead.

### Set-up

First define the following variables

```yaml
variables: 
 - name: TerraformBackend.ResourceGroup
   value: rg-realworld-staging-001
 - name: TerraformBackend.StorageAccount
   value: strwstagingterraform01
 - name: TerraformBackend.ContainerName
   value: staging
 - group: 'staging'
```

In the `staging` variable group, there's only settings corresponding to the application that will be deployed after the infrastructure is provisioned.

Then, let's set-up the Azure backend

```yaml
steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: '[name of your service connection]'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      az group create --location eastus --name $(TerraformBackend.ResourceGroup)
      
      az storage account create --name $(TerraformBackend.StorageAccount) --resource-group $(TerraformBackend.ResourceGroup) --location eastus --sku Standard_LRS
      
      az storage container create --name staging --account-name $(TerraformBackend.StorageAccount)

      STORAGE_ACCOUNT_KEY=$(az storage account keys list -g $(TerraformBackend.ResourceGroup) -n $(TerraformBackend.StorageAccount) | jq ".[0].value" -r)

      echo "setting storage account key variable"
      echo "##vso[task.setvariable variable=ARM_ACCESS_KEY;issecret=true]$STORAGE_ACCOUNT_KEY"
```

This step will use the Azure CLI to:

1. Create a storage account, storage container, and resource group for the Terraform state file
2. Read the account key for the storage account
3. Assign the account key to the `ARM_ACCESS_KEY` pipeline variable. It's important because pipeline variables are also mapped to environment variables

### Initializing

Then we'll want to initialize Terraform. But first, you'll want to make sure that you have Terraform installed on the build agent.

```yaml
- task: TerraformInstaller@0
  inputs:
    terraformVersion: '0.12.20'
```

Now, initialize Terraform.

```yaml
- task: TerraformTaskV1@0
  displayName: "Terraform Init"
  inputs:
    provider: 'azurerm'
    command: 'init'
    backendServiceArm: '[name of your service connection]'
    backendAzureRmResourceGroupName: $(TerraformBackend.ResourceGroup)
    backendAzureRmStorageAccountName: $(TerraformBackend.StorageAccount)
    backendAzureRmContainerName: '$(TerraformBackend.ContainerName)'
    backendAzureRmKey: 'infrastructure/terraform.tfstate'
    workingDirectory: '$(System.DefaultWorkingDirectory)/iac/staging/'
```

You'll want to ensure that your working directory points to the root of your Terraform module. In my case, I'm storing the Terraform configuration under the `iac` directory in my repository.

The environment variable `ARM_ACCESS_KEY` will be used by the Terraform Azure back-end provider to connect to the Storage Account. You can read more about it [here](https://www.terraform.io/docs/backends/types/azurerm.html#configuration-variables). I've had issues authenticating with just the service principal.

Once is Terraform is initialized, you'll ready to create infrastructure.

![](/assets/uploads/2020-02-16_21-38-22.png "Terraform initialized")

### Apply

When you apply, it's when the magic happens.

```yaml
- task: TerraformTaskV1@0
  displayName: "Terraform Apply Cluster GitOps"
  inputs:
    provider: 'azurerm'
    command: 'apply'
    workingDirectory: '$(System.DefaultWorkingDirectory)/iac/staging/'
    environmentServiceNameAzureRM: '[name of your service connection]'
    commandOptions: |
      -var "some_key=$(SomeValue)"
```

Now your Terraform plan will get executed and your state will be updated.

By the way, using the `commandOptions` you can also pass in input variables. But a cleaner way would be to use [environment variables](https://www.terraform.io/docs/configuration/variables.html#environment-variables). Any time you have a pipeline variable on Azure DevOps, it gets mapped to an environment variable. So, if you have a variable group with names that start with `TF_VAR` then Terraform will pick it up and pass the value to the input variable.

Save. Queue. Run!

![](/assets/uploads/2020-02-16_21-39-04.png "Terraform applied")
