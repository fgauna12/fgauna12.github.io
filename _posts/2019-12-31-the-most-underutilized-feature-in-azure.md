---
layout: post
title: The most underutilized feature in Azure
tags:
  - azure
date: 2019-12-30T22:02:17.592Z
featured: false
hidden: false
comments: false
---
Can you think of one feature in Azure that's easy to implement, always in front of you, yet you gloss over it all the time and *forget to use it*? I can. **Read-Only locks for resource groups** and *especially* for production environments.

<!--more-->

As a consultant, I probably have the privilege of seeing more types of environments on Azure than the average Azure user. In my opinion, this is one of the easiest and least used features in Azure. It's scary to know how many production environments are prone to manual mistakes. Some human... could very easily think they're modifying a different environment, and they end up modifying production. Moreover, this can also happen for someone that is *supposed* to have access and there's few people with access, although chances are probably reduced. It only needs to happen once to cause an outage. 

A resource group lock can help. There's two types of locks: a `CanNotDelete` lock and a `ReadOnly` lock. A `ReadOnly` lock forbids anyone from making changes to the resources on Azure. So for production environments, I recommend that you look at a `ReadOnly` lock so that no one can make configuration changes without going through a pipeline.

When using resource group locks and pipelines together, you can also enforce rules like <mark>"all changes must go through the pipeline including config changes."</mark> You would allow the pipeline to remove a lock, perform a deployment, and re-create the read-only lock. More on this later. 

## A wonderful side-effect

When web jobs, azure functions, or web apps are in a resource group that has a `ReadOnly` lock, no one will be able to *see* the app settings and connection strings. 

![](/assets/uploads/readonly-lock.png "Resource group lock and app settings")

This is great feature without requiring an entire key vault just to hide secrets and connection strings. Sometimes, it's nice to not have to write extra code.

## Caveat

Test it out first. Sometimes, when new Azure resources first come out they might not play nicely with resource group locks, especially \`ReadOnly\` ones. I have had funky issues with using these locks on an resource group with an AKS cluster.
