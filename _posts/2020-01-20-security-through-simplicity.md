---
layout: post
title: Security through simplicity
tags:
  - architecture
  - kubernetes
  - security
date: 2020-01-20T04:05:45.390Z
featured: false
hidden: false
comments: false
---
Security is complicated. It's very difficult to get right. Building your own authentication system can be a bad idea. Building your own secret store can be a bad idea. Building your own encryption algorithm can be a bad idea. The list goes on.

<!--more-->

> Programming is hard. Security is harder. - Brock Allen

Getting security right is extremely difficult. There's a lot of risk in exposure and being poor custodians of our customer's data. Also, in terms of architecture, authentication and authorization are often cross cutting concerns. 

A great example of this is - GitOps. GitOps is when we use a Git repository to declare the manifests that should be in our Kubernetes cluster. Another key component is installing an agent or operator on the cluster that watches the Git repository for changes. When a repo changes, it reflects it on the cluster. It's more secure because there's no need to have a service account that is able to push changes to the cluster in order to issue a deployment. Instead, the cluster is constantly watching and self-updating.

Another similar innovation is Helm 3.0. In Helm 3.0, they removed Tiller. Helm is a package manager for Kubernetes and in Helm 2.0 it used a server-side component called Tiller. Tiller did some of the heavy lifting of mapping helm releases to kubernetes deployments. The bad part about Tiller, it was difficult to secure, therefore it was likely that there are many insecure Tiller installations around the world. See this [great post on how to exploit it](https://blog.ropnop.com/attacking-default-installs-of-helm-on-kubernetes/).

> Simple can be harder than complex; you have to work hard to get your thinking clean to make it simple. -Steve Jobs

With creativity and with hard-work, solutions can become simple. I love that quote a lot. It's not easy to make "simple" solutions. Let the client, the user, your peers be the judge of "simple". If an engineer is looking for a quick win, for the fastest path, that's a hack. Just like Helm and GitOps, it took a couple of iterations to arrive at a "simple" solution.
