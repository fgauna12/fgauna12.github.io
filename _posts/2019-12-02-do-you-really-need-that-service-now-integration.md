---
layout: post
title: Do you really need that Service Now integration?
categories: DevOps
date: 2019-12-02T23:41:57.094Z
featured: false
hidden: false
comments: false
---
It's been a couple of times now that I see bigger organizations ask for help in integrating their Service Now process with Azure DevOps. I even wrote a custom Deployment Gate some time ago using an Azure function before this functionality was fully available. 

Now you can use the [Service Now marketplace extension](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/approvals/servicenow?view=azure-devops) to gate a deployment until a Service Now change request is approved. Then how to do you dynamically associate something like a work item? 

But should you even go down this path? Should you invest in this? 

I don't think so. It's clear and shown by the State of DevOps report that formal change management processes requiring approval from an external Change Approval Boards (CAB) or a senior level employee **negatively impact software delivery performance.**

So why invest in something that ultimately won't provide value? 

Instead, spend time trying to reduce the lead time from commit to production without sacrificing on stability. Yes it's possible. Elite/high performers have been doing it for a while.
