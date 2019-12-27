---
layout: post
title: Just containers on Azure
tags:
  - azure
  - containers
  - kubernetes
date: 2019-12-27T02:39:50.145Z
featured: false
hidden: false
comments: false
---
I think it's a common assumption that the best way to use containers on Azure is through Kubernetes. While that may be true for some projects, it certainly isn't true for others. The team's expertise, the service level objectives for the app, and other business aspects all factor in to the decision-making. 

<!--more-->

An Azure Web App for Containers (aka App Service for Containers) runs about $70 a month for a Standard tier app service plan. Standard tier is suitable for many small web apps to run in production. On the other hand, a small two-node Kubernetes cluster costs at least $200 a month based on default node configuration. So, based on strictly cost, it would take roughly *more than three* homogeneous web apps for us to start seeing the benefits of **bin packing** from Kubernetes.

As alluded, in a [previous post](https://gaunacode.com/incremental-path-to-kubernetes-on-azure), using Azure Web Apps for Containers can be an nice intermediate step towards learning Kubernetes. *Ballpark*, it will take roughly more than three web apps deployed onto Kubernetes to start seeing some ROI through bin packing. 

Some organizations don't support more than three web apps. Sometimes, organizations don't need zero downtime deployment or more than three 9s SLA. Sometimes, Kubernetes can be too much. It certainly is true for running a website like <https://orlandocodecamp.com>. It's a site that gets the bulk of the traffic once a year. Hell, even an Azure Web App is too much. A free static website hosted on Netlify with JAMStack would do.
