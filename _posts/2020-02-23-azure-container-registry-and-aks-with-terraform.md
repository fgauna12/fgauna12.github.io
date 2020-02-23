---
layout: post
title: Azure container registry and AKS with Terraform
tags:
  - devops
  - azure
  - kubernetes
date: 2020-02-23T04:29:10.437Z
featured: false
hidden: false
comments: false
---
Here's a quick guide on how to provision an Azure Container Register with Terraform. Also, we'll cover how to grant AKS permissions to read from the newly created registry.

<!--more-->

### Creating the registry

First, what I like to do is specify my naming convention using *locals*.

```hcl
provider "azurerm" {
  version = "~>1.43"
}

locals {
  environment_name        = "shared"
  resource_group_name     = "rg-appname-${local.environment_name}-001"
  container_registry_name = "companyname"
  location                = "eastus"
}
```

Then, using the variables specified above, create the resource group and the container registry.

```hcl
resource "azurerm_resource_group" "rg" {
  name     = local.resource_group_name
  location = local.location
}

resource "azurerm_container_registry" "acr" {
  name                     = local.container_registry_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  sku                      = "Standard"
  admin_enabled            = false
}
```

You'll also have access to an `id` attribute on the container registry once it's created. It will be the *resource id* in Azure. You will need this `id` in order to create a role assignment for an AKS cluster to read from this container registry.

### Permitting an AKS cluster

Let's say you're creating an AKS cluster like the following.

```hcl
resource "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = var.cluster_name

  service_principal {
    client_id     = var.aks_service_principal_client_id
    client_secret = var.aks_service_principal_client_secret
  }
}
```

(Removed some attributes for brevity)

Given that you're also creating a service principal for this AKS cluster, then you can grant permissions to the service principal that AKS will use so that it can read from the container registry. There's a built-in group of [acr pull](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-roles).

So, here's how you can do this from Terraform.

First, you have to find out the object id of the service principal. This is different than the client id or the application id that you might be used to.

You do this by using a data source and querying for it. <mark>You'll have to use the Azure AD provider.</mark>

```hcl
provider "azuread" {
  version = "~>0.7"
}

data "azuread_service_principal" "aks_principal" {
  application_id = var.aks_service_principal_client_id
}
```

<mark><em>Note:</em>If you're running your Terraform plan using a service principal, make sure it has the necessary permissions to read applications from Azure AD</mark>. [Read more here.](https://www.terraform.io/docs/providers/azuread/d/service_principal.html)

![](/assets/uploads/azuread-applications.png "Granting permission to service principal running Terraform")

Then you can create a role-assignment on the container registry for the built-in role of `AcrPull`.

```hcl
resource "azurerm_role_assignment" "acrpull_role" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  principal_id                     = data.azuread_service_principal.aks_principal.id
  skip_service_principal_aad_check = true
}
```
