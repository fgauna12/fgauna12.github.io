---
layout: post
title: Get rid of that UAT environment
tags:
  - devops
date: 2020-01-16T04:10:28.996Z
featured: false
hidden: false
comments: false
---
The infamous User Acceptance Testing (UAT) environment. Enterprises love it. The theory is DEV environments help developers catch integration issues, QA environments help catch quality issues, and UAT environments help catch usability issues. Business stakeholders are meant to review newly shipped features that they've asked for. They ask themselves: Is this how a feature is meant to work? Does this help my people can do their jobs? Is this even what I asked for?

<!--more-->

In my experience, the reality is that <mark>development teams can't get meaningful feedback from business stakeholders consistently</mark>. Development teams become frustrated because business users don't validate in a timely fashion and features **pile up**. It dramatically reduces the *lead time* before a feature makes its way to production. 

Also, there another big flaw. Even if business users had the best intention of validating new features, they are using *test data*. Test data is often times not real-world. It is test data after all. The best feedback is real-world usage in which someone is trying to do something *without pretending*.

So what do you do instead?

You could get rid of it, that could be fine depending on your business. Is the risk is worth lower lead times, cost savings, and increased productivity? Maybe. But, at some point you might start to use your DEV/QA environment for the same purpose. 

What if... you were able to get real-world feedback without risking releasing half-baked features? What if there was a way to release only to a *subset* of users in production, say a small percentage of users. What if... once this small subset of users *liked* the new feature, you could start making this feature available to more users.

The answer is feature flags. With feature flags, you can start to decouple the deployment of new code with the *releasing* of new code. Just because we deploy code, we don't have to make it available to everyone just *yet*. 

In the end, that's the whole point of a UAT environment right? To get feedback. With feature flags you'd be able to do just that, get targeted feedback from real-world usage because they'd be test-driving in production.
