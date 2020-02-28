---
layout: post
title: >-
  Publishing Helm 3 charts to Azure Container Registry using Azure DevOps - Part
  1
tags:
  - devops
  - azure
  - containers
date: 2020-02-27T23:43:18.067Z
featured: false
hidden: false
comments: false
---
Did you know you can publish Helm charts to an Azure Container Registry? It can be useful. Charts can be shared more easily with others or other business units. But also, when using a GitOps workflow, we can [reference these Helm charts](https://docs.fluxcd.io/projects/helm-operator/en/1.0.0-rc9/references/helmrelease-custom-resource.html).

This is a quick guide on how to publish a Helm 3 chart to an Azure Container Registry.

<!--more-->

### Background

In Helm 2, you needed to install Tiller on your Kubernetes cluster in order to deploy Helm charts. Sure, there were other ways of using it too. With Helm 2, you could upload Helm charts to an Azure Container Registry. These charts could be tagged and versioned.

In Helm 3, there's no more Tiller. That's great! Makes things much simpler. We only need the client side tool. 

There's also a new standard for uploading artifacts to a container registry other than containers. The standard is Open Container Initiative (OCI) artifacts. In cloud native applications, applications are usually more involved than just container images. There's Helm charts, there's Terraform, maybe ARM, and other file-based artifacts. 

If you're curious about the background, there's this [great blog post](https://stevelasker.blog/2019/01/25/cloud-native-artifact-stores-evolve-from-container-registries/) from a Microsoft engineer.

Also, this blog post has been inspired by [this doc](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-helm-repos) from Microsoft.

### Pre-Requisites

* An Azure Container Registry
* A service connection to an Azure Subscription
* A service connection to the container registry

First, you want to install [Oras](https://github.com/deislabs/oras), a CLI tool for managing OCI artifacts.

```yaml
- bash: |
    set -e
    curl -LO https://github.com/deislabs/oras/releases/download/v0.8.1/oras_0.8.1_linux_amd64.tar.gz
    mkdir -p oras-install/
    tar -zxf oras_0.8.1_*.tar.gz -C oras-install/
    sudo mv oras-install/oras /usr/local/bin/
    sudo rm -rf oras_0.8.1_*.tar.gz oras-install/
```

The first line `set -e` forces the Bash script to fail the build in the event of an error. 

Once Oras is installed, you want to authenticate against the Azure Container Registry. From the Microsoft guide, it states you have two options. Login through Azure CLI or straight through OCI. I prefer Azure CLI since I already have an Azure service connection.

```yaml
- task: AzureCLI@2
  displayName: Login to ACR
  inputs:
    azureSubscription: "$(Azure.ServiceConnection)"
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: |
        az --version
        az acr login --name $(ACR.Name)
```

Now, that you have Azure CLI installed, you are ready to issue commands to upload your OCI artifacts. I'm going to bash to showcase how to upload a dummy file.

```yaml
- bash: |
    echo "Here is an artifact!" > artifact.txt

    oras push $(ACR.Name).azurecr.io/samples/artifact:$(Build.BuildNumber) \
      --manifest-config /dev/null:application/vnd.unknown.config.v1+json \
      ./artifact.txt:application/vnd.unknown.layer.v1+txt
  displayName: "Uploading dummy artifact"
```

This bash script creates a dummy file called `artifact.txt`. Then it pushes it to a new repository on ACR. Most importantly, we're able to tag it with the `Build.BuildNumber` from the current build.

Here's the end result.

![](/assets/uploads/2020-02-27_18-42-52.png "Helm chart upload example")

### Putting it all together

Here's what my pipeline looks like.

```yaml
variables:
  ACR.Name: '[my registry name]'
  ACR.ServiceConnnection: '[my registry service connection]'
  Azure.ServiceConnection: '[my azure service connection]'

stages:
- stage: build
  displayName: Build and Push
  jobs:  
  - job: job_helm
    displayName: Helm Publish
    pool:
      image: 'ubuntu-latest'
    steps:
    - bash: |
        set -e
        curl -LO https://github.com/deislabs/oras/releases/download/v0.8.1/oras_0.8.1_linux_amd64.tar.gz
        mkdir -p oras-install/
        tar -zxf oras_0.8.1_*.tar.gz -C oras-install/
        sudo mv oras-install/oras /usr/local/bin/
        sudo rm -rf oras_0.8.1_*.tar.gz oras-install/
      displayName: "Install Oras"
    - task: AzureCLI@2
      displayName: Login to ACR
      inputs:
        azureSubscription: "$(Azure.ServiceConnection)"
        scriptType: bash
        scriptLocation: inlineScript
        inlineScript: |
            az --version
            az acr login --name $(ACR.Name)
    - bash: |
        echo "Here is an artifact!" > artifact.txt

        oras push $(ACR.Name).azurecr.io/samples/artifact:1.0 \
          --manifest-config /dev/null:application/vnd.unknown.config.v1+json \
          ./artifact.txt:application/vnd.unknown.layer.v1+txt
      displayName: "Uploading dummy artifact"
```

That's it! For the next part, I'll upload a real helm chart.
