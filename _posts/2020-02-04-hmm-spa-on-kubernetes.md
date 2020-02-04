---
layout: post
title: hmm... spa on kubernetes?
tags:
  - architecture
  - kubernetes
date: 2020-02-04T00:53:30.598Z
featured: false
hidden: false
comments: false
---
Sometimes, when we have a hammer, everything is a nail. When we have Kubernetes, we want to deploy everything on it. Is it really worth deploying a static website on Kubernetes?

<!--more-->

Maybe. If you absolutely need Server Side Rendering (SSR) then you probably need a web server. Google will crawl your web server and you'll get better SEO among other things. But what if you don't? What if you don't need SEO?

There's other solutions. For example, one of my favorites is using [Azure Blob Storage for static website hosting](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website). Once you have static site hosting, you can other other services like Azure CDN or Azure Frontdoor to cache content at the edge. 

The more the spa is used, the more likely it's going to be cached at an edge node close to a user. The more likely it's cached, then the more likely the request will never have to reach blob storage anyway. And the best part - if you host your app on a service like Azure Blob Storage, you don't have to host anything your Kubernetes cluster. 

No deployment file. No container. No CI/CD pipeline to a docker registry. No security scans. No NGINX static file server configuration.  No nodejs, asp.net core, [other stack] static content server configuration.

When your app is served through a CDN, there's extreme redundancy. Especially if you use the [read-access geo-zone-redundant storage (RA-GZRS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-redundancy). 16 9's SLA. And, did I mention it's super cheap? I mean for a 1 GB spa (which sounds massive) would cost roughly 2 dollars a month on RA-GRS on just storage costs. 

There's also egress from the azure data center. So depending on usage, you might spend a couple of bucks there. For a client at the moment hosting two reactjs spas in production, with at least a few hundred users using the site, they're not really exceeding the free 5 GB of egress bandwidth.

Moral of the story: it's useful to take a step back and pick the right tool for the job. Kubernetes is great for server-side, business critical, dynamic content. That goes for any web server to be honest. For static, client-side, cacheable content there's other simpler and newer methods. 

Keeping it simple will allow you more bandwidth to spend on the cooler, harder problems.
