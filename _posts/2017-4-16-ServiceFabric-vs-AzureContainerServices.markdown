---
layout: post
title:  "Service Fabric vs Azure Container Service - Part 1: Introduction"
date: 2017-04-19
categories: Azure Service-Fabric Containers Azure
tags: containers orchestration
comments: true
featured: true
hidden: true
featured_image_thumnail: assets/ACS-vs-SF.png
featured_image: assets/ACS-vs-SF.png
---

Companies like Netflix, Spotify, and Uber are poster childs for organizations using microservices successfully. They scale up/down with ease, they add new teams effortlessly, and they experiment with new features without much risk. Meanwhile, we're still developing the same monolithic apps with various layers and numerous design practices. We work hard to abide by best practices to further push off the imminent point of ["diminishing returns"](https://en.wikipedia.org/wiki/Diminishing_returns). _No wonder_, when we learn about these companies accomplishing so much a microservice architecture, we ask ourselves:

<!--more-->

> How can I build a microservices with .NET?

At [Nebbia](http://www.nebbiatech.com/), when we first started to think about microservices, we had a lot of interest in [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/). I suspect, because it's the first thing that comes up when you search for "Azure" and "microservices." Meanwhile, there's another Azure offering called [Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/container-service-intro) which allows you to host your microservice architecture with many of the same benefits as Service Fabric. Yes, comparing Service Fabric and Azure Container Service can be like comparing apples and oranges. But, although they're not the same kind but they do solve many of the same problems. 

## What's Service Fabric?

It was first developed internally in 2003 and it was called Microsoft Fabric. It's intent was to built a platform to deploy reliable services within Microsoft. 
A lot of the Azure services that we've come to love were built on top of Service Fabric. Services like Azure SQL, Bing, and DocumentDB were all built on top of Service Fabric.

It is an orchestration engine and a framework to build microservices using mostly .NET. It is a typical Microsoft product in the sense that it provides **tight integration with Visual Studio** and lets you get started pretty quickly. Unlike many of the other offerings out there, Service Fabric doesn't require your application to be in **containers**. This can be a good or bad thing depending on who you ask. 

As a framework, Service Fabric lets you build microservices of different flavors, including:

- A stateless service
- A stateful service
- A stateless Web API (Self-Hosted)
- ASP.NET Core app
- A guest container
- A guest executable
- An actor stateful service

<small>_Note_: Service Fabric cannot host traditional ASP.NET apps. I'll cover this in Part 2 of this series.</small>

## What's Azure Container Service (ACS)?

Azure Container Service is a different beast. It is mostly a IaaS offering powered by open-source tools. What Azure Container Service provides is the recommended infrastructure for your chosen **container orchestrator**. Azure sets up the load balancer, vnet, virtual machines, and the orchestration engine of your choice. 

The orchestration engine itself is the bread and butter of ACS. The container orchestrator itself will automate the container deployment, auto-scaling, and other features. 
Today, Microsoft offers 3 different open-source container orchestrators with Azure Container Service: 

1. [DC/OS](https://dcos.io/) (Linux Containers)
2. [Docker Swarm](https://docs.docker.com/engine/swarm/) (Linux Containers)
3. [Kubernetes](https://kubernetes.io/) (Linux/Windows Containers)

But, in order to understand the value of Azure Container Service, you have to understand the value of containers. Containers, in essence, are another form of virtualization. They are **much** lighter than VMs because they _do not contain the OS_ itself. Here's a [quick article](https://www.sdxcentral.com/cloud/containers/definitions/what-is-docker-container-open-source-project/) on what containers are.

Containers have been around for a long time in Linux and recently became available in Windows. Google has used Linux containers successfully for many years and built a platform in which they host many of their own service like Search and Google Maps. When containers started becoming popular with [Docker](https://www.docker.com/), Google chose to open-source their container orchestrator and is now known as **Kubernetes**. 

With Docker, building and managing container images is simple. In theory, you would build your microservice and package it as a container image, and the same code will run in production. It gives the phrase "it works on my machine" a whole another meaning.


## What they both offer

Service Fabric besides being a framework, it also is a microservice orchestrator. It constantly monitors and manages services on the cluster.
On the other hand, Azure Container Service won't do this for you, but the orchestrator that you choose will. Some of the common features are:

- Self-Healing Services
- Load Balancing & Service Location
- Monitoring
- Rolling Upgrades
- Host Container Images
- Automatic Scaling

So when would you pick one over the other? The answer is: **it depends**. It depends on you, your team, your organization, and the culture. To make an educated decision, not only should you look at the features but also:

- How are you deploying?
- How you develop your applications? SPAs? MVC?
- How is your team structured? 
- What are you comfortable with?

## What's Next?

- I'll be writing **Part 2** in which I discuss the limitations of both Azure Container Service and Service Fabric

## Further Reading
- [Martin's Fowler Microservice Guide](https://martinfowler.com/microservices/#how)
- [Building Microservices on Azure](https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-overview-microservices)
- [Intro to Azure Container Service](https://docs.microsoft.com/en-us/azure/container-service/container-service-intro)
- [Learn to Use Containers Online](https://katacoda.com/)
- [Microservice Patterns](http://microservices.io/index.html)




