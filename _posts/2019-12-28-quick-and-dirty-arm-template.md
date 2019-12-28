---
layout: post
title: Quick and dirty ARM template
tags:
  - devops
  - azure
date: 2019-12-28T00:16:34.496Z
featured: false
hidden: false
comments: false
---
There are several ways to adopt *infrastructure as code* when using Azure. Azure Resource Manager (ARM) templates are the native way. They are JSON snippets that tell the ARM API how to provision resources on Azure predictably. Creating ARM templates is certainly a skill and it becomes easier with practice.

There's a few ways to starting an ARM template. One way is to look at the [ARM Template Quickstarts](https://azure.microsoft.com/en-us/resources/templates/https://azure.microsoft.com/en-us/resources/templates/). Another way, is to use Visual Studio and create an Azure Resource Manager project. An obvious one, is to look at a past project and see what was done before. There's also Visual Studio Code, where you can download extensions like [this one](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) and [this one](https://marketplace.visualstudio.com/items?itemName=samcogan.arm-snippets). But there's one way, that I find extremely useful in many cases and that is using the portal.

## Using the portal

There's a crappy way of using the portal and a more productive way. The crappy way is to look at a resource group and click on the **"Export Template"** blade. Here, Azure will *generate* the ARM template based on what has been deployed. The problem with this is that it's most often extremely verbose. Azure tries to reverse engineer what is deployed and put it in terms of ARM schema. In the past, when I've tried using it, the more I strip out the things I don't need, I end up breaking the template anyway and wasting time instead of saving it.

![](/assets/uploads/annotation-2019-12-27-192645.jpg "Export arm template")

The uncrappy way is to go through the process to create a resource as you would from the portal and \_before you click "Create"\_ from the confirmation window, you download the ARM template. 

![](/assets/uploads/export_arm_template.png "Download Template")

The way I understand it, the Azure portal sends ARM schema objects to the ARM API when you create resources. If this is the case, it's the most accurate and consistent way to create resources just as the portal would create them. I have found this extra effective for creating resources that are not widely used or are still in preview.
