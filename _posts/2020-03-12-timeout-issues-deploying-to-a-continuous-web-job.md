---
layout: post
title: Timeout issues deploying to a continuous web job
tags:
  - devops
  - azure
date: 2020-03-12T00:49:07.531Z
featured: false
hidden: false
comments: false
---
Some [time ago](https://gaunacode.com/ci-cd-for-net-framework-web-jobs) I wrote about how to create a YAML Azure DevOps pipeline to deploy a .NET framework v1 webjob. 

In this post, I will speak to a problem I had to troubleshoot. The Azure Pipelines agent timing out because it took over an hour to deploy to a continuous web job.

<!--more-->

![](/assets/uploads/2020-03-11_21-01-35.png#wide"Build minutes timing out")

![](/assets/uploads/2020-03-11_21-01-23.png#center "Deploy step is taking over an hour")

My problem was that the continuous webjob had the binaries locked and therefore I could not upload new binaries while the webjob was running. 

The solution was relatively simple. 

Use the [App Service Manage](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-app-service-manage?view=azure-devops) task to stop the webjob before deploying, then deploy, then start the webjob.

## The pipeline

First, I will assume some variables defined in the pipeline like this.

```yaml
variables:
  SubscriptionServiceConnection: 'your azure service connection name'
  WebjobAppName: 'the name of your webjob'
```

Then, you'll want to use the `AzureAppServiceManage@0` to stop the web job.

```yaml
- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: '$(SubscriptionServiceConnection)'
    Action: 'Stop Azure App Service'
    WebAppName: '$(WebjobAppName)'
```

**Notice:** The Microsoft documentation has a mistake on it. The `action` parameter is <mark>case sensitive</mark>. Ensure that the value matches `Stop Azure App Service`.

Next, you can deploy the webjob using the  task, as normal.

```yaml
- task: AzureRmWebAppDeployment@4
  displayName: 'Deploy WebJob'
  inputs:
    azureSubscription: '$(SubscriptionServiceConnection)'
    WebAppName: $(WebjobAppName)
    packageForLinux: '$(Pipeline.Workspace)/**/*.zip'
    enableCustomDeployment: true
    ExcludeFilesFromAppDataFlag: false
```

Lastly, you can start the webjob again.

```yaml
- task: AzureAppServiceManage@0
  inputs:
    azureSubscription: '$(SubscriptionServiceConnection)'
    Action: 'Start Azure App Service'
    WebAppName: '$(WebjobAppName)'
```

**Notice:** Similar to the warning before, the `action` is case sensitive. Ensure that the value matches `Start Azure App Service`.