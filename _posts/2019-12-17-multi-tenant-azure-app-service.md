---
layout: post
title: Azure App Service and Network Security
tags:
  - azure
date: 2019-12-18T02:03:06.554Z
featured: false
hidden: false
comments: false
---
Azure App Service Environments are expensive. You do get true network isolation and dedicated instances in which you can place behind WAFs and custom WAF appliances. However, in many cases, many organizations can save on costs by using multi-tenant Azure app services. Multi-tenant app services are fairly inexpensive and often times can be less than the cost of a dedicated VM running IIS.

<!--more-->

[Application Gateways](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-web-app-overview) support multi-tenant backends like Azure App Services. These app gateways serve act as a reverse proxy, provide SSL termination in one place, and give basic **WAF** functionality (if you so choose). 

After traffic is able to reach your Azure App Service, you can also restrict access to that app service from only traffic comming from the Application Gateway. You can do this in two ways: [white-listing the IP](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions#adding-ip-address-rules) of the Application Gateway, or allowing traffic only coming from the Application Gateway subnet (preferred). For the latter approach, you'll also have to create a [service endpoint](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions#adding-ip-address-rules) on the VNet to be able to allow VNet traffic to the multi-tenant Azure App Service.

Lastly, if the Azure App Service needs to reach private resources inside of a VNet, such as services running on VMs, then you'll need to add [Virtual Network Integration to the App Service](https://docs.microsoft.com/en-us/azure/app-service/web-sites-integrate-with-vnet). Recently, Azure announced a new type of integration that doesn't require a point-site VPN and therefore get charged for a virtual network gateway.
