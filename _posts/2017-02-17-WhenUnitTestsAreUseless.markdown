---
layout: post
title:  "When Unit Tests are a Waste of Time"
date: 2017-02-19
categories: ide
tags: unit-testing
comments: true
---

Ever wonder if the tests you're writing will pay off? Ever wonder if they'll catch any regressions? Sometimes, they don't. It's not because TDD doesn't work. It's not because you're bad at writing tests. 
When your requirements are just assumptions, your tests are a waste of time.

## My worst fear: Wasting time

![Testing Pyramid]({{site.baseurl}}/assets/TestingPyramid.png#right) 

When I'm putting extra time towards unit tests, my worst fear is it will be wasted work. **_poof!_** 30-50 tests on a feature... **gone**. Why? Because the feature is not wanted or needed. 
So why keep the feature? Why keep the tests? It's just more code to maintain.
While you might not agree that the tests are gone, we can agree that the tests will not prevent defects for features meaningful to the users.
Therefore, if we don't catch these meaningful defects, then the tests are just pretty green check-marks.

## The Testing Pyramid

The premise of the testing pyramid is to show which tests pay the most dividends when finding regressions. Being at the bottom of the pyramid, unit tests are foundational. Every developer knows that unit tests are their responsibility. 
It's not something that can be tasked to QA.

Integration tests are not as cookie-cut. These test are often misleading, brittle, and complicated. Personally, when an integration test breaks, it doesn't really mean that functionality broke. 

We kid ourselves when someone pitches us the benefit of coded UI tests. No they're not useless. They just **break** so easily. It cultivates ideas that change is bad, because it will break the tests and delay delivery. 
These tests are better spent on business critical user workflows.

Overall, the pyramid quantifies how much time we should dedicate to each type of test in our test suite. 
If you have more integration tests than unit tests, then you won't get immediate feedback on regressions or you'll be distracted by red herring issues. 
If you have more UI tests than integration tests, then regressions will be found later in the process.

## Is your pyramid stable?

![Testing Pyramid]({{site.baseurl}}/assets/TestingPyramidWithCustomerValue.png#right)

Even if you had only unit tests as part of your test suite, you are capable of finding a sizable portion of regressions. 

### 1. Volatile Requirements

Indecisive customers. _Grrrr!!_ It's like building your testing pyramid on quick sand!
Although, it can be frustrating, everyone changes their mind and as part of the [Agile Manifesto](http://agilemanifesto.org/) we have to **respond to change**.

In other cases, people don't know what they want until they see it. Or, they're used to dealing with a quirky system so they ask for an identical feature.
So if multiple weeks are spent of trying to satisfy requirements that were assumed to be requested due to need, their accompanying tests will be wasted work.

### 2. Testing Units that Violate YAGNI

As developers, we're amazing at solving phantom problems. We learn about a new fancy framework and we try to find ways to bring it into the application. 
We continuously over abstract, over optimize, and we over complicate. Myself included!

One great way to do a litmus test is the _You Ain't Gonna Need It_ (YAGNI) principle. Borrowed from [Extreme Programming](https://en.wikipedia.org/wiki/Extreme_programming), it tells us to *not work on features not needed today.*
For instance:

- Don't over abstract your database so that you can switch from different database engines. Why? **Because you ain't gonna need it**
- Don't start caching queries from your app because you hope you will have thousands of users. Why? **Because you ain't gonna need it** 
- Don't build a dynamic business rule engine because you think your customer will change their minds too often. Why? **Because you ain't gonna need it**

What does it have to do with unit tests? Because if you build unit tests on top of features that **you ain't gonna need** then you don't really need the tests themselves.
You're just accruing more and more useless code that you will have to maintain.

By the way, [Extreme Programming](https://en.wikipedia.org/wiki/Extreme_programming) is another form of Agile. Although, it's not very popular it's worth getting familiar with so you can apply some of its concepts 
in your everyday tasks.

## Some Solutions

There's no single strategy that will guarantee every feature being highly valuable to your users. It's a holistic process.  
The key is to validate the requirements and weed out the assumptions. Anyone in the team can do this, including you.
Here's some things that you can try:

1. **Talk to the Customer!** - Yes! Sharpen those soft skills. 
    Fifteen-minutes with your users will give you a much greater perspective of what they do. Especially if you're part of a team without a project manager or business analyst. 
    Again, the [Agile Manifesto](http://agilemanifesto.org/) encourages customer collaboration over negotiations
2. **Hallway Usability Tests** - This is a cheap tool to see if your creation is intuitive. If your company is small, pull someone from the hallway ask them what they think. 
    If you're a one-man band, go to a coffee shop and buy someone coffee. If you're part of a larger organization and you have a bigger user-base, consider talking to your team about hosting some more [formal hallway usability tests](https://www.digitalgov.gov/2014/02/19/10-tips-for-better-hallway-usability-testing/). 
3. **Make a POC** - If you're a building the front-end of a web app, consider spending a day or two putting together a mock-up using [Invisionapp](https://www.invisionapp.com/) or an online code editor like [Plnkr](http://plnkr.co/).
    Cloud prototypes are easy to share. Just a matter of sharing a link with your stakeholders and asking for feedback. When I build SPAs, I love using online code editors since most of code can be recycled for production with enough practice.
    If you're building a back-end feature, philosophies like [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) or [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) guide you to build a testable language that you can share with your domain experts. 
4. **Release Early and often** - If you are part of an Agile team that releases software once every couple of months, then you're doing Agile within Waterfall. 
    This is one the biggest tools when combating indecisive customers. 
5. **Think Holistically!** - Bottom line is that if you're building on top of un-validated requirements, your test suite will be in jeopardy. Therefore, think holistically about the development process. Don't be a cog in the wheel.
    If you identify a culprit, step up and propose a POC or shadow some users. Be creative, and be willing to experiment. 




