---
layout: post
title: Automated Upgrades using Flux
tags:
  - devops
  - azure
  - kubernetes
date: 2020-03-10T01:49:51.832Z
featured: false
hidden: false
comments: false
---
GitOps allows us describe our running environment from a Git repo. We are able to state the deployments and the Helm charts that should be part of a Kubernetes cluster. As such, we can specify the version of these deployments and charts. But, throughout development, it would be cumbersome to continue to increment image tags described in a git repository to force the deploy to a non-production environment. Automated upgrades help with this. 

<!--more-->

## Pre-Requisites

* Flux installed on the cluster
* Helm operator installed on the cluster (optional)
  * If you're using Azure Container Register to store helm charts, see [here](https://gaunacode.com/configuring-flux-to-use-helm-charts-from-azure-container-registry)

When you install Flux, ensure you have added the public key for Flux as a *deploy key* to the Git repo so that the Flux operator can write and commit.

Also, if you're using Azure Container Registry, ensure you have installed Flux with `registry.acr.enabled=true` option. This is necessary so that Flux can authenticate against Azure Container Registry and get the list of tags for a container image. Role of `AcrPull` should be enough.

``` bash
helm upgrade -i flux fluxcd/flux \
        --set git.url=[some repo url] \
        --set registry.acr.enabled=true \
        --namespace flux \
        --wait
```

## Automated upgrades

You can enable automated image tag updates by annotating Helm release objects and Kubernetes deployments.

```yaml
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: realworld-backend
  namespace: realworld
  annotations:
    fluxcd.io/automated: "true"
    fluxcd.io/tag.chart-image: glob:stg-*
spec:
  releaseName: realworld-backend
  chart:
    repository: https://realworld.azurecr.io/helm/v1/repo/
    name: realworld-backend
    version: 0.1.1
  values:
    image:
      repository: realworld.azurecr.io/backend/realworld-backend
      tag: stg-6df42957762c89cda02a2ada2c32ea2810e070f4
```

Here, any new tags pushed to the container registry will be picked up by Flux and commit an update back to the repository. But, the tag has to follow the *glob* pattern of starting with `stg-`. 

![](/assets/uploads/flux_release.png "Flux operator committing back")

There are other types of pattern matching like semver, and regex. 

There's a repo called [helm-operator-get-started](https://github.com/fluxcd/helm-operator-get-started) that shows how to use each of the patterns.