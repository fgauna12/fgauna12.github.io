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

* 1x [wall-mountable power strip](https://www.amazon.com/gp/product/B08GG8814S/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)
* 4x [patch ethernet cables](https://www.amazon.com/gp/product/B008F0YD46/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 4x [Raspberry Pis Model B w/ 4 GB RAM](https://www.amazon.com/gp/product/B07TC2BK1X/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 4x [power supplies for the Raspberry Pis](https://www.amazon.com/gp/product/B07TYQRXTK/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 1x [Raspberry Pi cluster case](https://www.amazon.com/gp/product/B07CTG5N3V/ref=ppx_yo_dt_b_asin_title_o08_s01?ie=UTF8&psc=1)
* 4x [Samsung SD cards](https://www.amazon.com/gp/product/B06XWN9Q99/ref=ppx_od_dt_b_asin_title_s00?ie=UTF8&psc=1)

What's the power strip for? I ran out of plugs in my old power strip. That one had 12 outlets and I could also mount it *underneath* my desk to hide most of the cables.

I did not buy: an ethernet cable to connect the Pis to my network. I already had some. Also, I did not buy a switch, I already had one too. If you need one, [something like this would work](https://www.amazon.com/NETGEAR-5-Port-Gigabit-Ethernet-Unmanaged/dp/B07S98YLHM/ref=sr_1_3?dchild=1&keywords=5+switch&qid=1611407266&s=electronics&sr=1-3).

Why not using a USB charging hub? 
Allex Ellis recommended to use the power supply. He mentioned there's several accounts of people experiencing their charging hubs to be "browning out."

## The assembly

It took me about 1.5 - 2 hours to put everything together. I stacked the Pis on the cluster case and tediously placed the fans. The fans are highly recommended and I configured them to be in _quiet_ mode. They're _really_ quiet. 

Then, I also spent significant time re-doing my wiring on my desk to have more outlets. This allowed me to have the cluster on my desk.

## Flashing the SD cards

I flashed all the SD cards with **Rasberry Pi OS Lite 32-bit**. I used the [Raspberry Pi Imager]. It was really easy. However, as I each SD card was flashed, I would re-plug it. I would make the following two changes:
- Enabled SSH by creating an empty file in the `/boot` directory called `ssh`. [Read more here]()
- I modified the `cmdline.txt` file in the `/boot` directory. I appended the `cgroup_memory=1 cgroup_enable=memory` commands . [This is a requirement for k3s to run on Raspberry Pis](https://rancher.com/docs/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster).

## Shaving the Yak

After each SD card was flashed and some of the pre-requisites were taken care of, it was time do more prep work. 

First, I booted up the Pis and observed that the blinky lights looked healthy. 
I then used `nmap` to find the private IPs for these new Pis.

``` shell
nmap -sn 192.168.1.0/24
```

If they are working fine, you should see the Pis with a default hostname that starts with `raspberry`. 

Then, I would SSH into each Pi and change the default password. I would also change the default hostname in `/etc/hostname` and the matching entry in the hosts file at `/etc/hosts`. As I was SSH'd into the Pi, I would also enable `iptables` since [it's another pre-requisite for k3s](https://rancher.com/docs/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster). The command was:

``` shell
sudo iptables -F
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo reboot
```
Lastly, I would also copy my SSH key into each Pi through `ssh-copy-id`.

## Installing k3s

I had limited success trying to install k3s through the official instructions. It was time consuming and I had issues with the master node coming online. Unfortunately, I don't recall the issues and I did not have enough time to look for the root cause of the issue (kids). I started over by re-flashing the SD cards and used the [k3sup](https://github.com/alexellis/k3sup) project by Alex Ellis.

Assuming you installed k3sup, then it was really simple to create a k3s _server_ node. A server node is the Kubernetes master.  
``` bash
export MASTER="[your private ip of the master pi]"
k3sup install --ip $MASTER --user pi
```

After installation, I would ensure that the master was up and healthy by attempting a simple `kubectl` command. k3sup was also nice enough to place the Kubernetes config file into my working directory.

``` shell
kubectl get nodes --kubeconfig k3s.yaml
```

After the master node was up, I would move on to the worker nodes. 

``` shell
k3sup join --ip 192.168.1.217 --server-ip $MASTER --user pi
k3sup join --ip 192.168.1.213 --server-ip $MASTER --user pi
k3sup join --ip 192.168.1.221 --server-ip $MASTER --user pi
```




