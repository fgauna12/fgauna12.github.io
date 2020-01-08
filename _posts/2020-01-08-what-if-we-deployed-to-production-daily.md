---
layout: post
title: What if we deployed to production daily
tags:
  - devops
date: 2020-01-08T00:46:00.462Z
featured: false
hidden: false
comments: false
---
Deploying to production quickly used to mean that some developer would have access to the production servers and deploy straight from their computer. Often, this was associated with the "cowboy" way of doing things. So, understandably, some companies created and hardened process so to increase stability and visibility in what was being deployed. Nowadays, it's common to hear of companies taking weeks or months to validate & test code changes to ensure it will work in production.

But, what if you had a goal of each developer deploying to production daily? **Without sacrificing on stability?** Is it possible?

<!--more-->

For starters, we could add a CI/CD pipeline and make it hard or impossible for developers to push straight to production. This would encourage all code to be committed to source control before making it to production. It would also be done the same way each time *any* developer wanted to deploy. Pipelines could be fairly quick and probably deploying to production within a couple of minutes. 

Great. But what if there's a bug introduced? 

Well, each commit would most likely be associated with the version deployed, so it would be easy to see which commit introduced the bug. Also, we could leverage APM tools to help us *quickly* troubleshoot any issues and alert us where there's elevated error rates. Most importantly, because our pipeline is fairly quick to deploy changes, it could mean a few minutes before we fix the issue or we deploy an older version of the application. 

But what if this happens often? Our users would get pissed. 

Yes, so maybe we should fail faster and have unit tests that run quickly so that we have a higher degree of confidence that we're not introducing regressions. We could also run these tests from a pull request so that we gain quicker feedback before deploying anywhere. We could even gather code coverage analysis to see the weak areas in the system so that we can continue to harden the weak areas.

Will unit tests catch everything? 

No probably not. Sometimes, there's issues when integrating modules together, or there's a feature gaps, or there's usability problems. So we could leverage some integration tests to verify that key modules are working together and we could leverage more functional tests to ensure that end-end the system is working as expected. 

What about identifying issues in experience? 

Well, just because we *deploy* something, it doesn't mean that we have to *release* it. When features are first being developed and the user interface is still being worked out, we can leverage feature flags. [Feature flag platforms](https://launchdarkly.com/) allow us to define code blocks that will only execute when a flag is enabled. With many of these platforms, we can conditionally enable these code blocks for only certain users under certain circumstances. If that's the case, we could define feature flags that target internal employees to show these features being developed so that we can continue **deploying daily**. Obviously, if our internal users are able to use the feature in production, we could test the user experience. Laster, as we gain confidence we can enable these features to a greater audience. 

What about database changes? Those are scary. 

Yes, they can be. There are [database DevOps tools](https://www.red-gate.com/solutions/overview) and strategies we could adopt like ensuring that all SQL is committed to source control and also borrow CI/CD concepts. We could also leverage strategies like [canary deployments](https://martinfowler.com/bliki/CanaryRelease.html) so that a change is only deployed to a subset of the infrastructure and validate that the deployment will work.

Okay well, sometimes our teams take days or weeks to develop a new feature. We wouldn't be able to deploy daily if we wanted to.

Understood. If we had an artificial goal of deploying daily, we would want to ensure that whatever we create that day can be deployed _that same day_. This would mean smaller pull requests. We know that smaller pull requests means less "review fatigue" because there's less changes for a reviewer to comb through and thus more meaningful comments. Also, just because we deploy it doesn't mean that we have to make it available for users. So, even if it takes "week" to finish a feature, we could deploy safely behind a feature flag until it's ready to be tested.

We could go on for a bit more. The point is that many of these challenges have been solved already. There's a book called [Accelerate](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations-ebook/dp/B07B9F83WM/ref=sr_1_3?crid=1QEKIY43O044M&keywords=accelerate+book&qid=1578446565&sprefix=accelerate%2Caps%2C185&sr=8-3) and a [yearly report](https://services.google.com/fh/files/misc/state-of-devops-2019.pdf) that highlights that elite and high performers in the industry are able to deploy at least once a day to production per developer per day while high degree of stability.
