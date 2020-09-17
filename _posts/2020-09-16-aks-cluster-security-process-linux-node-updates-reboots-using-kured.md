---
layout: post
title: "AKS Cluster Security: Process Linux node updates/reboots using Kured"
tags:
  - azure
  - kubernetes
date: 2020-09-17T11:24:00.000Z
featured: true
hidden: true
featured_image_thumbnail: /assets/uploads/bernard-hermant-ihcshrzxfs4-unsplash.jpg
featured_image: /assets/uploads/bernard-hermant-ihcshrzxfs4-unsplash.jpg
comments: false
---
Microsoft does download and install security patches automatically and transparently on AKS worker nodes. But, by design it's your responsibility to restart them. Once you do so, these patches will take effect. So it's really important that you do so to keep clusters up-date. It's considered [best-practice](https://docs.microsoft.com/en-us/azure/aks/operator-best-practices-cluster-security#process-linux-node-updates-and-reboots-using-kured).

<!--more-->

There's a project called Kured. It's a daemonset that restarts nodes when it detects new updates. It can integrate with tools like Slack to notify you when a restart happens. You are also able to specify a schedule on when a restart is allowed. 

## Installing Kured through Helm

There's a couple of ways to install [Kured](https://github.com/weaveworks/kured). My preferred way is through a [Helm chart](https://github.com/weaveworks/kured/tree/master/charts/kured). 

```
helm repo add kured https://weaveworks.github.io/kured
helm install my-release kured/kured
```

But, realistically you're going to want to customize it by setting a schedule, alerts, or notifications.

## Setting a schedule

You can configure Kured to only restart through certain windows. Useful to avoid downtime during peak hours.

```
  /usr/bin/kured \
  --reboot-days mon,tue,wed,thu,fri \
  --start-time 5pm \
  --end-time 12am \
  --time-zone America/New_York
```

Through a Helm chart, this becomes:

```
helm install kured kured/kured -n [some namespace for kured]\
--set configuration.rebootDays="{mon,tue,wed,thu,fri}" \
--set configuration.startTime=5pm \
--set configuration.endTime=11:59pm \
--set configuration.timeZone=America/New_York
```

## Setting up Slack notifications

A good use of the Slack username is the name of the environment. In this example, I use `staging`. By the way, here's some instructions on how to set-up [Slack webhooks](https://api.slack.com/messaging/webhooks). Unfortunately, there's no integration with Microsoft Teams.

```
helm install kured kured/kured -n [some namespace for kured]\
--set configuration.slackChannel=environments \
--set configuration.slackHookUrl=https://hooks.slack.com/services/blahblah \
--set configuration.slackUsername=staging
```

## Testing Kured

To test on AKS, you're going to want to follow [these instructions](https://docs.microsoft.com/en-us/azure/aks/ssh) to <mark>SSH into a worker node</mark>.

You'll have to create a file on the node to indicate to Kured to restart the node. By default, daemon sets check for restarts once an hour. But, each pod on the daemon set offsets from the start time, so *you won't necessarily see all restarts close one after another*.

```
sudo touch /var/run/reboot-required
```

![Kured slack notifications example](/assets/uploads/kured-slack-notifications.png "Kured slack notifications example")

## Kured + GitOps (Flux)

When using GitOps, the Kubernetes cluster pulls deployments from a Git repository. The Git repository is the source of truth. Therefore, you can declaratively define what Helm charts should be installed in your cluster by committing a file like this one to your manifests repo:

```
apiVersion: helm.fluxcd.io/v1
kind: HelmRelease
metadata:
  name: kured
  namespace: kured
spec:
  releaseName: kured
  chart:
    repository: https://weaveworks.github.io/kured
    name: kured
    version: 2.2.0
  valuesFrom:
  - secretKeyRef:
      name: slack-secrets
      namespace: kured
      key: values.yaml
      optional: false
```

In addition, you can use [sealed secrets](https://github.com/bitnami-labs/sealed-secrets) to also define information you don't necessarily want committed to source control. Then, you can reference this secrets from Flux's `HelmRelease` resource through a `secretKeyRef`.

## What about alerting?

In a future posts, I'll explore how to integrate Kured with Prometheus.