---
layout: post
title: Quick tips to making faster builds
tags:
  - devops
date: 2020-03-26T03:46:19.678Z
featured: false
hidden: false
comments: false
---
Pipelines can take a while. The longer they take, the more it incentivizes developers to bypass them. The longer they take, the more they want to batch work so that they have to wait less.

Here's a list of quick tips to improve build times in Azure DevOps. Collectively, they could shave several minutes. Several minutes could add up significantly over the course of a workday.

<!--more-->

## Using ubuntu build agents

In my experience, ubuntu build agents are faster than Windows build agents. It could also be a side-effect of being capable of building .NET Core using Linux. When possible, I try to use Ubuntu as much as possible.

## Running long-running tasks nightly

Azure DevOps has many tasks for many third party systems. You can run static code analysis checks using SonarQube. You can run open source security scans using tools like WhiteSource. You can run load tests using containers and open source load testing software like Artillery and JMeter.

The problem with adding these new types of tasks is that they take time to execute. This time accrues and accumulates to the overall workflow for developers. So, instead of running them on every build, you could run them nightly from a separate pipeline. Afterall, it's equally important that you react and view the results from these types of integrations.

## Avoiding a git checkout

I want to give credit to Chris Ayers to thinking about this one. This tip applies to unified YAML pipelines. Unified pipelines are where the build *and* release happen from a single pipeline. With this approach, you might have "stages" that do a deploy from an *artifact* that was published by the build stage. Therefore, you might need to use artifacts from source control to deploy. 

Stages in a pipeline checkout the source code so that its part of the working directory for that pipeline. If you know you don't need to checkout source code, you can opt out.

You do this by specifying the `checkout: none` attribute.

```yaml
- job: job_staging_deploy_api
  displayName: 'Staging Deploy API'
  pool: 
    vmImage: 'windows-latest'
  steps:
  - checkout: none
  - download: current
    artifact: backend    
  - task: AzureRmWebAppDeployment@4
    inputs:
      ConnectionType: 'AzureRM'
      azureSubscription: '$(AzureServiceConnection)'
      appType: 'webApp'
      WebAppName: '$(appServiceName)'
      packageForLinux: '$(Pipeline.Workspace)/backend/*.zip'
```