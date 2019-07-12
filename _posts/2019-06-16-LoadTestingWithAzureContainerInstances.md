---
layout: post
title:  "Load Testing with Azure Container Instances"
date:   2019-06-23 
categories: Azure Load-Testing Containers
comments: true
featured: false
hidden: false
featured_image_thumbnail: assets/images/posts/2019/aci-thumbnail.png
featured_image: assets/images/posts/2019/artillery-featured.jpg
---

Recently, Microsoft annouced that they're going to be abandoning support for Visual Studio Cloud-based Load Tests. Creating tests through Visual Studio wasn't trivial, but it was cloud-based and there was no need to provision dedicated test harnesses. 

<center>
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I have found the visual studio load tests to be quirky when testing an API. I like the simplicity of <a href="https://t.co/a8LeUBagfa">https://t.co/a8LeUBagfa</a>.   Azure Container Instances + artillery is very sweet</p>&mdash; Facundo Gauna (@gaunacode) <a href="https://twitter.com/gaunacode/status/1101458172362010624?ref_src=twsrc%5Etfw">March 1, 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

<!--more-->

## Background

At work, I like to run quick and simple load tests against some of our projects. 
Running these tests often, help us validate that we're not over-complicating the architecture and we're verying our assumptions about the performance of the stack.

I typically choose to run my load tests using [Artillery](artillery.io). The YAML syntax is very easy to learn for developers and you wrap things up in a Linux container. Sometimes, as opposed to running these load tests from Azure, we have to run them on-prem because our clients sometimes have on-prem services that are not exposed.

Lastly, we typically invoke these load tests from our pipelines so that they at least run nightly. This ensures that it's in the forefront of our minds and we don't forget about them.

## The Challenge

Like most npm tools, Artillery runs from the command line. It's very easy to create tests and run them from a development machine. Bringing us to the core problem, it's more difficult to run load tests from multiple machines and outside of a developer's machine. There is **Artillery Pro** but it works as a self-hosted solution on someone's AWS account.

Sometimes, signing up for new cloud-based services and entering a subscription has to go through red-tape/appproval. But, if your company is using the cloud already, then you could run load tests with Artillery and Azure. 

## The Solution

Azure Container Instances are a nice way to run containers quickly on Azure. An Azure Container Instance is created to run a test run, then it stops as soon as the load test is complete. **You only get billed for the lifetime of your container**. Lastly, you could publish the results to blob storage and HTML results from there. 

### 1. Creating your First Load Test

Asumming you have Node installed, download Artillery if you haven't

``` console

$ npm install -g artillery 

```
Create a load test YML - `load.yml`. This is the main configuration file for Artillery.

``` yaml
config:
 environments:
   prod:
     target: 'https://somewebsite.com'
     phases:
     - name: "constant load"
       duration: 20
       arrivalRate: 5
scenarios:
 - name: "Main Page"
   flow:
   - get:
       url: "/"
```

### 2. Create a Dockerfile


``` Dockerfile

FROM fgauna12/gaunastressyou:1.0.0

# Copy load test files into container
COPY samples/load.yml .

```

I created a base image to help with Artillery + Azure, [available on GitHub](https://github.com/fgauna12/AzureArtilleryLoadTests). At the end of your test run, it will publish results to an Azure Storage Account as blobs (if you want it to).

### 3. Build and Publish Container

From the Dockerfile, build and publish your container image to DockerHub. If you choose to use Azure Container Registry (ACR), then you will have to modify the ARM template to have your ACR credentials so that ACI can pull the image down.

``` bash
$ docker build -t "[image name]" . 
$ docker push "[image name]"
```

### 4. Run Container From Azure

1. Copy the [ARM Template here](https://raw.githubusercontent.com/fgauna12/AzureArtilleryLoadTests/master/armdeploy.json) and name it `armdeploy.json`
2. Run the ARM template. It will deploy an ACI container with your load test and also create a storage account in which it will put the results into

#### Bash (Azure CLI)

``` bash

$ az group create -g "[resource group]" -l "[location]"

$ az group deployment create -g "[resource group]" -n "[load test name]" \
    --template-file armdeploy.json \
    --parameters loadTestName="[load test name]" \
    artillery-environment="[environment as defined in artillery yml]" \
    artillery-file=load.yml \
    image="[image name]"

```

#### Powershell (AZ Module)

See here [run.ps1](https://raw.githubusercontent.com/fgauna12/AzureArtilleryLoadTests/master/armdeploy.json).

### 5. Done! Open the Results

When your load test is complete, your container should stop. 

Go to the storage account created and navigate down to the blobs. You will see an HTML report.

![](/assets/images/posts/2019/loadtest-1.png)

![](/assets/images/posts/2019/loadtest-2.png)

## What's next?

You could run your load tests from Azure Pipelines nightly. I'll write a follow-up post on how to do that. 

You could also run many instances of your load test container against your services.

Lastly, are you curious about how much money it costs? Use the Azure Calculator to estimate how much it will cost to run your load tests. For example, for a 5-minute load test nightly from a single container on weekdays is will cost around **$0.08 a month**.

To see the actual amount, the ARM template I provided adds tags that should show up on your bill.
