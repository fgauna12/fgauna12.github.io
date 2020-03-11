---
layout: post
title: Installing Flagger using Azure DevOps
tags:
  - devops
  - kubernetes
date: 2020-03-11T01:09:05.840Z
featured: false
hidden: false
comments: false
---
Similar to a [previous post](https://gaunacode.com/installing-linkerd-using-azure-devops), this is a small guide on how to create some glue code to ensure Flagger is installed on a Kubernetes cluster.

Flagger is a delivery tool that integrates with service meshes like Linkerd to enable progressive rollouts using techniques like canaries, A/B testing, and Blue/Green deployments. It also integrates with chat apps like Slack and Teams.

<!--more-->

## Pre-Requisites

* A YAML pipeline using the `ubuntu-latest` pool
* A pipeline that can issue kubectl commands. [This post](https://gaunacode.com/installing-fluxcd-using-azure-devops-and-helm-on-aks) has some clues on how to connect to an AKS cluster using the Azure CLI.
* A service mesh installed on the cluster. Linkerd or Istio

## Installing Flagger

First, ensure that Helm 3 is installed on the agent running the pipeline.

```yaml
- task: HelmInstaller@1
  inputs:
    helmVersionToInstall: 'latest'
```

Then, we can proceed to using Helm 3 to install flagger on the cluster. Again, this assumes that your agent can issue `kubectl` commands against the cluster. 

To install flagger, we'll just use the `bash` task.

```yaml
- bash: |
    set -e

    echo "installing flagger"

    helm repo add flagger https://flagger.app

    kubectl apply -f https://raw.githubusercontent.com/weaveworks/flagger/master/artifacts/flagger/crd.yaml

    helm upgrade -i flagger flagger/flagger \
      --namespace=linkerd \
      --set crd.create=false \
      --set meshProvider=linkerd \
      --set metricsServer=http://linkerd-prometheus:9090
  continueOnError: false
  displayName: "Installing Flagger"
```

The first line, set -e, will ensure that the pipeline fails when there’s an error in the bash script.

Notice how we specify the **linkerd** service mesh.

If you were using Istio, it would look like this instead.

```yaml
- bash: |
    set -e

    echo "installing flagger"

    helm repo add flagger https://flagger.app

    kubectl apply -f https://raw.githubusercontent.com/weaveworks/flagger/master/artifacts/flagger/crd.yaml

    helm upgrade -i flagger flagger/flagger \
    --namespace=istio-system \
    --set crd.create=false \
    --set meshProvider=istio \
    --set metricsServer=http://prometheus:9090
  continueOnError: false
  displayName: "Installing Flagger"
```

Then the installation process closely follows what's recommended by the [flagger documentation](https://docs.flagger.app/install/flagger-install-on-kubernetes). 

First, we add a helm repo so that we can use the flagger chart. 
Next, we install the CRDs for flagger. 
Lastly, we install the flagger helm chart with various variables depending on your service mesh of choice.