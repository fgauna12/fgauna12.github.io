---
layout: post
title: Approvals in unified pipelines (yaml)
tags:
  - devops
date: 2019-12-31T14:52:27.260Z
featured: false
hidden: false
comments: false
---
As Microsoft has been re-creating their pipeline experience though *unified YAML-based pipelines*, there has been gaps in terms of feature parity when compared to the traditional approach. One example of the lack of parity for a time was **manual approvals**. As of September 2019, the team added the ability to have individuals or a group be able to approve a deployment to a stage. On the other hand, the traditional build and release management solution has had this feature for quite some time. So, if you're starting to adopt YAML-based pipelines, how do you configure manual approvals?

<!--more-->

## The new and weird way

As the Azure DevOps team starts to include more and more integration with Kubernetes, they also defined a new concept - **environments**. From the pipeline, you can run a set of tasks against an environment and in many cases this maps to a Kubernetes cluster. As of today, they only have the ability to set public clusters as environments and eventually they will add different types of environments. 

So, in September 2019, they added manual approval support by allowing you to configure an approver for the environment. [See more here.](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/approvals?view=azure-devops&tabs=check-pass)

## The new and hidden way

Recently, I noticed a new feature. Being able to associate approvers to a *service connection*. 

From an Azure Resource Manager service connection, there's an ellipsis and a button for "Approvals and Checks"

![](/assets/uploads/project-settings-azure-devops.jpg "Project Settings")

![](/assets/uploads/service_connections.png "Service Connections")

![](/assets/uploads/service_connection_ellipsis.png "Service connection ellipsis")

![](/assets/uploads/service_connection_approvals_and_checks.png "Approvals and checks")

![](/assets/uploads/service_connection_approver.png "Approvals at the service connection")

Tada! Now every time the particular service connection is being used, it will request an approval.

![](/assets/uploads/pipeline_approval.png "Approving a deployment")
