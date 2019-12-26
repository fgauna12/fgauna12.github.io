---
layout: post
title: DRY and CI/CD
tags:
  - devops
date: 2019-12-26T03:14:42.135Z
featured: false
hidden: false
comments: false
---
DRY is the well known best-practice of not duplicating code so that code can be more maintainable and readable. Is this concept applicable to CI/CD?

<!--more--> 

On first look, many applications have similar steps when they get built and deployed.  At an organization level, one might even use the same stack to build different applications. It often seems reasonable to think we could have a *centralized* set of build and deployment tasks that we could apply to all the applications in an organization. For example, in many cases, we build the source code, we run some tests, we then publish the artifacts, and maybe tag the Git repository with a build number. 

> Why not centralize these steps so that we don't keep repeating ourselves per each application?

It sounds easier to maintain a centralized set of tasks than to maintain several pipelines. But, at a closer look, it is likely that each application has their own value stream. Each application could hold a different priority for the company, a different service level objective, a different infrastructure budget. For instance, it might completely acceptable if a particular application was down during a deployment. So, a major change to the centralized set of tasks, could mean serious implications of the productivity of the entire organization - especially if it pushed capabilities that were not needed like zero-downtime deployments. 

In my experience, I find it most useful to abstract **mundane deployment tasks** that might as well be part of the platform. To *make something easier* so to speak. In contrast, I often find it ineffective to abstract high-level tasks just because deployment processes are similar. 

If I find myself re-using scripts to do something between project to project that is irrelevant of the deployment process, maybe it's worth encapsulating. For example, in a previous post, I showed how there's an alternate way to [parse ARM template outputs into Azure DevOps variables using Powershell](https://gaunacode.com/deploying-arm-templates-from-azure-devops) and _if_ I used this more often, it would be a great candidate for an Azure DevOps marketplace task.

I have experienced the results of having too much shared pipeline code and the complexity of maintaining it. It comes down to two key points. First, if you truly want to centralize, then you have to make a choice to risk breaking downstream pipelines when there's breaking changes. Meaning, are you willing to risk delivery teams being unable to push changes because there's a breaking change in a shared pipeline? Or, if you don't want to risk breaking changes, are you willing to live with the complexity around sharing pipeline code through *versioning?* 

In many cases, I find that encapsulating code and keeping it DRY for CI/CD pipelines is not worth the effort. Instead, I lean towards using technology that democratizes deployments so that each application doesn't feel like a special snowflake in CI/CD. Namely, I lean towards using containers and Kubernetes to keep my CI/CD pipelines more DRY.
