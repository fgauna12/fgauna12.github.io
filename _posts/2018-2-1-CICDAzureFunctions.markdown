---
layout: post
title:  "Creating a CI/CD pipeline for Azure Functions"
date:   2018-1-02 9:00:00 -0500
categories: 
    - Azure Functions
    - CI/CD
    - DevOps
comments: true
---

Azure functions are cute. You can fire up the online function editor from the Azure portal and start hacking away using many languages.
In my case, I'd like to start writing some C# and being able to run it and debug it quickly. Eventually, I end up craving Visual Studio & ReSharper along with some unit tests.

Instead of using the Azure Portal, I like to use pre-compiled Azure functions [created from Visual Studio](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs)

## Why?

### Can't edit a function created from the portal in Visual Studio :pensive:

Functions created from the portal are typically "script" functions and they are not compilable. There is no DDL.
As you may know, the extension is a `.csx`. 

### So what?

Today, you can't deploy your Azure function created in the portal from VSTS. So, they are not as easy to add to your CI/CD pipeline.
At this point, I typically start treating my functions like *pets and not cattle*.

I manually try to deploy a function between environments and paying special attention that the configuration matches between the instances.

All of this applies to Logic Apps too.

**This is a is a big no-no for DevOps**.

## The Solution: pre-compiled functions using VSTS :cow:

## 1. Setting up the Project

### Create a new Azure Function project

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_1.PNG)

### Add a function a trigger of your liking

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_2.PNG)

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_3.PNG)

### Pick the function trigger

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_4.PNG)

## 2. (Optional) Create the ARM Template

Create an ARM template for your azure function app and its service plan. 
If you don't know how to do it, I wrote a [blogpost]({% post_url 2018-3-1-AzureFunctionsArmTemplate %}) about it.

For the sake of brevity you don't have to create an ARM template. 
Be aware that this is still treating your function as a _pet_ :cat:
If you choose the dark side, then simply don't add the Azure Resource Group VSTS task in the release definition.

## 3. Build and Release

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_10.gif)

### Build Agent and Build Definition

Provision Build Agent with Azure Functions SDK or use simply use Hosted VS 2017 Build Agent.

Create a new build definition using the `ASP.NET` build definition template. 

Then, if you're trying this on a new solution, you can simply save and queue this definition.

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_5.PNG)

### Release Definition

The release will be the slightly more complex part.
It will be _very_ familiar to deploying an App Service.

![Example Release Definition]({{site.baseurl}}/assets/2018-2-1/azurefunctions_6.PNG)

#### 1. Deploy the ARM template (Optional)

> The task documentation is found [here](https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/AzureResourceGroupDeployment/README.md)

Start by adding an Azure Resource Group Deployment task to deploy the ARM template that will create the Azure Function Apps and their consumption service plans.

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_7.PNG)

#### 2. Use the [App Service deployment task](https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/AzureRmWebAppDeployment/README.md) for each function app

To deploy the function code, for each function app add an App Service deploy task.

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_8.PNG)

You will notice that in the build artifact, there's a web deploy package for each of the function apps. 

Make sure that you're deploying the right package for the appropriate function app.
The web deploy is speficied on the `Package or folder` field.

![]({{site.baseurl}}/assets/2018-2-1/azurefunctions_9.PNG)

Queue it up and give it a go!


## References

- [MSDN Blog Post](https://blogs.msdn.microsoft.com/appserviceteam/2017/06/01/deploying-visual-studio-2017-function-projects-with-vsts/)
- [MSFT Docs: Creating pre-compiled Azure Functions from Visual Studio](https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-vs)

