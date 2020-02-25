---
layout: post
title: Immutable infrastructure
tags:
  - devops
date: 2020-02-25T21:38:48.116Z
featured: false
hidden: false
comments: false
---
[Cattle vs pets](https://devops.stackexchange.com/a/654) is a well known concept in DevOps used to describe a mindset when treating servers. The core meaning behind it is *immutable infrastructure*.

<!--more--> 

Today, I saw a server that was created over 5 years. I found this out through the cloud provider's API. Chances are... it was not provisioned through Infrastructure as Code. If it were, there might have been a scenario where there was an issue and it was simply torn down and re-created. Hence, the lifespan would have been shorter than 5 years.

There's also an effect of the honor system. Engineers and admins have to take extra steps to ensure that servers are configured a certain way. They have to be diligent about documenting the work. Sometimes, it's not as clear and evident on the changes someone made on a server.

With Infrastructure as Code, infrastructure can be described declaratively. It can then committed to source control.  Source control makes changes visible, makes collaboration much easier, and of course you get versioning. So, infrastructure that is on source control can become the source of truth. 

This is powerful. \
\
It's easier to collaborate. Easier to revert. Servers can be destroyed and re-created without fear of misconfiguration. In fact, quite the opposite. If a server that was 5 years old was created through Infrastructure as Code, I would want to destroy it and recreate it to ensure the process works when I need it most.
