---
layout: post
title: Architecture to drive agility
tags:
  - architecture
date: 2020-01-12T23:17:05.703Z
featured: false
hidden: false
comments: false
---
When we think of software architecture, we often think of aspects like the type (e.g. N-tier, onion, etc.), [patterns](https://martinfowler.com/eaaCatalog/), approaches (e.g. [DDD](https://en.wikipedia.org/wiki/Domain-driven_design)), data-flow, resiliency, and scalability. What about business agility? How will you release updates to the system? In my experience, I have seen many people treat it as a mundane detail that we can figure out closer to "go-live."

<!--more-->

It's different with physical architecture like designing buildings, bridges, and the likes. For example, airports consider many other aspects than just airtraffic control, terminals, customer parking, and pick-up locations. They also consider where employees will park, where loading docks will be restocking supplies for food services, and the list goes on. They engineer ways of how they will **maintain** the structure and offer great service.

A prime example is Disney World. At Magic Kingdom, they have an [extensive underground system](https://en.wikipedia.org/wiki/Disney_utilidor_system) to help cast members get around the park to their stations. They also have kitchens, storage areas, locker rooms, and many more thought-out work stations. If cast members are timely, if they can ship food/beverages/supplies swiftly, they will provide a much better guest experience consistently. 

In software architecture, it's easy to see decisions that hinder agility like [integration databases](https://martinfowler.com/bliki/IntegrationDatabase.html). When multiple applications are heavily coupled because they share a database, it's difficult to evolve them and change them without spreading risk. It's also hard to design a CI/CD process to an application that's deeply bound to one. It might not even be worth it, especially when they compete for schema changes.

<mark>When we design for agility, we can deploy independently of other teams and with little risk.</mark>There's no need to have a shared schedule where all teams try to get into alignment. Less excuses for a Change Approval Board (CAB). When the business can see that it's safe to deploy often, there are little excuses of slowing down processes. So as an organization grows, the deployment frequency can remain constant or improve. Meaning, if today you could deploy once a week to production when your organization had two developers, then tomorrow you could deploy twice a week to production with fifty developers.

So, what changes would you make to an architecture to deploy daily to production? 

Sorry, but there's only so much a DevOps guy can do. Problems like integration databases are strictly architectural.
