---
layout: post
title: Not all clusters are created equal
tags:
  - azure
  - kubernetes
date: 2019-12-13T01:31:27.480Z
featured: false
hidden: false
comments: false
---
Azure just announced support for using [Azure Application Gateways for ingress](https://azure.microsoft.com/en-us/blog/application-gateway-ingress-controller-for-azure-kubernetes-service/). It's great because it creates more options than just using an NGNIX ingress controller or other in-cluster solutions. When creating ingress routes, they ought to be annotated so that applications use the appropriate ingress controller. This brings up a good point: if we're defining our applications to use a certain cloud provider's technology, are all clusters created equal?

<!--more-->

Using on-prem clusters, scaling out ingress controllers can be quite difficult. For me, it came down to adding more nodes because being limited to one ingress pod per node. On AWS, it looks like [other ingress options](https://aws.amazon.com/blogs/opensource/kubernetes-ingress-aws-alb-ingress-controller/) have been available for some time.

It's more than just ingress. There's also different options for monitoring and logging depending on the cloud provider. When using Azure, there's fine integration with Azure Monitor. On AWS, there's CloudWatch and on Google Cloud there's Stackdriver. Azure Pipelines works best with Azure Kubernetes Service and it's a bit more difficult with Amazon EKS. Azure KeyVault and Application Insights are other examples of a richer experience with AKS.

Kubernetes is a step towards cloud agnosticism. I think it's a long road ahead towards taking applications and moving them between cloud providers seamlessly. Choose your managed Kubernetes provider carefully, you'll also be choosing its ecosystem too.
