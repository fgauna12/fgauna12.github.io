---
layout: post
title: 'Azure Load Tests Part 2: Running Tests from Pipeline'
tags: 
  - azure
  - devops
  - containers
  - load-tests
date: 2019-06-23T00:00:00.000Z
featured: false
hidden: false
featured_image_thumbnail: /assets/uploads/container-instances.svg
featured_image: assets/images/posts/2019/artillery-featured.jpg
comments: true
---

In my last post, I blogged about how to use Artillery to run Load Tests from Azure Container Instances. Artillery is easy to use and Azure Container Instances offer a low cost and easy way to run containerized load tests. If cloud-based load tests are cheap and a great way to test your architecture, **how do you get the most out of them?**

<!--more-->

## Why?

I have worked with teams who create custom load tests and run them a few times ... then simply **forgot** about them. In other cases, the load tests were being run from a VM that someone provisioned and only they knew how to use. That person was asked to run load tests all the time and they became a bottleneck in process. Lastly, it was easy to mix up test cases. Which tests ran when? Triggering load tests manually meant we made mistakes and without source control we had to trust that the right test parameters were set.

Running load tests from a pipeline is a great way to ensure that:
- Any member of the team can kick off a load test
- There is traceability on when/which test case is being run
- They run frequently and they are consistently maintained by the team

## How?

I like to run my load tests nightly. This means, I start the load tests from a pipeline that runs roughly at midnight each weekday. Once the load test completes, the results are sent to the members in the team. Often times, during the daily scrum meetings, we pull up load test results and quickly point out abnomalities. 

### Azure DevOps

Create a pipeline and add a step to build and publish you load test to an Azure Container Registry. 

``` yaml

- stage: Build and Run
    jobs:
    - job: build
      displayName: Build and Push
      steps:
      - task: Docker@2
        displayName: Build and Push
        inputs:
          command: buildAndPush
          containerRegistry: $(ACR.ContainerRegistryServiceConnnection)
          repository: gaunastressyou/hello-load-test
          buildContext: .
          Dockerfile: Dockerfile
          tags: $(Build.BuildNumber)

```

`ACR.ContainerRegistryServiceConnnection` - is the name of a service connection to an Azure Container Registry. Here's more [instructions](https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints?view=azure-devops&tabs=yaml#sep-docreg) on how to create one.

Then add a step to run the name Azure CLI commands you can use locally.

``` yaml

- job: load_test
      displayName: Running Load Test
      steps:
      - task: AzureCLI@1
        inputs:
          azureSubscription: '[ subscription name ]'
          scriptLocation: 'inlineScript'
          inlineScript: 'az group deployment create -g $(LoadTest.ResourceGroup)-n $(LoadTest.ContainerGroupName) --template-file armdeploy.json --parameters loadTestName=$(LoadTest.Name) artillery-environment=$(Environment) artillery-file=$(LoadTest.File) image=$(LoadTest.FullImage) acrName=$(ACR.Name) acrResourceGroup=$(ACR.ResourceGroup) timeStamp=$(LoadTest.RunId)'

```

Lastly, configure a [scheduled trigger](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops&tabs=yaml#scheduled-triggers) for the pipeline

``` yaml

schedules:
- cron: "0 0 * * *"
  displayName: Nightly Load Test
  branches:
    include:
    - master

```

### All Together

``` yaml

trigger:
  branches:
      include:
      - master

schedules:
- cron: "0 0 * * *"
  displayName: Nightly Load Test
  branches:
    include:
    - master

variables:
  # ========================================================================
  #                          Mandatory variables 
  # ========================================================================
  ACR.ContainerRegistryServiceConnnection: [ conatiner registry service connection name ]
  ACR.Name: [ container registry name ]
  ACR.ResourceGroup: [ resource group  name]

  Service.Dockerfile: Dockerfile
  Service.Name: api-load-tests
  Service.Repository: gaunastressyou

  LoadTest.Counter: $[counter(format('{0:yyyyMMdd}', pipeline.startTime), 0)]
  LoadTest.Date: $[format('{0:yyyyMMdd}', pipeline.startTime)]
  LoadTest.Tag: $(LoadTest.Date)-$(LoadTest.Counter)
  LoadTest.Name: hello-world
  LoadTest.ResourceGroup: hello-world-rg
  LoadTest.ContainerGroupName: $(LoadTest.Name)
  LoadTest.File: load.yml
  LoadTest.RunId: $(LoadTest.Tag)
  LoadTest.FullImage: $(ACR.Name).azurecr.io/$(Service.Repository)/$(Service.Name):$(Build.BuildNumber)
  Environment: dev

stages:
  - stage: Build and Run
    jobs:
    - job: build
      displayName: Build and Push
      steps:
      - task: Docker@2
        displayName: Build and Push
        inputs:
          command: buildAndPush
          containerRegistry: $(ACR.ContainerRegistryServiceConnnection)
          repository: gaunastressyou/hello-load-test
          buildContext: .
          Dockerfile: Dockerfile
          tags: $(Build.BuildNumber)
    - job: load_test
      displayName: Running Load Test
      steps:
      - task: AzureCLI@1
        inputs:
          azureSubscription: '[ subscription name ]'
          scriptLocation: 'inlineScript'
          inlineScript: 'az group deployment create -g $(LoadTest.ResourceGroup)-n $(LoadTest.ContainerGroupName) --template-file armdeploy.json --parameters loadTestName=$(LoadTest.Name) artillery-environment=$(Environment) artillery-file=$(LoadTest.File) image=$(LoadTest.FullImage) acrName=$(ACR.Name) acrResourceGroup=$(ACR.ResourceGroup) timeStamp=$(LoadTest.RunId)'

```
