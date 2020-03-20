---
layout: post
title: The balance between pipeline speed and too much automation
tags:
  - devops
date: 2020-03-20T01:46:18.011Z
featured: false
hidden: false
comments: false
---
Recently, I have been suffering from incredibly slow pipelines and slow feedback loops. When a change to be deployed to a test environment, it would have to be approved from a pull request, then pass a validation build, merged to the master, and then deployed through a CI/CD pipeline. The problem? The whole process takes anywhere from 30-45 minutes. It feels incredibly unproductive.

<!--more-->

When any new task is added to the pipeline, it adds to the overall execution time. With the accumulation of tasks, build times can get out of hand. It's significant because the slower the feedback loop is, then the more people will try to "batch" changes in order to feel more productive. It's understandable. Sitting around waiting for a build to finish, does not feel productive. 

But it's also about technology choices. [Terraform is faster than ARM templates](https://gaunacode.com/is-terraform-faster-than-arm). When ARM templates take 15 minutes to run on each deploy to a test environment, it's going to slow down development. It's also going to increase the lead time. Lead time is the time between commit and when it makes it to production.

So yes. There is an Azure DevOps task for WhiteSource Bolt to find open source vulnerabilities on code. But do you really need to run WhiteSource scans on _each_ pull request? Could they be nightly instead?

Yes, you can create ARM templates for just about everything. ARM templates are slower than other solutions like Terraform. So, is it worth creating _all_ the infrastructure from an application deployment? Is Terraform a better fit?