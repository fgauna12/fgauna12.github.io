---
layout: post
title: Becoming a curious scientist
categories: DevOps Architecture
date: 2019-12-01T13:58:53.512Z
featured: false
hidden: false
comments: false
---
Conventional wisdom tells us that we have to design big and plan for worst case - that's how we prepare for the unexpected. When we release to production, that's the first time our users will see it and _that's ok_. It's ok because we did all the ceremonies, we're using the latest tech (e.g. NoSQL, Kubernetes, .NET Core, etc. etc.), and we even have good test coverage. We followed the book. We're supposed to get an **A** now.

<!--more-->

The reality is that real-life is not like school. Unexpected things happen all the time. 

> So how do we ensure that things won't blow up in production?

You don't. You embrace it. Make it blow up in a controlled fashion. Why? Because there's no replacement for production. Because creating a mirror of production is often extremely difficult/expensive and even if you accomplish it, chances are you won't follow this process often. 

So become a curious scientist. It takes practice and after some time, you'll be really good at experimenting using the [scientific method](https://www.sciencebuddies.org/science-fair-projects/science-fair/steps-of-the-scientific-method).

## A story

We were helping a team move an API to Azure and re-architect along the way. This API has severe technical debt that has accrued for years and no unit tests. The API's main functionality was a query engine that aggregated data from various sources. It was _messy,_ untestable, and bound to break once we touched it.\
We did some research about how this query engine evolved over time. We then constructed a hypothesis. 

We asked a question: _What if it was easier to read and the queries were done in parallel rather than serially?_

**Hypothesis**: If we rewrite it using TDD and we parallelize the queries underneath, it will be a lot more efficient.

So we leaned into the problem. We started to rewrite it on the side. We started adding all the new classes and trying to mimic the query engine using Test Driven Development (TDD). We would make a change, then deploy it to production. 

The key here is that we were learning about how this query engine behaved - incrementally. Although we were rewriting it, we were deploying _dead code._ Meaning, our new query engine was only being called by the unit tests. We were slowly refactoring and deploying often to see if small refactorings were breaking the old query engine. With time, we were understanding and learning more and more about it.

We also added a feature flag so that we could test with real data. Once the new query engine worked like the old one, we started to enable it in production. We used our APM (Application Performance Monitoring) tool to measure the differences. It was on average 70% faster for large queries.

After some months of chipping away at it, we had deployed several changes to production and we had a fully rewritten version that was _fully unit tested._ If our new query engine would have been slower, we would have constructed a new hypothesis. 

## Conventional Wisdom

Conventional wisdom would have had us schedule a _design meeting_. Get everyone involved and go over the old design and review the new one. We would have estimated something not well understood. Then we would have had to pitch it to the business so that we can schedule the work during a sprint. We would have rewrote it and probably blown our estimates. Then when getting close to done, we would have involved QA to ensure there were no regressions. Lastly, we would have scheduled a production deploy and if we wanted to be throughout maybe create a load test to see the performance differences. 

But the reality is - many enhancements don't get past the design meeting. So if you want to succeed and get rid of the technical debt, take ownership. We did this as we performed our regular sprint work. We bought into it **as a team** and we all contributed to this experiment one bit a time. We did it for the betterment of the product and our _craft_.
