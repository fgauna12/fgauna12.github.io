---
layout: post
title: >-
  Adding app insights to asp.net core web app running on azure web apps for
  containers
tags:
  - azure
date: 2020-02-03T04:22:30.332Z
featured: false
hidden: false
comments: false
---
*Oof* that title is a mouthful. Adding application insights to a containerized asp.net core application is not too difficult. It's pretty simple.

## Infrastructure as Code

Using ARM, create an application insights resource like this:

```json
{
  "apiVersion": "2014-04-01",
  "name": "[variables('appInsightsName')]",
  "type": "Microsoft.Insights/components",
  "location": "[resourceGroup().location]",
  "properties": {
    "applicationId": "[parameters('appName')]"
  }
}	        
```

Using an `appSetting`, you can also populate the instrumentation key onto the app service. You'll also need a `dependsOn` declaration.

```json
"appSettings": [
    {
        "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
        "value": "[reference(variables('appInsights')).InstrumentationKey]"
    }
  ]
```

The instrumentation key is the only setting required by the app insights sdk to be able to work correctly.
If you need more help on setting an app setting on an azure web app, here's the [arm schema](https://docs.microsoft.com/en-us/azure/templates/Microsoft.Web/2019-08-01/sites). 

`APPINSIGHTS_INSTRUMENTATIONKEY` <mark>app setting will get translated to an environment variable when the container spins up in the app service</mark>. The sdk that you'll be adding will know too look for an instrumentation key based on an environment variable with the name `APPINSIGHTS_INSTRUMENTATIONKEY` or `ApplicationInsights:InstrumentationKey`

## Adding app insights through the sdk

There's two main ways to add app insights. The codeless way or through the sdk. I prefer the sdk for greater control and flexibility later.

Right click on your asp.net core project and select "Configure Application Insights".

![Configure app insights picture](/assets/uploads/configure_app_insights_1.png "Configure app insights")

Then select, "Get Started"

![Configure app insights - get started picture](/assets/uploads/configure_app_insights_2.png "Configure app insights - get started")

Lastly, don't worry about creating an app insights resource on Azure, this is what the arm template will be used for. Click on the small link "Or just add the SDK to try local mode."

![](/assets/uploads/configure_app_insights_3.png "Add the sdk to try local mode")

You'll notice that it adds references to a new NuGet package. Also, it makes small modifications to the ASP.NET Core service registration.

Now before deploying, deploy your arm template. Do always consider deploying your arm templates through a pipeline. 

To recap:

* Use an arm template to create the application insights resource
* Use the same arm template to auto-configure the app setting in the azure web app with the application insights instrumentation key to use
* Add the application insights sdk through code using Visual Studio

To get a more detailed example of what it should look like, check out [this pull request](https://github.com/onetug/Codecampster/pull/67).
Also, here's [another link](https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-core) for the official guide by Microsoft.
