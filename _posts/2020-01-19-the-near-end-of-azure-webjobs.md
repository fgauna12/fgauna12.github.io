---
layout: post
title: The near end of azure webjobs
tags:
  - azure
date: 2020-01-19T04:23:18.674Z
featured: false
hidden: false
comments: false
---
Azure webjobs have been around for a while. In fact, the Azure functions SDK builds on top of the webjobs SDK. Azure functions are the most popular because of their event-driven and microbilling aspects. [Trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings) them when an event occurs. Then, only pay for what you use. Scale automatically.

<!--more--> 

The [Microsoft documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs#webjobs-and-the-webjobs-sdk) does a great job outlining many differences and giving some opinions.

But, they recently announced a new plan for Azure functions - [premium plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#premium-plan). Premium plan backfills many of the weaknesses that Azure functions had over webjobs:

- VNet integration
- No coldstart issue
- Better hardware

So, is there a need to create Azure webjobs anymore? Probably not. There are a few small circumstances, such as the need for file system trigger. Other than that, the only other usecase I can think of is something I needed recently: less outbound IPs. I had a situation in which I had to whitelist my service so having a webjob made the list of possible outbound IPs much smaller than a consumption-based azure function. For a consumption-based azure function, I would have to whitelist the entire datacenter.
