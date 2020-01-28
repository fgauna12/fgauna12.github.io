---
layout: post
title: Managing wip through process
tags:
  - devops
date: 2020-01-28T22:23:10.299Z
featured: false
hidden: false
comments: false
---
There's a [great book](https://www.infoq.com/minibooks/kanban-scrum-minibook/) comparing Scrum and Kanban flavors of Agile software development. Scrum is more prescriptive than Kanban and it's probably more widely adapted by software teams. Kanban is much more lenient. Both are ways to manage wip through process. 

<!--more--> 

Here are the similarities, according to the book (<cite>Kanban and Scrum: Making the Best of Both</cite>: 

* Both are Lean and Agile
* Both use pull scheduling
* Both limit wip
* Both use transparency to drive process improvement
* Both focus on delivering releasable software early and often
* Both are based on self-organizing teams
* Both require breaking work into pieces
* In both, the release plan is continuously optimized based on empirical data (velociy/lead time).

**But**, they reach manage wip differently. In Scrum, wip is managed indirectly by only committing to work during a *sprint* (2-4 weeks) based on previous team performance (velocity). Once the sprint starts, teams cannot add more work to the sprint. Therefore, they can only commit to so much and therefore an implied limit on wip based on the sprint length. 

In Kanban, wip is managed directly because it's limited to a workflow state.

{% include image-caption.html imageurl="/assets/uploads/backlog_kanban.png" title="An example kanban board - Credits to Henrik Kniberg & Mattias Skarin" caption="The numbers 2 and 3 are the wip limits for the corresponding columns. The wip for the 'develop' state is shared between OnGoing and Done" %}


There's a lot to be learned from Kanban. Kanban is talked about in length in [The Pheonix Project](https://www.amazon.com/dp/B078Y98RG8/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1). Many teams could use some Kanban practices to help improve flow and value delivery. For example, it's easy to apply [wip limits using Azure boards](https://docs.microsoft.com/en-us/azure/devops/boards/boards/wip-limits?view=azure-devops).
