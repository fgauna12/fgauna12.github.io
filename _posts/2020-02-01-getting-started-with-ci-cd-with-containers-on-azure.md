---
layout: post
title: Getting started with CI/CD with containers on Azure
tags:
  - devops
  - azure
date: 2020-02-01T03:51:36.016Z
featured: false
hidden: false
comments: false
---
I remember the first time trying to learn containers. They were fairly new in the .NET space and it was unclear whether or not they would really take off in my realm. Fast-forward several years and containers have changed our industry. With containers came more complexity and scalability challenges. As such, Kubernetes also became popular as the leading container orchestrator and took the world by storm. 

<!--more--> 

Now, there's an overwhelming list of permutations: 

* Containers without Kubernetes
* [Azure Functions running Containers](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-function-linux-custom-image?tabs=portal%2Cbash&pivots=programming-language-powershell)
* Flavors of Kubernetes
* GitOps
* Service Meshes
* Application Performance Monitoring and Log Aggregation
* Container Security

> How do you even begin?

There's a lot to learn if you're starting from the bottom. Don't worry you're not alone. 

## Start with Docker

Building containers using Docker is a must. Probably obvious. There's some great courses on PluralSight which I highly recommend called ["Getting Started with Docker"](https://app.pluralsight.com/library/courses/docker-getting-started/table-of-contents) by Nigel Poulton. 

### Practice makes perfect

Get the hang of building and developing containers. You can practice some of these skills through labs on [Katacoda](https://katacoda.com/courses/container-runtimes).

Once you feel comfortable on what it takes to build a container image and the use of Docker, you're ready for Azure DevOps. 

## Pipelines

[Azure DevOps Labs](https://www.azuredevopslabs.com/) is a hidden gem that many people don't know about. There's labs for many topics in Azure DevOps including CI/CD for containers. 

There's [this lab](https://www.azuredevopslabs.com/labs/vstsextend/docker/) in particular that will help you through creating a traditional CI/CD pipeline to an Azure Web App with Azure SQL. It will involve using the old build/release experiences using the GUI.

Next, you can try converting this to pipelines using YAML. I dropped [some hints](https://gaunacode.com/ci-cd-for-web-app-for-container) in a previous blogpost on how to do this.

## Kubernetes

Kubernetes is complex and also intriguing. I _know_ you'll get the itch to learn more. I sure did.

There's another great course on [PluralSight](https://app.pluralsight.com/library/courses/docker-kubernetes-big-picture/table-of-contents) by Nigel on Kubernetes.

[Katacoda](https://www.katacoda.com/courses/kubernetes) also has great labs for Kubernetes as well. These labs are especially useful because you don't have to spend money on a cluster running on the cloud or spend time configuring MiniKube locally.
