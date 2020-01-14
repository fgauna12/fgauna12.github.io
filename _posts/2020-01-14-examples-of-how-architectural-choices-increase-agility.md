---
layout: post
title: Examples of how architectural choices increase agility
tags:
  - architecture
date: 2020-01-14T03:27:26.605Z
featured: false
hidden: false
comments: false
---
Yesterday, I spoke about the value of making architectural decisions to aid agility. Agility requires high deployment frequency (deployments to production per day), and low lead time (time between commit to production deploy). Otherwise, 

## NoSQL databases

Some NoSQL databases are useful in circumstances where the data needed to be housed is unstructured or semi-structured. Many NoSQL databases like key-value, and document databases don't require formal schema changes because \_there is no schema to change.\_ Speaking from experience, there's a lot of agility to be gained when developers don't have to worry about schema changes, constraints, column sizes, etc.

In Azure, this could mean choosing to use a lighter, simpler, cheaper database like Azure Table Storage over the most common choice of Azure SQL. Likewise, if there is a demand for it, Cosmos DB could fulfill a need.

## Event-based architecture

With the advent of services like [Event Grid](https://docs.microsoft.com/en-us/archive/msdn-magazine/2018/february/azure-event-driven-architecture-in-the-cloud-with-azure-event-grid), it's ever more simple to create event-driven architectures. When components of an architecture react or are "triggered" based on an event, it's easy to replace the component in the future. It's also much easier to extend the architecture unobtrusively since there will be natural extensibility "hooks" for developers to leverage. It's also less likely that the system will grow to be a "big ball of mud" or the infamous monolith in the future, although results may vary.

For example, if there is an event that is published when a *new user registers*, then it's easy for developers to create components that listen for that event and send a welcome email. If at some point in the future, there was a *need* to also send a text-message, it would be a simple addition of a new component that also listens to the same event. \
\
Here's a comprehensive comparison of the [various messaging](https://docs.microsoft.com/en-us/azure/event-grid/compare-messaging-services) services on Azure.
