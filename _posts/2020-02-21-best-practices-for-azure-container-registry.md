---
layout: post
title: Best practices for Azure Container Registry
tags:
  - azure
  - containers
date: 2020-02-21T22:15:26.678Z
featured: false
hidden: false
comments: false
---
It's easy to create a private container registry on Azure. It'd be a private registry that only you and whoever is part of your organization can access. There's great documentation by Microsoft on [some best practices](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices). Below are my top two.

<!--more-->

### Availability

When services scale out due to Horizontal Pod Autoscaler. 
Whenever pods exceed quotas, they are killed and spawn up again by Kubernetes. 
Whenever a node dies, those pods that lived on those nodes will be re-instantiated elsewhere.

And of course, when there's a new deployment. 

Under all those circumstances, your container registry will be invoked to pull a new image.

So ensure that you're container registry is geo-replicated in the case of a disaster in an Azure region.

### Use Namespaces

As more internal teams start adopting containerization, there will be more and more images uploaded. A great way to separate and group images together is through the use of namespaces. They're almost like folders inside of the registry. 

Please note that this is not supported on Docker Hub. That's why you won't see images structured this way.

Here's an example

```
contoso.azurecr.io/billing/billing.api:15231.0
contoso.azurecr.io/bulling/billing.portal:6562.0
```

It's purely a logical grouping of images. It's not a way to isolate images and have control over more fine-grained authorization.
