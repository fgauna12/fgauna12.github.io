---
layout: post
title: >-
  Publishing Helm 3 charts to Azure Container Registry using Azure DevOps - Part
  2
tags:
  - devops
  - azure
  - kubernetes
date: 2020-03-01T03:21:18.945Z
featured: false
hidden: false
comments: false
---
In part 1, I covered the what's happening underneath the covers with the usage of OCI artifacts to publish to Azure Container Registry. As a reminder, we published a dummy file as a generic artifact to the container registry. In this guide, I'll cover how to push a real Helm 3 chart.

<!--more-->

## Background

Microsoft recommends that when using Helm 3 charts, that you use the native `helm chart` commands so to manage the charts as OCI artifacts. 

Microsoft already has [good documentation](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-helm-repos) on how to do this using just terminal commands. This guide is more geared towards applying it with Azure DevOps.

### Pre-Requisites

* An Azure Container Registry
* Helm Client 3 or later
* Azure CLI version 2.0.71 or later

### Disclosure

Helm 3 support for Azure Container Registry is still a preview feature. Even the support from the Helm CLI is still experimental.

## The main way

First, define an environment variable of `HELM_EXPERIMENTAL_OCI`. Any pipeline variable gets mapped to an environment variable on the agent. 

So just define one like so:

```yaml
variables:
  HELM_EXPERIMENTAL_OCI: 1
  ACR.Name: '[Your azure container registry name]'
  Azure.ServiceConnection: '[your azure service connection]'

pool:
  vmImage: 'ubuntu-latest'
```

Then ensure you have Helm installed on the agent running the pipeline.

```yaml
- task: HelmInstaller@1
  inputs:
    helmVersionToInstall: 'latest'
```

Next, login to Azure Container Registry using the Azure CLI.

```yaml
- task: AzureCLI@2
  displayName: Login to Azure Container Registry
  inputs:
    azureSubscription: "$(Azure.ServiceConnection)"
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: |
      az acr login --name $(ACR.Name)
```

Lastly, save the chart and push it using Bash.

```yaml
- bash: |
    helm chart save ./k8s/realworld-backend/ $(ACR.Name).azurecr.io/charts/realworld-backend:$(Build.BuildNumber)
    helm chart push $(ACR.Name).azurecr.io/charts/realworld-backend:$(Build.BuildNumber)
```

`realworld-backend` is the name of my Helm chart. It resides under the `k8s/realworld-backend/` subdirectory in my repo. It lives on the same repo as the source code. Replace those two things with your respective helm chart name and the relative location on your repo. 

Notice how it's also pushing the the chart to a `charts/realworld-backend` repository on ACR.

![](/assets/uploads/2020-02-29_23-05-58.png#wide "Uploaded Chart to Container Registry")

### Putting it all together

```yaml
trigger:
- master

pr: none

variables:
  HELM_EXPERIMENTAL_OCI: 1
  ACR.Name: '[Your azure container registry name]'
  Azure.ServiceConnection: '[your azure service connection]'

stages:
- stage: build
  displayName: Build and Push
  jobs:  
  - job: job_helm
    displayName: Helm Publish
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: AzureCLI@2
      displayName: Login to Azure Container Registry
      inputs:
        azureSubscription: "$(Azure.ServiceConnection)"
        scriptType: bash
        scriptLocation: inlineScript
        inlineScript: |
          az acr login --name $(ACR.Name)
    - task: HelmInstaller@1
      inputs:
        helmVersionToInstall: 'latest'
    - bash: |
        helm chart save ./k8s/realworld-backend/ $(ACR.Name).azurecr.io/charts/realworld-backend:latest
        helm chart push $(ACR.Name).azurecr.io/charts/realworld-backend:latest
```

## Open Issue

Today, there's an [open issue](https://github.com/helm/helm/issues/6214) on GitHub. For myself, I ran into this when publishing the Helm chart from the Azure DevOps Ubuntu and Windows agents. I **did not** run into this from my workstation using Windows 10. I also ran into this issue from my Linux workstation.

The issue looks like this. 

```
Error: failed to authorize: failed to fetch anonymous token: unexpected status: 401 Unauthorized
```

![](/assets/uploads/2020-02-29_23-12-19.png "Helm chart push issue")

## Fallback

If you're running into the same issues as above, you can try the legacy approach. Instead of issuing `helm chart` commands, we'll use the `az acr helm` commands.

The pipeline steps are as follows.

```yaml
steps:
  - task: HelmInstaller@1
    inputs:
      helmVersionToInstall: 'latest'
  - bash: |
      helm package k8s/realworld-backend/ --app-version $(Build.BuildNumber) --version $(Build.BuildNumber)
      mv realworld-backend-$(Build.BuildNumber).tgz $(Build.ArtifactStagingDirectory)/
  - task: AzureCLI@1
    displayName: 'Push helm chart'
    inputs:
      azureSubscription: $(Azure.ServiceConnection)
      scriptLocation: inlineScript
      inlineScript: 'az acr helm push -n $(ACR.Name) $(Build.ArtifactStagingDirectory)/realworld-backend-$(Build.BuildNumber).tgz'
```

`realworld-backend` is the name of my Helm chart. It resides under the `k8s/realworld-backend/` subdirectory in my repo. It lives on the same repo as the source code. Replace those two things with your respective helm chart name and the relative location on your repo. 

But, this is what happens here.

First, we package the Helm chart using Helm 2 commands. We also override the app version and the chart version with the build number to be fancy. It would be useful to know from which build this chart was generated. Although, it might be wiser to have a SemVer version.

Secondly, we move the packaged helm chart to the staging directory. It could be useful to publish it as a build artifact. 

Lastly, we push the Helm chart using the Azure CLI ACR Helm commands. And, we're done.



So, although it looks easy, you might run into some snags because of the preview nature. \
\
Best of luck.
