---
layout: post
title: Azure App Service Hybrid Connection Performance - Part 1
tags:
  - azure
date: 2020-04-01T03:34:29.996Z
featured: false
hidden: false
comments: false
---
This is the first post in a series to try to determine roughly the performance of Azure App Service Hybrid Connections. I'll create a quick experiment to understand the latency introduced by hybrid connections in comparison to an direct connection and a service endpoint connection.

<!--more-->

## The hypothesis

I anticipate that there is anywhere from 100-500 ms latency added by simply choosing to interact to use Azure App Service Hybrid Connections. I also anticipate that the Azure App Service vnet integration is faster than hybrid connections.

## The experiment

For the experiment, I'll test three cases. First, I'll measure the performance of an Azure App Service hosting an ASP.NET Core API that issues requests to another API. This other API will be hosted on a VM through IIS and listening on port 80. In this case, this other API will be publicly accessible from the internet. 

{% include image-caption.html imageurl="/assets/uploads/2020-04-01_0-00-44.jpg#wide" title="Experiment Test Case #1" caption="Using a Direct Connection through internet" %}

Secondly, I'll measure the performance of the same Azure App Service hosting the API issuing requests to the second API. This other API will remain hosted through IIS on a VM and listening on port 80. In this case, the first API will connect to the second API using hybrid connections.

![]( "Experiment Test Case #2")
{% include image-caption.html imageurl="/assets/uploads/2020-04-01_0-00-53.jpg#wide" title="Experiment Test Case #2" caption="Using Hybrid Connections" %}

Third, I'll measure the performance of the App Service connecting to the second API using Azure App Service vnet integration. The second API will not be publicly accessible and instead it will be accessible only through from within the vnet.

{% include image-caption.html imageurl="/assets/uploads/2020-04-01_0-01-02.jpg#wide" title="Experiment Test Case #3" caption="Using App Service VNET Integration" %}