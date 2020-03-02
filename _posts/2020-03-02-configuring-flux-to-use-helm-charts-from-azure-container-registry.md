---
layout: post
title: Configuring Flux to use Helm charts from Azure Container Registry
tags:
  - devops
  - azure
  - kubernetes
date: 2020-03-02T00:51:15.468Z
featured: false
hidden: false
comments: false
---
Flux watches a Git repository containing Kubernetes manifests and it applies changes to the cluster. Realistically, you will also use Helm charts. You can install the Flux Helm operator so that you can declare what Helm charts should be installed on the cluster.

<!--more--> 

For example, install the Helm chart `realworld-backend` version 0.1.0 that is stored in my Azure container Registry.

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: realworld-backend
  namespace: realworld
spec:
  releaseName: realworld-backend
  chart:
    repository: https://[your registry].azurecr.io/helm/v1/repo/
    name: realworld-backend
    version: 0.1.0
  values:
    image:
      repository: [your registry].azurecr.io/backend/realworld-backend
      tag: 20200301.5
```

### Background

I wrote a [blog post](https://gaunacode.com/installing-fluxcd-using-azure-devops-and-helm-on-aks) recently on how to install Flux from Azure DevOps. We'll be extending on that today.

Also, yesterday I wrote a guide on how to publish a Helm chart to an Azure Container Registry. See [Part 1](https://gaunacode.com/publishing-helm-3-charts-to-azure-container-registry-using-azure-devops-part-1) and [Part 2](https://gaunacode.com/publishing-helm-3-charts-to-azure-container-registry-using-azure-devops-part-2).

## Configuring Flux

Here's the thing. It's a bit quirky. Thankfully, other people have ran into this before. With luck, you will too.

There's [an issue](https://github.com/fluxcd/flux/issues/1726) on GitHub where people are trying to get this working. They discover that in order for this to work with Azure Container Registry, you have to configure Helm's `repositories.yaml` explicitly. 

### The quirky configuration

Again, you have to configure Helm's `repositories.yaml` on Flux's Helm operator that's running on the cluster. It's not straight forward or well documented.

This is what the `repositories.yaml` has to look like on the Kubernetes cluster.

```yaml
apiVersion: v1
repositories:
- caFile: ""
  cache: ...
  certFile: ""
  keyFile: ""
  name: [name of your acr or repo]
  password: [service principal client secret]
  url: https://[your acr name].azurecr.io/helm/v1/repo/
  username: [service principal client id]
```

We **must** provide:

1. The repo name. 
2. The client id of a service principal that has at least `AcrPull` rights to your ACR
3. The client secret of that service principal
4. The url of your ACR Helm endpoint. <mark>It must end with a slash.</mark>

Thankfully, the Helm chart to install the Helm operator supports this.

This is are the [possible values](https://github.com/fluxcd/helm-operator/blob/master/chart/helm-operator/values.yaml) for Flux's Helm chart operator.

```yaml
# For charts stored in Helm repositories other than stable
# mount repositories.yaml configuration in a volume
configureRepositories:
  enable: false
  volumeName: repositories-yaml
  secretName: flux-helm-repositories
  cacheVolumeName: repositories-cache
  repositories:
    # - name: bitnami
    #   url: https://charts.bitnami.com
    #   username:
    #   password:
    #   caFile:
    #   certFile:
    #   keyFile:
```

Great! So as you can see, we'll be able to specify the 4 attributes we need during installation of Flux's Helm operator. 

```yaml
echo "installing flux. installing the helm operator"
helm upgrade -i helm-operator fluxcd/helm-operator \
  --set git.ssh.secretName=flux-git-deploy \
  --namespace flux \
  --set helm.versions=v3 \
  --set configureRepositories.enable=true \
  --set configureRepositories.repositories[0].name=$(ACR.Name),configureRepositories.repositories[0].url=$(ACR.Url),configureRepositories.repositories[0].username=$(KubernetesServicePrincipal.ClientId),configureRepositories.repositories[0].password=$(KubernetesServicePrincipal.ClientSecret)
```

First, we set `configureRepositories.enable` to true.

Then we specify the `name`, `url`, `username`, and `password` of the repository configuration. We use an array notation because there can be multiple repository configurations.

That's it. Install/upgrade Flux's Helm operator.

Flux should have the necessary information to authenticate against Azure Container Registry to pull down any Helm charts you might have stored there.

I am assuming you already have a service principal to plug in. It must have at least `AcrPull` access to the registry. **If you don't have a service principal, see the section below.**

Now, from your manifests repo, you should be able to declare custom Helm charts that reside in your very own Azure Container Registry.

Then Flux will ensure this Helm chart with this specific version is on the cluster.

**Tada!**

#### Service Principal

If you don't have a service principal, you can create one using the Azure CLI. This Microsoft [docs page](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-auth-service-principal#create-a-service-principal) can be very useful to you.

Based on the Microsoft docs. Here's a script. Your `--role` could be just `acrpull` since Flux will only need to pull Helm charts down.

```bash
#!/bin/bash

# Modify for your environment.
# ACR_NAME: The name of your Azure Container Registry
# SERVICE_PRINCIPAL_NAME: Must be unique within your AD tenant
ACR_NAME=<container-registry-name>
SERVICE_PRINCIPAL_NAME=acr-service-principal

# Obtain the full registry ID for subsequent command args
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create the service principal with rights scoped to the registry.
# Default permissions are for docker pull access. Modify the '--role'
# argument value as desired:
# acrpull:     pull only
# acrpush:     push and pull
# owner:       push, pull, and assign roles
SP_PASSWD=$(az ad sp create-for-rbac --name http://$SERVICE_PRINCIPAL_NAME --scopes $ACR_REGISTRY_ID --role acrpull --query password --output tsv)
SP_APP_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output the service principal's credentials; use these in your services and
# applications to authenticate to the container registry.
echo "Service principal ID: $SP_APP_ID"
echo "Service principal password: $SP_PASSWD"
```
