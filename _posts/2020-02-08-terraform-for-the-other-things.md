---
layout: post
title: Terraform for the other things
tags:
  - devops
date: 2020-02-08T04:07:22.208Z
featured: false
hidden: false
comments: false
---
Terraform has a huge advantage over ARM templates. It's the fact that it can provisions resources *other than* Azure. 

<!--more-->

They have a fascinating list of [official providers](https://www.terraform.io/docs/providers/acme/index.html). There's also a [community list of providers.](https://www.terraform.io/docs/providers/type/community-index.html) The ability to provision resources across many platforms is so powerful. 

In the past, there's been several occasions in which I helped create "one-time" scripts to interact with other SaaS offerings outside of Azure. To coordinate the deployment and the semi-manual operations a person had to do for a release. Why? Because I did not know about Terraform and ARM is limited to resources in Azure. For instance, sometimes we want to configure a domain name through a DNS provider. There's a Terraform provider for many DNS providers like CloudFlare, SimpleDNS, and PowerDNS.

I also like that there's new possibilities like creating service principals in Azure AD. So, sometimes to enable automated deployments, we need to create service principals to authenticate these deployment services. Ironically, it's often one of those steps that is very manual. Terraform also has an Azure AD provider, which includes the capability to create service principals. Why? So you that you can have [secure service connections](https://gaunacode.com/creating-secure-service-connections-in-azure-devops) that follow the principle of least privilege.
