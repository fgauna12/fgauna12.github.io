---
layout: post
title: Wip the silent killer
tags:
  - devops
date: 2020-01-28T03:43:00.190Z
featured: false
hidden: false
comments: false
---
An excerpt from <cite>The Pheonix Project</cite> about WIP (Work in Progress): 

“Look down there,” he says. “You can see loading docks on each side of the building. Raw materials are brought in on this side, and the finished goods leave out the other. Orders come off that printer down there. If you stand here long enough, you can actually see all the wip, that’s ‘work in process’ or ‘inventory’ for plant newbies, make its way toward the other side of the plant floor, where it’s shipped to customers as finished goods.” “For decades at this plant,” he continues, “there were piles of inventory everywhere. In many places, it was piled as high as you could stack them using those big forklifts over there. On some days, you couldn’t even see the other side of the building. In hindsight, we now know that wip is one of the root causes for chronic due-date problems, quality issues, and expediters having to rejuggle priorities every day. It’s amazing that this business didn’t go under as a result.”

Then shortly after, Erik mentions:

> wip is the silent killer

Think about it. In traditional SDLC with *many* developers working on one product, there's a lot of WIP. Developers are constantly churning out new features or bug fixes. This work ought to be tested by QA and there's often times WIP that piles up waiting to be tested. Developers usually don't wait for their changes to be tested and they move on to other things to stay busy. By the time QA is finished testing a set of changes, they might have found defects, at which point the developer is working on something else - creating more WIP for developers.  By this point, the development team need complicated branching strategies to manage all of these open changes so that they can fix hotfixes, issues from QA, and continue developing new features without blocking each other. By this point, they might resort to [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) to manage all this work. Releases get bigger, testing cycles get longer, there's no time for improvements to other non-functional requirements because of the deadline looming. The cycle goes on.

Deploying early and often to production is *wip management*. By deploying often, we're increasing the flow and limiting wip with the great side-effect of getting ride of some problems. When we deploy often, we can afford very simple branching strategies and work management. 

There's also less waste. Have you ever tried to fix a bug for code that you wrote a couple of months ago and you don't remember the decisions you made? What about fixing a bug for code you wrote yesterday? Wasn't it much more fresh in your mind? Did you waste less time?
