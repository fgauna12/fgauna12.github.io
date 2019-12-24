---
layout: post
title: Performance pays
tags:
  - architecture
date: 2019-12-15T20:52:21.034Z
featured: false
hidden: false
comments: false
---
Many managers and leaders don't often realize that it pays to work on performance - _especially_ on the cloud. The cloud is a world where you pay for what you use. Why wouldn't you want to use less resources so that you pay far less? 

I get it. Sometimes, we get stuck with what we know how to do well and we fail to be creative. To reduce costs, we shrink timelines because it means less human resources working on the problem. Just get it "done". Use the good old framework, don't bother upgrading to the new stack, and upgrade when we're about to lose support.

Funny story. Last week, I made a mistake and I over provisioned a stress test. To my surprise after the test ran, the cluster did not crumble. I was shocked. We originally thought we under provisioned the cluster. .NET Core 3.0 was really _that fast_ compared .NET Framework. 

The kicker to it all is that this was not on the cloud. It was on-prem. This new architecture is now able to handle 266% more load and it's only has 13% the resources of the original monolith. Yeah, no one will be losing sleep anytime soon. 

Imagine slashing your cloud bill because your code is so efficient. Performance is an asset and it pays.
