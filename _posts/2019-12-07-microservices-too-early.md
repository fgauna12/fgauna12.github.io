---
layout: post
title: Microservices too early
tags:
  - devops
  - architecture
  - microservices
date: 2019-12-08T00:23:54.481Z
featured: false
hidden: false
comments: false
---


I get it. I too often times want to find a problem to a solution I want to use. This mindset can be dangerous, especially with system architecture. 

Imagine being part of a small team. The team sketches a pretty microservice architecture like this

![](/assets/uploads/architecture_a.png "Pretty Architecture")

If the team is developing the entire thing, each team member will most likely know how each of the services work and how they're written.

There's a strong chance that it might end up looking more like this

![](/assets/uploads/architecture_b.png "Ugly Architecture")


Why?

Because practically speaking, the developers will know how each of the components work. This means that they will do what they do best - keeping things [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). They will also want to ship features, meet deadlines, and go home on time. So, expect them to reuse code if they know what's inside of each service.

It's human. It's understandable. It's most likely won't be scalable and the network latency will most likely be a problem. 

It's much easier to start with one service. In my experience, it takes a while in developing a service when it starts to become _monolithic_. If it becomes too big, you'll have a bigger understanding of how the domain works and where the new service boundaries could be. On the flip side, it's much harder to join services together after they've been split too early. It's not fun trying to justify that rework to the business. 

Understanding the business domain and the value streams are probably one of the most important things. They will highlight where the most effective service boundaries are.
