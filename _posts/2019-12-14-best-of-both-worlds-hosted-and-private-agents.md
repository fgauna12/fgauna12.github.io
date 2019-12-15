---
layout: post
title: Best of both worlds
tags:
  - devops azure
date: 2019-12-14T22:51:45.340Z
featured: true
hidden: true
featured_image_thumbnail: /assets/uploads/azure-pipelines.svg
featured_image: /assets/uploads/logistics-1-640.jpg
comments: false
---
In Azure DevOps, it's convenient and easy to use one of the hosted agent pools. Microsoft takes the time to update the tooling as new versions of the of SDKs come out - like .NET Core. But, there's one drawback - **performance**.

It's not a terrible wait. They perform well considering you don't have to maintain the image. But, it can be like _watching a pot boil._ 

<!--more-->

## The Solution

Azure DevOps creates a Docker image for their Azure Pipelines agent. I have found it particularly useful for building .NET Core apps. Here, there's no fuzzing about and maintaining a Dockerfile with the dependencies of the build agent. 

The best part - you can run it easily as an Azure Container Instance and have it be your own **private build agent.** Meaning, it will cache your source code and every time you want to pull down dependencies from a feed like NuGet and NPM. 

### 1. Create an Agent Pool

From the Azure DevOps organization settings, create a new agent pool.

![](/assets/uploads/createpool.png "Create an Agent Pool")

### 2. Get a Personal Access Token

Follow [these instructions](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page).

### 2. Start an Azure Container Instance with Azure DevOps' Agent Image

Bash: 

```bash
AZDO_PAT=<YOUR PERSONAL ACCESS TOKEN>
AZDO_POOL_NAME=<YOUR POOL NAME FROM STEP 1>
AZDO_ACCOUNT=<YOUR AZURE DEVOPS ORGANIZATION NAME>

az group create -g 'rg-nebbiademo-shared-001' -l eastus

az container create -g rg-nebbiademo-shared-001 \
       --name az-container-1 \
       --image mcr.microsoft.com/azure-pipelines/vsts-agent:ubuntu-16.04-docker-17.12.0-ce-standard \
       --environment-variables VSTS_ACCOUNT=$AZDO_ACCOUNT \
           VSTS_TOKEN=$AZDO_PAT \
           VSTS_POOL=$AZDO_POOL_NAME \
           VSTS_AGENT='az-container-1'   
```

Powershell:

```powershell
$AZDO_PAT="<YOUR PERSONAL ACCESS TOKEN>"
$AZDO_POOL_NAME="<YOUR POOL NAME FROM STEP 1>"
$AZDO_ACCOUNT="<YOUR AZURE DEVOPS ORGANIZATION NAME>"

az group create -g 'rg-nebbiademo-shared-001' -l eastus

az container create -g rg-nebbiademo-shared-001 `
       --name az-container-1 `
       --image mcr.microsoft.com/azure-pipelines/vsts-agent:ubuntu-16.04-docker-17.12.0-ce-standard `
       --environment-variables VSTS_ACCOUNT=$AZDO_ACCOUNT ` 
          VSTS_TOKEN=$AZDO_PAT `
          VSTS_POOL=$AZDO_POOL_NAME `
          VSTS_AGENT='az-container-1'   
```

### 3. Profit

That's it! You should see a new agent under the pool.

![](/assets/uploads/agents.png "Azure DevOps Pool")

## Caveat

It's not all roses. There's one big limitation. You **won't be able to build docker images** with this private agent. It's not that it's not possible to build Docker images with Docker build agents, it is. It's not possible to do with Azure Container Instances. In order to be able to use the Docker daemon, you would have to mount the Docker socket as a volume. 

```console
docker run \  
-e VSTS_ACCOUNT=<name> \
-e VSTS_TOKEN=<pat> \
-v /var/run/docker.sock:/var/run/docker.sock \
-it mcr.microsoft.com/azure-pipelines/vsts-agent:ubuntu-16.04-docker-17.12.0-ce-standard
```

For security reasons, Azure Container Instances doesn't let you do this.
