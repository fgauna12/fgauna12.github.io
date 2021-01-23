---
layout: post
title: Building a Kubernetes cluster on Raspberry Pis with a little Azure
tags:
  - devops
  - azure
  - kubernetes
date: 2021-01-23T12:55:59.779Z
featured: true
hidden: true
featured_image_thumbnail: /assets/uploads/facundo-pi.jpg
featured_image: /assets/uploads/facundo-pi.jpg
comments: false
---
Recently I finished something I've been wanting to do for a long time: to create a Kubernetes cluster running on some Raspberry Pis. I mostly followed a recent post from [Alex Ellis](https://blog.alexellis.io/self-hosting-kubernetes-on-your-raspberry-pi/). This post will build on that like the bill of materials, kinks, and some tips. 

<!--more-->

## Overview

What I have running is a 4-node (1 master, 3 workers) Kubernetes cluster hosted on 4 Raspberry Pis 4 Model B with 4 GM of RAM. The nodes are running [k3s](https://k3s.io/) - a lightweight distribution of Kubernetes for the edge. On my cluster, I am using the [inlets](https://github.com/inlets/inlets) project to expose some test web applications to the public internet without requiring public static IPs from my ISP. 

## The bill of materials

Here's the list of things I got. It all cost me **$389.42**.

* 1x [wall-mountable power strip](https://www.amazon.com/gp/product/B08GG8814S/ref=ppx_yo_dt_b_asin_title_o01_s00?ie=UTF8&psc=1)
* 4x [patch ethernet cables](https://www.amazon.com/gp/product/B008F0YD46/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 4x [Raspberry Pis Model B w/ 4 GB RAM](https://www.amazon.com/gp/product/B07TC2BK1X/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 4x [power supplies for the Raspberry Pis](https://www.amazon.com/gp/product/B07TYQRXTK/ref=ppx_yo_dt_b_asin_title_o08_s00?ie=UTF8&psc=1)
* 1x [Raspberry Pi cluster case](https://www.amazon.com/gp/product/B07CTG5N3V/ref=ppx_yo_dt_b_asin_title_o08_s01?ie=UTF8&psc=1)
* 4x [Samsung SD cards](https://www.amazon.com/gp/product/B06XWN9Q99/ref=ppx_od_dt_b_asin_title_s00?ie=UTF8&psc=1)

What's the power strip for? I ran out of plugs in my old power strip. This one has 12 outlets and I could also mount it *underneath* my desk to hide most of the cables.

What I _did_ not buy? An ethernet cable to connect the Pis to my network. I already had some. Also, I did not buy a switch, I already had one too. If you need one, [something like this would work](https://www.amazon.com/NETGEAR-5-Port-Gigabit-Ethernet-Unmanaged/dp/B07S98YLHM/ref=sr_1_3?dchild=1&keywords=5+switch&qid=1611407266&s=electronics&sr=1-3).

Why not using a [USB charging hub](https://www.amazon.com/Anker-Charger-PowerPort-iPhone-Galaxy/dp/B00P936188/ref=sr_1_3?dchild=1&keywords=usb+charging+hub&qid=1611421817&sr=8-3)? 
Allex Ellis recommended using the power supply. He mentioned there are several accounts of people experiencing their charging hubs to be "browning out."

## The assembly

It took me about 1.5 - 2 hours to put everything together. I stacked the Pis on the cluster case and tediously placed the fans. The fans are highly recommended and I configured them to be in *quiet* mode. They're *really* quiet. 

Then, I also spent significant time re-doing the wiring at my desk to have more outlets. This allowed me to have the cluster on my desk.

## Flashing the SD cards

I flashed all the SD cards with **Rasberry Pi OS Lite 32-bit**. I used the [Raspberry Pi Imager](https://www.raspberrypi.org/software/). 

![The Raspberry Pi Imager Example](/assets/uploads/pi-imager.png "The Raspberry Pi Imager")
![Choosing the right image on the Raspberry Pi Imager](/assets/uploads/pi-imager-2.png "Choosing the right image on the Raspberry Pi Imager")

It was really easy. However, as each SD card was flashed, I would re-plug it. I would make the following two changes:

* Enabled SSH by creating an empty file in the `/boot` directory called `ssh`. [Read more here](<>)
* I modified the `cmdline.txt` file in the `/boot` directory. I appended the `cgroup_memory=1 cgroup_enable=memory` commands . [This is a requirement for k3s to run on Raspberry Pis](https://rancher.com/docs/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster).

## Shaving the Yak

After each SD card was flashed and some of the pre-requisites were taken care of, it was time to do more prep work. 

First, I booted up the Pis and observed that the blinky lights looked healthy. 
I then used `nmap` to find the private IPs for these new Pis.

```shell
nmap -sn 192.168.1.0/24
```

If they are working fine, you should see the Pis with a default hostname that starts with `raspberry`. 

Then, I would SSH into each Pi and change the default password. I would also change the default hostname in `/etc/hostname` and the matching entry in the hosts file at `/etc/hosts`. As I was SSH'd into the Pi, I would also enable `iptables` since [it's another pre-requisite for k3s](https://rancher.com/docs/k3s/latest/en/advanced/#enabling-legacy-iptables-on-raspbian-buster). The command was:

```shell
sudo iptables -F
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo reboot
```

Once all the nodes rebooted, they had new DNS labels to the private IPs. 
Note: I chose to go the extra mile and make my top Pi on the cluster stack the `pi-master`. Then each Pi underneath was a node *in order*. 

![An example of the Pis with the private IPs](/assets/uploads/raspberry-pi-ips.png "An example of the Pis with the private IPs")

Lastly, I would also copy my SSH key into each Pi via `ssh-copy-id`.

## Installing k3s

I had limited success trying to install k3s through the official instructions. It was time-consuming and I had issues with the master node coming online. Unfortunately, I don't recall the issues and I did not have enough time to look for the root cause of the issue (kids). I started over by re-flashing the SD cards and used the [k3sup](https://github.com/alexellis/k3sup) project by Alex Ellis.

Assuming you installed k3sup, then it was really simple to create a k3s *server* node. A server node is the Kubernetes master.  

```bash
export MASTER="[your private ip of the master pi]"
k3sup install --ip $MASTER --user pi
```

After installation, I would ensure that the master was up and healthy by attempting a simple `kubectl` command. k3sup was also nice enough to place the Kubernetes config file into my working directory.

```shell
kubectl get nodes --kubeconfig k3s.yaml
```

After the master node was up, I moved on to the worker nodes. 

```shell
k3sup join --ip 192.168.1.217 --server-ip $MASTER --user pi
k3sup join --ip 192.168.1.213 --server-ip $MASTER --user pi
k3sup join --ip 192.168.1.221 --server-ip $MASTER --user pi
```

![Testing the new pi cluster](/assets/uploads/raspberry-pi-cluster-kubectl.png "Testing the new pi cluster")

## Installing inlets for ingress with a little Azure

Once I verified that my cluster was healthy, I wanted to try deploying my first test application. There were a few gotchas with this. Typically, in a cloud environment, you'll probably use a `LoadBalancer` service to expose to public IPs for your ingress controller to allow traffic into the cluster to direct it to some applications. In a home lab set-up, unless you buy public static IPs by your ISP, then you have dynamic public IPs that change outside your control. So, if you point your custom domain to the public IPs of your home router, then your custom domain might not work in the future. This is especially true if you wanted to take your Pis into the office or a presentation for a Meetup. 

So there's another open source project, [inlets](https://github.com/inlets/inlets), that essentially helps you create some cheap VMs on the cloud provider of choice, create/associate some public static IPs, then install an agent that talks to an operator running on your k8s cluster - effectively providing you with a public static IP for your cluster, securely. 

To install inlets, the easiest way and the documented way is using [arkade](https://github.com/alexellis/arkade). To be honest, I don't quite understand the value proposition of `arkade`. I haven't found a strong use-case for it in the real world. 

Begin by logging into Azure through the Azure CLI and creating an Azure service principal. 
Ensure you have the proper subscription selected, if not, use `az account set -s [subscription id]`. 
Save the authentication info for the service principal into a temporary file outside of source control. 

```bash
az login
az ad sp create-for-rbac --sdk-auth > /tmp/az_client_credentials.json

SUBSCRIPTION_ID=$(az account show | jq '.id' -r)
```

Then, create a Kubernetes cluster in your Pi cluster. It will contain the contents of the service principal authentication file.

```shell
kubectl create secret generic inlets-access-key --from-file=inlets-access-key=/tmp/az_client_credentials.json
```

If you want, you can delete your authentication file now. 

Then, install "inlets" through "arkade".

```
arkade install inlets-operator \
 --provider azure \
 --region eastus \
 --subscription-id=$SUBSCRIPTION_ID
```

Notice, how I used the Azure provider. The default "inlets" provider is Digital Ocean. 
But after a few minutes, check the status on the "traefik" ingress controller. Traefik comes installed by default with k3s as opposed to the more common NGINX ingress controller. 

```
kubectl get svc -n kube-system
```

You should see a `traefik` service in the `kube-system` namespace. This `LoadBalancer` service is used by the ingress controller. If everything worked fine, "inlets" should have provided a public IP to this service. Make note of it.

![Fidning Inlet public IP](/assets/uploads/raspberry-pi-inlets.png "Inlet public IP")

## Deploying the test application

Once "inlets" was set-up, then I moved onto deploying a test application. One caveat with Raspberry Pi k8s clusters is the CPU architecture. Most Docker images support the default architectures of `amd64`. Raspberry Pis need the `arm64` architecture; therefore, Docker images have to be built to target that architecture. 

I won't get into how to do this, but if you want to build your own Docker image that runs on Pis, then I found [this blog post useful](https://www.docker.com/blog/multi-arch-images/). 

If you want, you can use the test application I created. The image is public on Docker Hub. 
Start by creating a `test-application.yaml` with the following contents:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: realworld-deploy
  labels:
    app: realworld
spec:
  replicas: 1
  selector:
    matchLabels:
      app: realworld
  template:
    metadata:
      labels:
        app: realworld
    spec:
      containers:
      - name: realworld
        image: fgauna12/realworld-react:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app: realworld
  name: realworld-svc
spec:
  type: ClusterIP
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: realworld
---
kind: Ingress
apiVersion: extensions/v1beta1
metadata:
  name: "realworld-ingress"
spec:
  rules:
    - host: pi.gaunacode.com
      http:
        paths:
          - path: /
            backend:
              serviceName: realworld-svc
              servicePort: 80
```

You'll need a custom domain. Use that instead of mine in the `Ingress.spec.rules[0].host` portion.

Next, create an A record to point to the `traefik` service's public IP.

```
A record -> [Azure Public IP created by inlets and used by Traefik service]
```

Once you created the A record, you're ready to deploy the test app.

```shell
kubectl apply -f test-application.yaml
```

Give it a few, and you should have a test app running on your Kubernetes Raspberry Pi cluster! It will be addressable at the root of the custom domain you chose *without* `https`. In my case, `http://pi.gaunacode.com`. 

![Example app screenshot](/assets/uploads/example-app.png "Example app screenshot")

This example app is a dockerized version of [this React front-end](https://github.com/gothinkster/realworld). It's simply a static website driven by data from an API hosted by someone else. 

Hope that helped. Don't hesitate to reach out if you need help.