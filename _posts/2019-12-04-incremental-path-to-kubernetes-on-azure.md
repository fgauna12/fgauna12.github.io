---
layout: post
title: Incremental Path to Kubernetes on Azure
tags: 
  - devops
  - kubernetes
  - microservices
date: 2019-12-04T22:26:22.686Z
featured: false
hidden: false
comments: false
---
In a [previous post](https://gaunacode.com/net-developers-and-the-path-to-kubernetes), I talked about the huge learning curve for Kubernetes, especially for .NET developers. 

* How could a team progressively start heading to Kubernetes incrementally?

Did you know that you can deploy containers on PaaS? Azure Web Apps, aka App Services, allow you to deploy containerized applications onto them. They are called [Azure Web Apps for Containers](https://azure.microsoft.com/en-us/services/app-service/containers/). They give you many of the same features that we love on traditional Web Apps like auto-scaling, SSL termination, custom domains, etc. 

There are some features missing compared to traditional app services and yet they are still more suitable for web applications and web APIs than Azure Container Instances.

The point though, is that it will help the team get real-world experience with a limited skillset required for a Kubernetes project. It will help you gain exposure to: 

- Docker and containerization
- Usage of a container registry and its security
- Container image scanning
- Continuous integration for containers
- Spinning up ephemeral environments to run integration, or functional tests, or even penetration tests!

Of course, you could also invest in continuous delivery and observability through monitoring and Application Performance Monitoring (APM) tools.

After you incrementally grow these capabilities, you could invest a lot more time into Kubernetes and have to learn less at once. 

Lastly, did you know that just because you are using Kubernetes you don't have to break your architecture into microservices? Also, just because you're creating microservices you don't have to use Kubernetes. 
More on this later. 
