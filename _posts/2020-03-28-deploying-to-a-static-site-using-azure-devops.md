---
layout: post
title: Deploying to a static site using Azure DevOps
tags:
  - devops
date: 2020-03-28T03:37:13.592Z
featured: false
hidden: false
comments: false
---
Without getting into the nitty gritty of how to build a single page app, I'll showcase a simple process how to deploy a Vue app to an Azure Storage Account leveraging the *static website* feature. 

<!--more-->

Assuming you have created an Azure Storage account with static websites enabled, then you can copy the files to the appropriate container. Here's [a blogpost](https://gaunacode.com/creating-an-azure-storage-account-for-static-site-hosting-using-terraform) of how to create this storage account with Terraform.

```yaml
- download: current
  artifact: frontend
- task: AzureFileCopy@4
  inputs:
    SourcePath: '$(Pipeline.Workspace)/frontend/*'
    azureSubscription: '$(AzureServiceConnection)'
    Destination: 'AzureBlob'
    storage: '$(storageAccountName)'
    ContainerName: '$web'
```

As you may notice, the files are copied to a `$web` container in the storage account. This example also relies on the front-end files to be published as an artifact. 

I'll show a quick example a CI pipeline for a Vue app. This app was generated using the Vue CLI.

```yaml
- job: job_build_front_end
  displayName: 'Build Frontend'
  pool: 
    vmImage: 'ubuntu-latest'
  steps: 

  - task: Npm@1
    displayName: 'Restore'
    inputs:
      command: 'install'
      workingDir: $(frontEndDirectory)

  - task: Npm@1
    displayName: 'Build'
    inputs:
      command: 'custom'
      workingDir: $(frontEndDirectory)
      customCommand: run build

  - task: CopyFiles@2
    displayName: Copy Files to Artifacts Staging
    inputs:
       sourceFolder: $(frontEndDirectory)/dist
       contents: '**' 
       targetFolder: $(Build.ArtifactStagingDirectory)/frontend

  - publish: $(Build.ArtifactStagingDirectory)/frontend
    artifact: frontend
      displayName: Publish Frontend Artifacts
```