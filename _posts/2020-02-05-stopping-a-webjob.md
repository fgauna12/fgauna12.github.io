---
layout: post
title: Stopping a webjob
tags:
  - azure
date: 2020-02-05T23:24:39.553Z
featured: false
hidden: false
comments: false
---
Turns out that just stopping an app service with web jobs in it, doesn't actually stop them. Counter intuitive _right_?

<!--more-->

Instead, one way to turn off the webjobs completely is by adding an app setting to the app service called `WEBJOBS_STOPPED` and setting it to **1**. 

You can read the wiki under the [project kudu repo](https://github.com/projectkudu/kudu/wiki/WebJobs).

After some thought, in an odd way it makes sense. Webjobs were designed to co-exist with websites living in the same app service. So, if someone stopped a website, it could keep the web job running... I guess.

Thankfully, webjobs will be irrelevant someday. They're pretty close to being so.
