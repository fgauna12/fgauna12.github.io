---
layout: post
title: The hidden value of containers
tags:
  - devops
  - containers
date: 2019-12-11T22:27:32.911Z
featured: false
hidden: false
comments: false
---
It might not be obvious, and certainly when I got started with containers, I didn't realize that there's side-benefits that are not typically talked about.

You might know the main benefits already,

* Similar to VMs, they provide a consistent runtime environment
* Similar to VMs, they act as a sandbox for applications
* Unlike VMs, they have a small disk footprint
* Unlike VMs, they have a very small overhead 

In short, because they are lightweight, they have all the benefits from VMs and they are fast to start. This small difference opens a new world of possibilities.

## Extending the Art of the Possible

Since they are fast to start and they are portable, with some work you can run the entire application from the CI/CD pipelines. This opens new possibilities for things that were once much harder to do - running functional tests **before** deploying anywhere.

![](/assets/uploads/containers.png "Running Smoke Tests from the Pipeline")

In the example above, we run functional smoke tests against a _docker compose_ version of the application, database and all. You can extend this concept to also run penetration tests as I alluded in my previous [DevSecOps post](https://gaunacode.com/a-devsecops-process). 

What's risky? What fails often? Database changes? API Authentication?

There are things you can probably test with containers without deploying to an environment _and_ spending money on cloud resources.
