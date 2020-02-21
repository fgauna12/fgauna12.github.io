---
layout: post
title: Code promotion with containers
tags:
  - devops
  - containers
date: 2020-02-21T03:30:57.524Z
featured: false
hidden: false
comments: false
---
Due to the nature of containers, to deploy changes to an environment, these environments have to *pull* a chosen image tag from a container registry. In other words, there's no code *pushed* to environments. The easy and dangerous way is to have your environments reference the *latest* tag. It works for POCs but in practice it can be quite dangerous. 

<!--more--> 

First, you want to your CI pipeline to build a container and tag it with something like the *git commit hash* or the *build id*. This way, you can reference the change with what's being packaged in a container. 

Then, comes the more interesting question. 

How many container registries are appropriate?

It depends. One option could be to have a single container registry, as long it's following [best-practices](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-best-practices) while having the discipline of only deploying to production through automation and referencing explicit *image tags*. For small teams/shops, this could be sufficient. 

In more regulated environments, especially when you're looking to add additional controls like firewall restrictions of what IPs can interact with a container registry, then it could be more productive to have multiple container registries. Here, you could have a dev registry where developers can iterate quickly and deploy often. Then, once an image is tested and validated it can be *promoted* to a *production* container registry through a CD process. 

A bit more pain to set-up. There are trade-offs between agility and governance/security.
