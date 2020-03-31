---
layout: post
title: Azure Hybrid Connections
tags:
  - azure
date: 2020-03-31T03:14:41.800Z
featured: false
hidden: false
comments: false
---
On of the big hold-ups in migration applications to Azure can be on-prem dependencies. Especially when looking to leverage PaaS, dependencies on to on-prem databases or services can be showstoppers. Azure Hybrid Connections are an easy way to add connectivity from PaaS services to dependencies outside of Azure. 

<!--more-->

## Background

[Azure App Service Hybrid Connections](https://docs.microsoft.com/en-us/azure/app-service/app-service-hybrid-connections) allows Azure Web Apps and Azure Functions to leverage resources in other networks. To the app service, each Hybrid Connection is mapped to a single TCP host and port combination. Meaning, a database or service on your on-prem network to an app service. 

Azure Hybrid Connections leverage one of the oldest services on Azure, Service Bus Relays. Yes, underneath the covers, this Azure service leverage an Azure Service Bus. From one end, the PaaS Azure service connects to a Hybrid Connection resource. From the other end, there is a Hybrid Connection Manager that is installed on the target environment, such as on-prem. This Hybrid Connection Manager connects outbound to the Azure Service Bus .

## The Pros

**Security through simplicity** - Because the Hybrid Connection Manager uses outbound connectivity to Azure Service Bus, there is no need to open firewall ports. There is no need to expose internal services or databases from the corporate network to the outside world. 

**Easy to use** - Setting up an Azure Hybrid Connection is quite easy. There's no intimate level of networking required. The hardest bit might be installing the Hybrid Connection Manager on-prem.

## The Cons

**Performance** - Depending on your needs, the performance from an Azure Hybrid Connection Manager might not be sufficient. For enterprises and teams maintaining hundreds of apps that have tens of users at any given time, Azure Hybrid Connections might be enough. For running high-availability and high-reliability workloads, the latency might not enough. The performance is ultimately tied to an Azure Service Bus namespace. There is also an additional hop since Azure Hybrid Connection acts as a proxy in some sense.

**Enabling Procrastination** - This one is highly subjective. I find that when migrating applications to Azure, it's useful to work on the hardest problems first. Often times, hosting an application though an App Service is by far the easiest part. Instead, moving databases to Azure can be more challenging in terms of technical challenges and people challenges. People challenges? Yes, sometimes it's not an easy conversation to have with a DBA.