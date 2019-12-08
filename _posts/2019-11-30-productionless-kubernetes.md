---
layout: post
title: Productionless Kubernetes
tags: 
  - devops
  - kubernetes
date: 2019-11-30T13:35:05.237Z
featured: false
hidden: false
comments: false
---
So I found out about greenfield project being developed on Kubernetes. It was a sizable project with microservices and the likes. It has been in development for **a year.** 

<!--more-->

> They haven't deployed to production

... and they won't for the near future.

Why? Because it's not done. Because the business is scared to release it. 

It hurts. The way I see it, they're missing out on the value of Kubernetes.<br>
Kubernetes is really good at orchestrating systems in production.

The self-healing, the horizontal-pod autoscaling, the zero-downtime deployments, the way you can upgrade nodes, etc etc. These are all features that are only valuable for when they increase the reliability and agility of workloads running on it. No even further, these are features valuable when you've suffered a mishap in production and your users didn't notice. Or when your are able to deploy during business hours and your users aren't noticing. 

For many organizations, it's likely the first Kubernetes endeavor. Kubernetes has a huge learning curve, especially for operations teams used to Windows environments. Waiting until the end for a big-bang production release with a brand-new production environment is a disaster waiting to happen. A training or Udemy course on Kubernetes won't be enough for operations to learn how to maintain a healthy cluster. They need real-world **practice**.

Go to production early. Just because you deploy it, doesn't mean you have to release it to all your users. You'll be glad you got the hard stuff out of the way and you'll start gaining real-world experience.
