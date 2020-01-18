---
layout: post
title: CI/CD for .NET framework web jobs
tags:
  - devops
  - azure
date: 2020-01-18T04:04:35.296Z
featured: false
hidden: false
comments: false
---
At the moment, there's a weird in-between. If you want to run a background job that is *continuous* and/or requires vnet integration, you might have to use a web job. Even more so, if you're having to run .NET Framework, your best best is to run a v1 web job, not v2, [not v3](https://github.com/Azure/azure-webjobs-sdk/issues/2186). As the Azure team is pushing heavily adopting .NET Core, the Web Job SDK is moving along with it.

<!--more--> 

## My weird issue

I wanted to move a .NET Framework 4.7 Windows Service to Azure using a Web Job. It had to trigger several little functions on a timer, fairly frequently (as often as every 5 seconds for some). This background job also had interact with IaaS services and therefore connect to a vnet. 

So, I solved it by creating a .NET Framework Web Job using File -> New Project -> Web Job. This is assuming you have the Azure Developer Pack installed to Visual Studio. From here, I created a *continuous* web job and installed the [web job extensions](https://github.com/Azure/azure-webjobs-sdk-extensions) that I could use a `TimerTrigger`.

## The pipeline

The hard part was creating the CI/CD pipeline. Turns out that the new, short, sweet `.csproj` don't play nice with the older v1 web job tooling.

### Going back in time

There's this [old blog post](https://azure.microsoft.com/en-us/blog/enabling-command-line-or-continuous-delivery-of-azure-webjobs/) that has a lot of good information on how the older web jobs were configured before. I didn't have to follow a lot of it, because well, I was using Azure DevOps with the built-in tasks to deploy the web job.

The main takeaways:

* For continuous web jobs, enable 'Always On' the app service
* Ensure you the `Microsoft.Web.WebJobs.Publish` NuGet package installed on your web job project
* Ensure you're publishing with the right *MsBuild* properties (see pipeline section below)
* There's an [open issue](https://github.com/Azure/azure-webjobs-sdk/issues/1635) that shed's some light if you want to make a web job work with the new `.csproj` as seen by .NET Framework 4.7 and above. <mark>If you don't do this, your web deploy package will be empty.</mark>
* You're going to need a `webjob-publish-settings.json` file under the _Properties_ folder of the project. 

  ```xml
  <PropertyGroup>
      <IsWebJobProject>true</IsWebJobProject>
      <WebJobName>$(AssemblyName)</WebJobName>
      <WebJobType>Continuous</WebJobType>
  </PropertyGroup>
  ```

### The tasks

First, build the solution with the following MSBuild arguments. They should be the same you would use to create a Web Deploy package for traditional Windows-based App Service deployments

```yaml
- task: VSBuild@1
  displayName: 'Build Solution'
  inputs:
    solution: '**\*.sln'
    msbuildArgs: '/p:DeployOnBuild=true /p:WebPublishMethod=Package /p:PackageAsSingleFile=true /p:SkipInvalidConfigurations=true /p:PackageLocation="$(build.artifactStagingDirectory)/"'
    platform: 'Any CPU'
    configuration: 'Debug'
```

Then, when you're wanting to deploy, use the older `AzureRmWebAppDeployment@4` task. (Assuming, you published the zip as a build artifact).

```yaml
- task: AzureRmWebAppDeployment@4
  displayName: 'Deploy ZAK'
  inputs:
    azureSubscription: 'my-subscription-service-connection'
    WebAppName: 'azapp-myapp-dev-001'
    package: '$(Pipeline.Workspace)/**/MyWebJob.zip'
```

That's it! I didn't really cover how to create the web job on Azure.
