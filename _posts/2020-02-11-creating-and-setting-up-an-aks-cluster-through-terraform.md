---
layout: post
title: Creating and setting-up an AKS cluster through Terraform
tags:
  - devops
  - kubernetes
  - azure
date: 2020-02-11T21:15:05.750Z
featured: false
hidden: false
comments: false
---
In order to issue commands against a Kubernetes cluster, you need the kubernetes provider and establish a connection. In many cases, you can specify a kubeconfig file from Terraform. But what if your cluster is ephemeral? What if you want to create and do some basic set-up against the cluster through **one declarative script**?

<!--more--> 

### The Kubernetes Provider

Another option from the Kubernetes provider, is to avoid using the config file by specifying `load_config_file` to *false*.

```hcl
provider "kubernetes" {
  host                   = "some host"
  username               = "some username"
  password               = "some password"
  client_certificate     = "some client certificate"
  client_key             = "some client key"
  cluster_ca_certificate = "some ca certificate'

  load_config_file = "false"
}
```

When you turn off the config file authentication, you need to specify other parameters to grant the provider enough information to connect to the cluster. Luckily, you can get these values from output variables when you provision the cluster.

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

Then your Kubernetes provider would look like this

```hcl
provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host
  username               = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.username
  password               = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.password
  client_certificate     = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)

  load_config_file = "false"
}
```

### Installing apps

<mark><em>Edit</em>: If you try the approaches below, you will have to do them from a separate Terraform plan. Because, if you try to deploy using the Kubernetes or Helm provider without an existing cluster, then validation will fail due <a href="https://github.com/hashicorp/terraform/issues/10462">this limitation</a> and <a href="https://github.com/hashicorp/terraform/issues/2430">this limitation</a>.</mark>

Once the connection is establish, the hard part if over. You can use the kubernetes provider to create namespaces.

```hcl
resource "kubernetes_namespace" "app_namespace" {
  metadata {
    name = "my-namespace"
  }
}
```

Or you could choose to install something like Redis through the Helm provider which takes in the same arguments as the kubernetes provider.

```hcl
provider "helm" {
  kubernetes {
    host                   = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.host
    username               = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.username
    password               = azurerm_kubernetes_cluster.aks_cluster.kube_config.0.password
    client_certificate     = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_certificate)
    client_key             = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.client_key)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks_cluster.kube_config.0.cluster_ca_certificate)

    load_config_file = "false"
  }
}

resource "helm_release" "my_redis" {
  name  = "my-release"
  chart = "stable/redis"
}
```
