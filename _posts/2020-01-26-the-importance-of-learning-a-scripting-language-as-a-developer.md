---
layout: post
title: The importance of learning a scripting language as a developer
tags:
  - devops
date: 2020-01-26T04:03:55.133Z
featured: false
hidden: false
comments: false
---
There was a point in time in my career that I did not know a scripting language. Sometimes, I was using my hammer because everything looked like a nail. When I decided to learn scripting, it was one of the most useful skills I learned. 

<!--more-->

One time, I automated an API driven workflow because I knew how to chain [Postman requests together](https://blog.getpostman.com/2018/03/19/how-to-make-money-using-postman-chaining-requests/) and how to pass data around using environment variables. 

There was another time when I created a NodeJS console application to import data into a system using an API-driven interface also. I am talking about learning a scripting language like Bash, Powershell, or even Python where you can *automate* development workflows, help with experimentation, and create high-level acceptance tests. JavaScript is a browser-based scripting language built for a different purpose than say... PowerShell.

Also, don't get me wrong, you *can* use a compiled language (e.g. C#, Java) to create acceptance tests. I've seen tests that issue HTTP calls to an API and validate the results/behavior. But with compiled languages, the tests are just going to be a lot more *verbose*.

In my case, I learned Powershell because it would be the most useful at work. Many of our clients were using Windows. A course like [this one](https://www.pluralsight.com/courses/everyday-ps) has given me the tools to be creative and effective when the time came. 

Here's a list of various ways Powershell was useful to me:

* [As I mentioned yesterday](https://gaunacode.com/meta-automation), parsing config files to generate more automation
* Creating acceptance tests that run against an API from a CI/CD process
* Creating shortcuts to reduce clicking in my daily workflows
* Creating smoke tests that run periodically against production
* Experiment with public APIs like the Azure DevOps API
* Create dynamic prototype reports using Excel fairly quickly
* Create very tailored and customized deployment processes for weird apps 
* Automating the rollout of an application that involved many steps

In the Linux world, the power of the command line is more apparent. In the Windows world, developers are generally more reliant on the wonderful IDEs like Visual Studio. As the two worlds continue to merge through movements like containerization, Windows Subsystem for Linux, and Kubernetes, it's ever more important that the command line and scripting languages are an essential skill for developers. Clicking is less efficient and not repeatable.

I know it's not as shiny. It will be a useful skill though.
