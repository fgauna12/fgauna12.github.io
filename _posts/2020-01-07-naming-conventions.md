---
layout: post
title: Naming conventions
tags:
  - azure
date: 2020-01-07T03:32:26.119Z
featured: false
hidden: false
comments: false
---
<!--more-->

> There are only two hard things in Computer Science: cache invalidation and naming things.

Like many struggles with naming things, by the time you find a name you actually like, it might be the _nth_ iteration. Because infrastructure is not as easy to rename (sometimes just not possible), it can take time to find a name that you like on Azure. By the time you develop a naming convention, it's probably not your first rodeo.

What if the name gets dictated by enterprise architects? Well, sometimes architects lack hands-on experience and it's difficult for them to see the drawbacks to their choices. Also, Azure does suffer from weird naming restrictions like on Azure Storage accounts. No symbols, just alphanumeric. Also, there's a short limit of 24 characters.

Lastly, there's hundreds of Azure services out there, not including the Azure marketplace. There's new services being released all the time so it's a problem that will continue to exacerbate. Thankfully, when Microsoft recommends a naming convention since they're they creators of the platform, it goes a _long_ way. 

Here's their [latest naming convention](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging) which is more extensive and it's part of the Cloud Adoption Framework. For some time, it was quite confusing because it contracted a previous generation of a naming convention and since then they consolidated. 

I do have a few gripes with it. 

- There's no guidance on how to name Logic Apps, App Service plans, Application Insights, Application Gateways, and so on. I use those often.
- What if you have a geo-replicated Azure SQL Server? Because you'd need multiple Azure SQL servers, there would be naming collision using their convention. So, do you add the region to the name or a number identifier?
- Why are app services and function apps so special that they have names that start with `az`?

It's not perfect. At least they use all lower case. Thank goodness there's no Pascal casing.
