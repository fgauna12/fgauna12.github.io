---
layout: post
title: A DevSecOps Process
tags:
  - devops
date: 2019-12-09T16:58:39.873Z
featured: false
hidden: false
comments: false
---
Security is often times one of the last activities before releasing a system to production. In my experience, some companies perform _security reviews_ and once it's approved, consider it "approved" for the remainder of the project. In other words, no checkpoints afterwards.

What if security was part of the process? Instead of waiting towards the end, we shift lift security and do it often. We build security into the app and into the app building process. We make it a first class citizen.

<!--more-->

## An DevSecOps Pipeline

Here's what it could look like when using containers. 

On pull-requests/code reviews,

* Perform credential scanning to ensure no developer committed passwords.
* Scan dependencies using something like WhiteSource Bolt to ensure that the open source components used don't have major vulnerabilities
* Perform a static code analysis check using Sonar Cloud to find code smells. 
* Ensure that if any of these checks are failing, the developer takes action. For example, create a ticket (e.g. work item) so that a developer knows to come back to it and address it. Another option, is to create comments to the pull request so that the developer has to resolve them before moving forward.  

During the main pipeline, build a container image and _before_ we push it to the container registry of choice,

* Run a penetration test using OWASP's ZAP tool. OWASP is a foundation dedicated to improving application security. They create this free open source tool to help highlighting security vulnerabilities. For this to work, the application has to spin up temporarily from the pipeline using containers.
* Run a container image scan using a platform like Aqua. Base container images could also have zero-day vulnerabilities. 

Lastly, after the application is deployed and in production, what happens when the application is compromised?

Incidents could happen and it's important to be ready for them. 

Create secret rotation runbooks so that in the event of an exploit, engineers can regenerate secrets. This concept can be applied for sensitive information like Azure service principals, certificate rotation, and database connection strings.



I hope you see that there's efficient ways to increase security. Processes where you have to request approval to use an open source library are **archaic** and vulnerable. Shift left security.
