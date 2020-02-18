---
layout: post
title: The hidden costs of Kubernetes
tags:
  - devops
  - kubernetes
date: 2020-02-18T04:13:34.683Z
featured: false
hidden: false
comments: false
---
I am a believer of PaaS. In my experience, PaaS on Azure is very easy to use and there's a lot of bang for the buck. I get to worry less about the infrastructure and focus more about the application itself. 

Kubernetes has the same promise, except at a bigger scale. There's many benefits of Kubernetes that in my opinion make it more of a Lamborghini compared to modern PaaS. Kubernetes has no doubt taken the world by a storm and it's the future. So what are the hidden costs? Surely it's not all fun and roses. 

## Learning curve

It's huge for someone who's not familiar with containers. It's gigantic for those not familiar with Linux. The key for a successful adoption is being strategic about when to deliver and release and when to embrace Kubernetes. Taking it bit by bit. For example, here's more on a path towards [Kubernetes for .NET Developers](https://gaunacode.com/net-developers-and-the-path-to-kubernetes).

But it's more than just the learning curve for developers. In many cases, operators in .NET shops only know about operations of Windows-based systems. Kubernetes is far from the typical infrastructure. In some cases, a Kubernetes cluster could be the company's first cloud project. That's why it's important to release to production a Minimum Viable Feature with Kubernetes so that it gives operators a chance to learn how to maintain a production-grade cluster. Let's not throw over the wall a cluster to the poor team.

## More moving parts

Kubernetes is complicated and there's many moving parts. With the advent of microservices, there's even more moving parts. With the necessary telemetry and other infrastructure that we _want_ in a cluster, there's even more moving parts. Moving parts to watch the moving parts that orchestrate the moving parts. 

So it's important that teams are *choosy* when adding more to the cluster. There's a cost associated with service meshes, with daemon sets that aggregate metrics/logs, with other infrastructure services like Redis and Vault.  These services consume resources from the cluster and reduce the capacity. Let's not just install something because there's a Helm chart for it.

## The security

More moving parts increases the surface area of attacks. Assuming that communication between services is secured can be risky. Securing communication between services can be expensive or brittle.

Also, there's the matter of container security. Do you have a process for finding vulnerabilities in base images and re-deploying so that to apply the latest patches?\

What about secret management? Kubernetes secrets are fairly simplistic. Maybe you want a secret store for that. What to use? Azure KeyVault? HashiCorp Vault? Not easy decisions to make. These are critical shared components in an architecture that could cause downtime if they're not working.


I love Kubernetes. When it's fit for the job, the benefits outweigh the costs. It's really good at keeping systems alive in production and helping teams scale and deploy with confidence. There are costs associated with it and they're not talked about as often.
