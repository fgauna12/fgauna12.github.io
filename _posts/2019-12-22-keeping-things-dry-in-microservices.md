---
layout: post
title: DRY and microservices
tags:
  - architecture
  - microservices
date: 2019-12-22T01:16:03.540Z
featured: false
hidden: false
comments: false
---
Keeping code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) is a great concept in writing clean code. It reminds developers to write modularized that is easier to maintain. But taking this principle outside of code, can be dangerous. Taking it to architecture, infrastructure as code, and even build systems could cause more headaches than its worth.

<!--more--> 

When keeping things DRY with architecture, we often over-generalize. We say... customer is a customer. Or... an order is an order and it "doesn't matter where it comes from." However, it's quite the opposite, it does matter where it comes from. 

When building microservices, many people understand that designing services within [bounded context](https://martinfowler.com/bliki/BoundedContext.htmlhttps://martinfowler.com/bliki/BoundedContext.html) is a good practice. Bounded contexts are understanding that a model might mean slightly differently depending on who you talk to in the business. For example, a sales person, might care about the *customer*'s demographic, propensity to spend, and their job title. Customer support specialist might care about other things regarding a *customer*, such as what problem they have, or how long they've been a customer. So, the meaning of the model depends on the context it's in.

Having a single model that represents a customer for the sake of keeping it "DRY" could mean that we loose the opportunity to have richer domain models. 

Keeping architecture DRY in microservices often means:

* We have more shared services in the system
* We create more network latency within the system
* We introduce more risk of escalating failure. If one of those shared services go down, it could bring down the entire system
* If we build a shared library instead of a service, we couple the deployment. A change to the library could mean many service deployments .
* If we take it too far, we start building a distributed monolith. We probably deploy all the services together because it's hard to make a change that doesn't touch multiple services.

Keeping things DRY within a bounded context is great. Less code to maintain, easier to maintain, and there will be less technical debt. Keeping things DRY across bounded context could have dangerous side effects.
