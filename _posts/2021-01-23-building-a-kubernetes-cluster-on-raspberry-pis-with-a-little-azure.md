---
layout: post
title: Building a Kubernetes cluster on Raspberry Pis with a little Azure
tags:
  - devops
  - azure
  - kubernetes
date: 2021-01-23T12:55:59.779Z
featured: false
hidden: false
comments: false
---
Recently I finished something I've been wanting to do for a long time: to create a Kubernetes cluster running on some Raspberry Pis. I mostly followed a recent post from [Alex Ellis](https://blog.alexellis.io/self-hosting-kubernetes-on-your-raspberry-pi/). This post will talk about specifics like the bill of materials, kinks, and some tips.

<!--more-->

## Overview

What I have running is a 4-node (1 master, 3 workers) Kubernetes cluster hosted on 4 Raspberry Pis 4 Model B with 4 GM of RAM. The nodes are running [k3s](https://k3s.io/) - a lightweight distribution of Kubernetes for the edge. On my cluster, I am using the [inlets](https://github.com/inlets/inlets) project to expose some test web applications to the public internet without requiring public static IPs from my ISP. 

## The bill of materials

Here's the list of things I got. 

- 1x [wall-mountable power strip](https://www.amazon.com/gp/product/B08GG8814S/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)
- 4x [patch ethernet cables](https://www.amazon.com/gp/product/B008F0YD46/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
- 4x [Raspberry Pis Model B w/ 4 GB RAM](https://www.amazon.com/gp/product/B07TC2BK1X/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
- 4x [power supplies for the Raspberry Pis](https://www.amazon.com/gp/product/B07TYQRXTK/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
- 1x [Raspberry Pi cluster case](https://www.amazon.com/gp/product/B07CTG5N3V/ref=ppx_yo_dt_b_asin_title_o08_s01?ie=UTF8&psc=1)
- 4x [Samsung SD cards](https://www.amazon.com/gp/product/B06XWN9Q99/ref=ppx_od_dt_b_asin_title_s00?ie=UTF8&psc=1)

What's the power strip for? I ran out of plugs in my old power strip. That one had 12 outlets and I could also mount it _underneath_ my desk to hide most of the cables.

I did not buy: an ethernet cable to connect the Pis to my network. I already had some. Also, I did not buy a switch, I already had one too. If you need one, [something like this would work](https://www.amazon.com/NETGEAR-5-Port-Gigabit-Ethernet-Unmanaged/dp/B07S98YLHM/ref=sr_1_3?dchild=1&keywords=5+switch&qid=1611407266&s=electronics&sr=1-3)




