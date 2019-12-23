---
layout: post
title: Quick and dirty helm chart
tags:
  - kubernetes
date: 2019-12-23T21:46:47.264Z
featured: false
hidden: false
comments: false
---
Yesterday, I posted about how to create a [quick and dirty container](https://gaunacode.com/quick-and-dirty-container) using Visual Studio and ASP.NET Core.  Today, I will be continuing the demo to show to create a quick helm chart for an ASP.NET Core application.

<!--more--> 

## Pre-Requisites

* [Docker Community Edition for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
* Windows 10
* [Kubernetes CLI for Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows)
* [Helm for Windows](https://helm.sh/docs/intro/install/)
* In Visual Studio 2019, install the Azure Development workload.
* In Visual Studio 2017, install the Web Development workload and Visual Studio Tools for Kubernetes.

## The Shortcut

Similar to yesterday's topic, I also recommend that you know the fundamentals for Kubernetes and how to issue deployments. Then, it's easier to understand the value that Helm provides and when it's effective to use it. 

Assuming you already believe Helm can solve some painpoints, then this guide will walk you through using Visual Studio to create Helm charts tailored for ASP.NET Core apps.

First, right-click, select "Add" then "Add Container Orchestrator Support."

![](/assets/uploads/annotation-2019-12-23-165841.jpg "Right-click add container orchestrator support")

Then, select Kubernetes/Helm.

![](/assets/uploads/annotation-2019-12-23-171316.jpg "Selecting Kubernetes")

**That's it!** You'll notice:

* A `azds.yaml` file. This is for Azure Dev Spaces. I often delete it. 
* A `charts` folder. It contains the generated helm chart for this app. It contains many of the k8s resources typically used for a web app like the ingress route definition, service definition, deployment definition, and helper functions to help with secrets.

![](/assets/uploads/annotation-2019-12-23-172138.jpg)
