---
layout: post
title: Deploying an AKS cluster through Terraform Cloud
tags:
  - devops
  - azure
  - kubernetes
date: 2020-02-10T01:59:27.362Z
featured: false
hidden: false
comments: false
---
There's already a [nice guide by Microsoft](https://docs.microsoft.com/en-us/azure/terraform/terraform-create-k8s-cluster-with-tf-and-aks) on how to provision an AKS cluster using Terraform. It uses the Azure Storage backend provider for storing the Terraform data. What if you want to use Terraform Cloud instead? Terraform Cloud also allows you to store your state. Anyway, I have an example for you.

<!--more-->

## Pre-Requisites

* Visual Studio Code and Terraform Extension
* Create a new directory to put your files
* Create a service principal for Terraform 

  * `az ad sp create-for-rbac --name [choose a name for terraform sp]`
  * Keep track of the `appId` and `password` and `tenant`
* Create another service principal for AKS

  * `az ad sp create-for-rbac --name [choose a name for aks sp]`
  * Keep track of the `appId` and `password` and `tenant`

If you need more help creating service principals, here's [a guide](https://docs.microsoft.com/en-us/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest). You do need significant access in Azure AD and an Azure subscription to do this.

## The Main File

Create a file called `main.tf`. This file will set the Azure provider for Terraform and also declare the AKS cluster and the resource group.

<mark>Main difference with MSFT's tutorial: you don't need the azure storage backend. Terraform Cloud is acting as the backend and keeping the state.</mark>

```hcl
provider "azurerm" {
  version = "=1.43.0"
}

resource "azurerm_resource_group" "resource_group" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = azurerm_resource_group.resource_group.name
  dns_prefix          = var.dns_prefix

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = var.node_size
  }

  service_principal {
    client_id     = var.service_principal.client_id
    client_secret = var.service_principal.client_secret
  }

  tags = {
    Environment = var.environment
  }
}
```

As you can see, there will be some variable that will be required. 

## The Variables

Next define a file called `variables.tf`. It will define the input variables to this terraform sample we're building.

```hcl
﻿
variable "cluster_name" {

}

variable "resource_group_name" {

}

variable "environment" {

}

variable "location" {
  default = "East US"
}

variable "node_count" {
  default = 3
}

variable "node_size" {
  default = "Standard_D2_v2"
}

variable "service_principal" {
  type = object({
    client_id     = string
    client_secret = string
  })
  description = "The service principal to use"
}

variable dns_prefix {
}
﻿
```

Notice how we're being fancy and the `service_principal` is a complex object. This will be the service principal used by the AKS cluster. You also have another one that will be used by Terraform Cloud using the Azure provider to authenticate and deploy the infrastructure.

## The Outputs

For the last file, create a `outputs.tf` file. It will hold the output variables. We won't really use them in this example. With these variables, you'll be able to use this to issue `kubectl` commands on your cluster after creation.

```hcl
output "client_certificate" {
  value = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.aks_cluster.kube_config_raw
}
```

### GitHub

If you haven't already, commit your files to a new GitHub repo of your choice. When you create the repo, you can select a base *gitignore* for Terraform. Very useful.

### Terraform Cloud

Create a new workspace. Choose the source. It should be the newly created repo.

![](/assets/uploads/terraform_create_workspace.png "Terraform create workspace")

Once it finishes creating, select "Configure Variables".\
\
These are all the variables you'll need.

![](/assets/uploads/aks_terraform_cloud.png#wide "Variable to use in Terraform Cloud")

##### Terraform Variables

* `resource_group_name` - The name of the resource group to create (ex. `rg-jimmy-aks-test-001`)
* `cluster_name` - The name of the AKS cluster (eg. `aks-jimmy-test-001`)
* `environment` - The name of the environment (eg. `test`)
* `location` - The Azure region to use (eg. `eastus`)
* `dns-prefix` - The DNS prefix for your AKS cluster. (ex. same as aks cluster)
* `service_principal` (object) - Requires both `clientId` and `clientSecret`. The `clientId` is the `applicationId` of the *second* service principal. The `clientSecret` is the `password` of the *second* service principal.

Sorry about the fancy... but the value should look like this:

```hcl
{ client_id = "[application id from second sp]", client_secret = "[password of the second sp]" }
```

**Also**, you want to ensure that you check off `HCL` and `Sensitive.`

##### Environment Variables

* `ARM_SUBSCRIPTION_ID` - The subscription ID to deploy too. Also, both service principals you created should be in this subscription.
* `ARM_CLIENT_ID` - The `applicationId` of the first service principal
* `ARM_TENANT_ID` - The `tenant` of the first service principal
* `ARM_CLIENT_SECRET` - The `password of the first service principal

### Give it a go

Queue up a plan. Confirm and apply. You should have a brand new AKS cluster with 3 nodes. Also, every time you commit to the repo, it will re-issue a deployment.

![](/assets/uploads/terraform_aks_cloud_complete.png#wide "Terraform Cloud provisioned AKS")
