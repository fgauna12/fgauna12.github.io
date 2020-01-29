---
layout: post
title: Moving a nested application from IIS to Azure App Service
tags:
  - azure
date: 2020-01-29T22:10:22.660Z
featured: false
hidden: false
comments: false
---
Let's say you want to move an IIS application to an Azure Web App (aka app service). More than that, let's say this app has a nested application (subsite) or virtual directory. Here's how you can get it done.

![](/assets/uploads/iis_manager.png "Example of a subsite")

## What we're shooting for

The configuration on an Azure App Service is quite easy.  For the example above, we want to deploy an application to the `/v1` route. 

![](/assets/uploads/app_service_subsite.png "Azure App Service Nested Application")

*Note*: you do need that parent application at route `/`

## The arm template

Here's a Gist inspired by [this one](https://gist.github.com/eNeRGy164/0ff063f039088f2cae6219fa6110cbda)

<script src="https://gist.github.com/fgauna12/89def945380359598bc880beea1169e8.js"></script>

## The pipeline

Using Azure DevOps, we can deploy the website to the *subsite* by being more specific in the site name.

```yaml
- task: AzureRmWebAppDeployment@4
  displayName: 'Deploy My Subsite'
  inputs:
    azureSubscription: 'my-subscription-service-connection'
    WebAppName: $(WebAppName)/v1
    package: '$(Pipeline.Workspace)/**/MySitePackage.zip'
```

Notice how we're adding a `/v1` that matches the name of the nested application as defined by our arm template.


If you want to know how to deploy from Visual Studio, then you can see [this link](https://dotnetthoughts.net/deploying-multiple-application-in-webapp/)
