---
layout: post
title: Minimum TLS version with Azure App Services
tags:
  - azure
date: 2020-03-27T03:20:13.847Z
featured: false
hidden: false
comments: false
---
Older .NET Framework versions defaulted to use a TLS version of 1.0 or 1.1. Today, TLS 1.2 is the newest. As of [2018](https://azure.microsoft.com/en-us/updates/new-app-service-apps-deployed-with-tls-1-2-as-default-from-june-30/), Azure App Services default to TLS 1.2. This means that you might run into issues with older .NET applications failed to issue web requests against apps/apis hosted on these app services.

<!--more-->

> "The underlying connection was closed: An unexpected error occurred on a send.

This problem especially presents itself for .NET framework applications versions [4.6.1 and lower](https://stackoverflow.com/questions/34808830/tls-1-2-error-with-c-sharp-net-the-underlying-connection-was-closed-an-unexp). These older applications don't default to TLS 1.2 when issuing web requests. 

There's two ways to fix it. One is to force the .NET client code to default to [TLS 1.2](https://stackoverflow.com/a/36454717) (as long as the framework version supports it).

Another way is to chose minimum TLS version on a Azure App Service . As mentioned earlier, Azure App Services default to Tls 1.2 since 2018.

You can do this from the TLS/SSL settings blade in an Azure App Service.

![](/assets/uploads/2020-03-26_23-56-25.jpg "Choosing minimum TLS version")