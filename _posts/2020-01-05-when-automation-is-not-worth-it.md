---
layout: post
title: When automation is not worth it
tags:
  - devops
date: 2020-01-05T03:17:41.669Z
featured: false
hidden: false
comments: false
---
Have you felt excited about the possibilities and *coolness* of solving a problem through automation? I have. I also use that moment as a checkpoint to ask myself:

<!--more-->

> Should I really be doing this? 

Sometimes, when we have a hammer, everything is a nail.

Are trying to create a framework around zero-downtime deployments?

Are you trying to create a manifest so that you can abstract different Infrastructure as Code languages? 

Are you trying to create libraries for how to deploy certain services on Azure? Like App Services, Function Apps, or other PaaS services?

Are you trying to generalize your runtime so that your application just works on either Linux or Windows hosts?

Are you creating an application to streamline the approval processes in your organizations so that approves only have to hit a button?

Are you trying to create a tool to help you with database deployments?

Those are all cool problems to solve and probably important ones too. Slow down and think twice about how you're solving it. Don't recreate the wheel, i.e., Docker, Kubernetes, load testing tools, Terraform, Azure DevOps, and so on.

I have done it. I've created an event-based monitoring solution so learn about errors as they happen. I knew how to use pub/sub, create apps using Angular, and use how to write APIs. So, I created an admin/troubleshooting tool showing events in the system. It took a lot more work to make it reliable. I just didn't *know about* APM tools back then. 

<mark>Pay attention to what's out there</mark>. To what's being released. Be part of a community. Ask questions. When the moment comes, you'll be in a much better place to solve it differently.
