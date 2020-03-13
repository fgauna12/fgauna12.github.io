---
layout: post
title: The problem with big bang releases
tags:
  - culture
date: 2020-03-13T00:35:48.135Z
featured: false
hidden: false
comments: false
---
Big Bang releases are when teams work several months on a project with the intention of pushing it live in one big event. These types of releases usually never go well. It is because there's so much Work In Progress (WIP) that it inevitably creates an influx of unplanned work. Engineers have a trouble estimating how much it's going to take to bring everything together. It's almost unplannable. Emotions run high, rash decisions are made, and blame goes around. Ultimately, things usually never work out as you'd expect. 

Even if you happen to make it to production on a timely manner, live data and real usage can be unforgiving. 

<!--more-->

There's another problem too. In order, to avoid the huge amounts of unplanned work, you have to release to production early. That means, postponing large feature development in lieu of putting *something* in production. Call it whatever you want. You can call it Minimum Viable Feature, Minimum Viable Product, or just Walking Skeleton. Once you have something live in production, with a CI/CD pipeline, you can iterate, *all the way* to production. It's no longer a big event. 

But the problem with this initial investment is that <mark>it has to have buy-in</mark> from the top. If there's no buy-in from leadership teams, then will be no patience for postponing the feature development. Without the patience, team members will likely be interrupted from the mail goal. Leadership will go inpatient and will start making decisions for the boots on the ground. It's best that the boots on the ground make the technical decisions.