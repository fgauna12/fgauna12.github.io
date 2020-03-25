---
layout: post
title: Passing variables between jobs for Azure DevOps pipelines
tags:
  - devops
date: 2020-03-25T02:35:46.979Z
featured: false
hidden: false
comments: false
---
Using Azure DevOps, you can create pipeline variables dynamically. Out of the box, most dynamic variables are scoped to the job. But, if you need to, you can reference pipeline variables defined in other jobs. For example, if you have a stage that has multiple jobs because you need something done in Linux and something in Windows, then you can consume a dynamic pipeline variable created by another job.

<!--more-->

## Background

You might be familiar with how to set static pipeline variables through YAML.

``` yaml
variables:
  someName: someValue
```

But, what if you want to create this variable using data from a task? For example, you want to dynamically provision Azure resources using a Terraform or ARM Template task. Then, you also want to set pipeline variables to represent the names of the resources so that you can deploy to that infrastructure. 

You can set a dynamic pipeline variable by writing to the host console. 

Powershell:
``` yaml
powershell: |
  Write-Host "##vso[task.setvariable variable=someName;]someValue"
``` 

Bash:
``` yaml
bash: |
  echo "##vso[task.setvariable variable=someName;]someValue"
```

Then, you will be able to use this like a regular pipeline variable.

``` yaml
powershell: |
  Write-Host "The value of the pipeline variable is $(someName)"
```

But, you won't be able to use this variable from a different job... yet.

## Variables from another job

To make a variable accessible from another job, there's a couple of things you want to do. Microsoft also has some documentation on this feature called [output variables](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch#use-output-variables-from-tasks).

First, when creating the dynamic pipeline variable, specify that it's an output variable. 

``` yaml
powershell: |
  Write-Host "##vso[task.setvariable variable=someName;isOutput=true;]someValue"
```

Then assuming you have multiple jobs, add a dependency from one job to another.

``` yaml
- job: job_deploy_code
  displayName: Deploy Some Code
  dependsOn: ['job_deploy_infrastructure']
```

Then define some a variable scoped to the _job_. 

``` yaml
variables: 
  someName: $[ dependencies.job_deploy_infrastructure.outputs['someName'] ]
```

## Putting it all together 

``` yaml
stages:
- stage: stage_deploy
  displayName: Production
  jobs: 
  - job: job_deploy_infrastructure
    displayName: Deploy Some Infrastructure
    steps:
    - bash: |
        echo "this is some build job"
        echo "creating a pipeline variable"
        SOMEVALUE="bleh"
        echo "##vso[task.setvariable variable=someName;isOutput=true;]$SOMEVALUE"
        echo "variable value is $(someName)"
  - job: job_deploy_code
    displayName: Deploy Some Code
    dependsOn: ['job_deploy_infrastructure']
    variables: 
      someName: $[ dependencies.job_deploy_infrastructure.outputs['someName'] ]
    steps: 
    - bash: |
        "the variable value is $(someName)"
```