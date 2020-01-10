---
layout: post
title: Choosing a subscription strategy
tags:
  - azure
date: 2020-01-10T04:19:17.022Z
featured: false
hidden: false
comments: false
---
Often times, subscriptions can be become unwieldy. If there's lack of organization, it creates multiple problems downstream. It can be challenging to track costs per application or subsystems. Tracking costs per environment can also be challenging. Granting access to developers with *principle of least privilege* can also be a problem, and so on. Disorganization can breed unplanned work.

<!--more--> 

Based on the [Cloud Adoption Framework](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/decision-guides/subscriptions/#production-and-nonproduction-pattern), I like their take on how to make decisions around various subscriptions models. They walk you through the different styles such as starting with a single subscription to rule them all to one subscription per business unit, per app. 

In my opinion, many organizations can go pretty far with the basic subscription model: a non-prod and a prod subscription.

![](/assets/uploads/basic-subscription-model.png)

The non-prod subscription could be a dev/test type of subscription so that you get reduced pricing. Could you use this type for the prod subscription? You're not supposed to and it's not in your best interest. Dev/test subscriptions have no SLA. I'd also imagine from an engineering standpoint that dev/test subscriptions would get prioritized in the case of an emergency by Azure. You get what you pay for.

With the basic subscription model, it takes a significant amount of apps to cause growing pains. It depends on the complexity of the applications and how many resources encompasses a deployment. It also matters how many engineers would be working from the same subscriptions day in and out. Roughly speaking, with good governance and practice, after 5 or more complicated apps or 30+ engineers it starts to become overwhelming. One thing is true - each organization is different.
