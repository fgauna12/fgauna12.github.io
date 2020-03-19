---
layout: post
title: Is Terraform faster than ARM?
tags:
  - azure
  - devops
date: 2020-03-19T01:50:08.066Z
featured: false
hidden: false
comments: false
---
Based on *feeling* and experiencing the differences of heavy usage with Terraform and ARM, it *feels* that Terraform is much faster than ARM templates. So I decided to create a simple test.

<!--more-->

### The Test

The test created **10 app services** and their app service plans. There were four cases:

1. Terraform - When resources don't already exist
2. Terraform - When resources already exist
3. ARM Template - When resources don't already exist
4. ARM Template - When resources already exist

Here's the [source code](https://github.com/fgauna12/TerraformVsArmSpeedTest) of the tests.

### The results

* Terraform Creation (1 minute 14 seconds)
* Terraform Update (1 minute 15 seconds)
* ARM Creation (5 minutes 10 seconds)
* ARM Update (4 minute 44 seconds)

Why 10 app services? For simple deployments I didn't find much of a significant difference. When deploying one app service, here are the results.

* Terraform Creation (1 minute 30 seconds)
* Terraform Update (1 minute 40 seconds)
* ARM Creation (2 minutes 11 seconds)
* ARM Update (2 minute 10 seconds)

There we go. It's not definite proof that Terraform is faster but it's strong evidence and definitely worth exploring. 

The significance is that more complex deployments run more quickly. This helps improve lead time of deployments. Also, it doesn't discourage people from using pipelines to deploy. Half hour deployments are no fun.