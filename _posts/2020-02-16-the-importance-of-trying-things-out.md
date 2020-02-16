---
layout: post
title: The importance of trying things out
tags:
  - culture
date: 2020-02-16T04:13:48.123Z
featured: false
hidden: false
comments: false
---
There's often much excitement and hype with new technologies. When I learn about a new solution, I immediately get excited at the possibilities. I visualize all the ways I could use it and I get *curious*. Sometimes though, there are huge gaps in new technology that make it impractical for daily usage or to solve *the need*. Validating the idea early is very useful. Certainly helps avoid wasting huge amounts of time and emotional energy.

<!--more--> 

### A recent example

Over the past week, I've been chewing on the idea of [modules to break up complex infrastructure](https://blog.gruntwork.io/how-to-create-reusable-infrastructure-with-terraform-modules-25526d65f73d). I started to work on this concept to provision an opinionated AKS cluster with GitOps. My goal was to run my Terraform plan then minutes later have an application running. 

To make this happen, I wanted to:

* First, create a module to deploy an AKS cluster
* Secondly, have another module that would configure a Kubernetes cluster with GitOps (fluxcd)
* Deploy both modules through the same Terraform plan

Well...

It turns out that Terraform does not:

* [Support module dependencies](https://github.com/hashicorp/terraform/issues/1178)
* [Support provider dependencies](https://github.com/hashicorp/terraform/issues/2430)

So, my Terraform plan fails because the second module does not have the necessary information to connect to it. In other words, because the Kubernetes provider cannot wait until the cluster is created, there's nothing to connect to. 

It's still frustrating. It's also happened to me before with other tech. The problem I was trying to solve will be relevant for some time. I try to assess:  "Is the payout worth the extra effort?"

Now, I know.
