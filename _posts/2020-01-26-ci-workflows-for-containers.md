---
layout: post
title: CI workflows for containers
tags:
  - devops
date: 2020-01-26T22:11:25.499Z
featured: false
hidden: false
comments: false
---
When dealing with containers, our usual CI/CD processes start to change. Before containers, we used to push artifacts to our deployment locations. With containerization, instead of deploying a *packaged artifact*, we upload a container image to a central registry.

<!--more-->

## The good ol' days

In traditional deployment model of many apps, there was a concept of a *build* and *release* stages as part of a CI/CD pipeline. During the *build*, we built the source code, ran some unit tests, maybe some integration tests, and then published the artifacts to some location. From a *release*, we pulled these packaged artifacts and we pushed them to a deployment location, perhaps a server or perhaps the cloud.

Of course, this process usually happened against `master`. Build once and deploy many times (different environments). So, in order to fail faster and avoid bad code entering `master`, we could also run builds when pull requests were opened. These validation builds could _often_ be the same builds that were triggered upon `master`.

## The container age

With containers, things change significantly. From a deployment location, we kill the old container and we *pull-down* the new version from our container registry. This method of *pulling* changes from the deployment location, means new changes in our pipelines.

First, it's the matter of how to build the Dockerfile. We won't be deploying binaries or source files anymore, we will be instantiating containers that contain our artifacts. So, It's important that Dockerfile are thought out and understood. For example, if you're worried about having fast & lightweight containers, then look at creating multi-stage docker builds.

Once we have working Docker build process, we can start to think about how to design our main pipeline. The main pipeline will trigger from your main branch and build, test, then *publish* the final image to the container registry of choice. Later, you can take a step further and also run integration tests, acceptance tests, and container image scans *before* you publish to a container registry.

What about pull requests?

You'll probably find some friction trying to reuse the same pipeline from your main branch. Why? Because there's no clean way to avoid publishing a container to the registry from your pull-request pipeline. Also, it's a bit more quirky to pull code coverage results from a container that is running the unit tests. In my experience, it's more effective to simply create a separate pipeline that runs on pull-requests.

What's the danger? 

The danger of pushing half-baked images to your container registry is that someone could pull and run the image. There could be a vulnerability or it could be highly unstable. If someone in your team pulls down these images often for testing, they will be much less productive. Lastly, you probably want to use a [hosted container registry](https://azure.microsoft.com/en-us/services/container-registry/) anyway, so the more images you push, the more money it will cost.

## Putting it all together

In the end, if you're open to creating separate pipelines for build and validation, it could look like this:

* Upon pull-requests, run a *validation build* 
* The validation build could do the following: 

  * Build the source code
  * Run unit tests
  * Run integration tests
  * Run code coverage analysis
  * Run static code analysis
  * Run [credscan](https://secdevtools.azurewebsites.net/helpcredscan.html)
* Upon merge to `master`, run the *main pipeline*

  * Build the container which source code and runs unit-tests (using Docker multi-stage docker build)
  * After container is built, tag it
  * Run [container image scan](https://www.aquasec.com/integrations/) on your image
  * Once scan passes, you can run some acceptance tests/integration tests
  * Once acceptance tests pass, you can publish to your container registry
  * Now you can be more confident when pulling down an image for testing or deploying

Hope that helps!
