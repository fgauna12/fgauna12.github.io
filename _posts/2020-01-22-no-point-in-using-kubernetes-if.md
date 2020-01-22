---
layout: post
title: No point in using Kubernetes if...
tags:
  - devops
  - kubernetes
date: 2020-01-22T03:42:29.788Z
featured: false
hidden: false
comments: false
---
... you're not using it in production. 

<!--more-->

Why?

Because Kubernetes is fundamental to creating systems that are **"self-healing.**" To lessening operational costs so that there's less personnel baby sitting infrastructure. So that operators don't waste time manually restarting web servers. So, they don't have to schedule "maintenance" windows and bring down websites to perform OS patches.

Have app that are starting to monopolize resources like memory? Say, because of a memory leak? Kubernetes can kill pods when they hog resources and start them up again (as long as you set pod limits).

A node goes down? Taking down running pods with it? Don't worry pods will get spawn up in different nodes. 

Worried about funneling traffic to pods that are not *healthy* because of broken external dependencies? Say... a database outside the cluster went down? You can define liveness and readiness probes on your pods so that they only accept traffic if they have a healthy connection to the database.

The list goes on. But, it's also about being able to **deploy frequently** without risking downtime.

Want to deploy your application during business hours? Without affecting your users? Well, rolling updates are a first-class citizen in Kubernetes (the tricky part is creating database migrations so that you can rollback).

So, in other words and to put it bluntly, <mark>if you're not deploying to production there's nothing for Kubernetes to orchestrate</mark>. There's nothing for Kubenetes to keep alive. I'ts not saving you and your teams time. It's not lessening unplanned work.

Even if you had something in production, but you had a *low deployment frequency*, then you won't be maximizing the benefits of rolling upgrades (zero downtime deployments). To get the most out of zero downtime deployments, use them often.

It's a bit obvious. Sometimes, we do get caught in the craziness of work and we lose sight of the goals. It happens. I have talked to teams that are adopting Kubernetes because it's *the craze.* I do hear companies that spend several months or over even years building a Kubernetes-based system. If you wait a year to go "live" with Kubernetes, you would have wasted valuable time and money.

Does this resonate with you? Do you see the value in leveraging Kubernetes for production quickly? Sometimes, it's a worth a step back because it's possible that it's [not the best fit](https://gaunacode.com/taking-a-lamborghini-through-a-sidewalk).
