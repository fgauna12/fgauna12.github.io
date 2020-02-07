---
layout: post
title: Managing feature flags through Terraform Cloud
tags:
  - devops
date: 2020-02-07T04:09:21.202Z
featured: false
hidden: false
comments: false
---
Sometimes, it's fun and useful to branch out. Today, I'm using Terraform to manage and create feature flags in LaunchDarkly. 

<!--more--> 

## Hold on... but why?

Have worked on a project where it was hard to test because it used other SaaS products? Then each developer needs to create and manage their own test accounts? 

The promise of using Terraform besides how well-built and easy it is to use, is the power of creating infrastructure across various providers. With this Launch Darkly provider, developers could get easily on-boarded and each of them could have their own feature flag environment.

Here's a [great blog post](https://launchdarkly.com/blog/managing-feature-flags-with-terraform/) by the Launch Darkly folks talking more about the *why* and some other examples.

## Simple project

If you don't have a Terraform Cloud account, it's easy enough to get one. You don't have to pay anything to get started.

When using Terraform Cloud, you create a workspace and configure a GitHub account to watch.  Terraform Cloud will `plan` the changes from the infrastructure as code and ask for confirmation. Then it will `apply` them. 

For Launch Darkly, we'll just have to set an environment variable so that Terraform can use your account. 

In this sample project, we'll use this [sample repo](https://github.com/fgauna12/HelloTerraformLaunchDarkly) containing a miniature Launch Darkly environment and use Terraform Cloud to provision it. 

### Pre-Requisites

* Fork [this repo](https://github.com/fgauna12/HelloTerraformLaunchDarkly)
* Create a Terraform Cloud account (it's free)
* Create a LaunchDarkly account (they have free trials)

### The Steps

![Terraform Cloud Launch Darkly Create Workspace](/assets/uploads/terraform-cloud-launchdarkly.gif#wide "Terraform Cloud Launch Darkly Create Workspace")

First, create the workspace as show above. 

Select GitHub as the Version Control System. 

Choose the repository you forked from above. 

Then give the workspace a new and create. 

It will take a minute.

### Configuring LaunchDarkly

Next, for Terraform Cloud to be able to talk to Launch Darkly, you ought to create an API key.

Go to your user profile on Launch Darkly. 

Then Authorization and create your own API Token.

![Create Launch Darkly API Token](/assets/uploads/create_launchdarkly_apikey.png "Create Launch Darkly API Token")

Give the API Token a name and choose role of *Admin*. 

Create the API Token. 

Copy the API Token to your clipboard.

### Back to Terraform Cloud

Configure a terraform variable called `launchdarkly_access_token` with the value from the API Token. 
Feel free to mark it as *Sensitive*.

![](/assets/uploads/ld_secret.png "Terraform Cloud Variable")

Lastly, go to *Settings* then *General*. 

![](/assets/uploads/ld_terraform_settings.png "Terraform Cloud General Settings")

Set the Terraform working directory to `iac`.

![](/assets/uploads/ld_working_directory.png "Set working directory")

### Give it a go

Queue the plan.

Confirm and apply when it asks you if you want to continue.

![](/assets/uploads/ld_confirm_apply.png "Terraform Cloud Confirm and Apply")

Check LaunchDarkly, you should have a new project, environment, and feature flag that's on!

![](/assets/uploads/ld_final_result.png "LaunchDarkly Final")

Stretch goal - Turn off your feature flag by committing to the repo. Terraform Cloud will pick up the change and apply it. That goes for any change you make!
