---
layout: post
title: Building and pushing a container to a registry with environment/git commit tag
tags:
  - devops
  - azure
  - containers
date: 2020-03-04T04:13:10.768Z
featured: false
hidden: false
comments: false
---
One way to implement promotions in GitOps is to have the GitOps operator deploy images published with a prefixed environment tag. For example, if you want your operator in your staging cluster to deploy staging images, you have it watch for images published with the tag `[environment]-[commit id]`.

This is quick guide on how to publish an image to a container registry using a combination of a environment/git commit tag. We will be using Azure DevOps.

<!--more-->

First, define a variable with a service connection to a container registry. While you're at it, also define the name of your image.

```yaml
variables: 
  Registry.ServiceConnnection: [the name of your service connection]
  ImageName: [the name of your container image]
```

Then, you want to use the `Docker@2` task to build and push and tag all at the same time. It's nice and easy this way. 

```yaml
- task: Docker@2
  displayName: Build and Push
  inputs:
    command: buildAndPush
    containerRegistry: $(Registry.ServiceConnnection)
    repository: $(ImageName)
    buildContext: .
    Dockerfile: Dockerfile
    tags: |
      $(DockerTag)
      latest
```

Now the last trick is to have a variable that changes value by stage. You could add a stage per environment (e.g. stage, prod). 

Stages support variable definitions as well, so it's just a matter of defining those variables at the stage level. Using this approach, we can define a \`DockerTag\` variable that is composed of another \`Environment\` and a pre-defined pipeline variable for the Git Commit Id.

```yaml
variables: 
  Registry.ServiceConnnection: [the name of your service connection]
  ImageName: [the name of your container image]

stages:
- stage: build
  displayName: Build and Push
  variables: 
    Environment: stg
    DockerTag: "$(Environment)-$(Build.SourceVersion)"
  jobs:  
  - job: job_build
    displayName: Build and Push
    pool:
      vmImage: 'ubuntu-latest'
    steps:
    - task: Docker@2
      displayName: Build and Push
      inputs:
        command: buildAndPush
        containerRegistry: $(Registry.ServiceConnnection)
        repository: $(ImageName)
        buildContext: .
        Dockerfile: Dockerfile
        tags: |
          $(DockerTag)
          latest
```