---
layout: post
title: Getting free build minutes in Azure DevOps
tags:
  - devops
date: 2020-02-19T04:30:44.278Z
featured: false
hidden: false
comments: false
---
A lot of people don't know, I certainly didn't for a while. There's monetary incentives to having *public* team projects in Azure DevOps. A [public team project](https://docs.microsoft.com/en-us/azure/devops/organizations/public/about-public-projects?view=azure-devops) is meant to support open-source projects. It's clear Microsoft is heavily invested in open source.

<!--more--> 

Public team projects can be a great way to house prototype/demo code. Great for proof of concepts and I use them all the time. Why? Because there's a nice incentive. 

Free and *unlimited* build minutes. 
(Usually you get 1800/month for free)

And...

Up to 10 parallel jobs. 
(Usually you get one for free)

At the time of writing this, it's roughly $40 a month to add additional parallel jobs using Azure DevOps' hosted agents. Ten parallel jobs is a lot of throughput and capacity for these prototypes. 

If you're worried about polluting your Azure DevOps organization, you could also create a separate Azure DevOps organization to house your playground projects. It would certainly inherently simplify the segregation of prototypes and production-ready apps.
