---
layout: post
title: Deploying an ingress controller to an internal virtual network and
  fronted by an Azure Application Gateway
tags:
  - devops
  - azure
  - kubernetes
date: 2021-02-24T17:48:26.994Z
featured: true
hidden: true
featured_image_thumbnail: /assets/uploads/markus-winkler-sz98vfix0pw-unsplash.jpg
featured_image: /assets/uploads/markus-winkler-sz98vfix0pw-unsplash.jpg
comments: false
---
There are many ways to add a Web Application Firewall (WAF) in front of applications hosted on Azure Kubernetes Service (AKS). In this post, we'll cover how to set-up an NGINX ingress controller on AKS, then create an Azure Application Gateway to front the traffic from a Public IP, terminate TLS, then forward traffic to the NGINX ingress controller listening on a Private IP, unencrypted.

<!--more-->

## Pre-Requisites

* An AKS cluster using Azure CNI as the network plugin
* A virtual network with two subnets `asg` and `aks`. The `asg` subnet will hold the Application Gateway, and the `aks` subnet will hold the AKS cluster.
* A resource group, in this case `rg-appg-ingress-test`

![](/assets/uploads/ingress-test-diagram.png#wide)

## Deploying NGINX ingress controller with a private IP

During this section, we'll borrow instructions from this [MSFT docs page](https://docs.microsoft.com/en-us/azure/aks/ingress-internal-ip).

First, choose a private IP address and verify that it's available. In this case, the IP address I chose is `10.0.0.100`.

```bash
az network vnet check-ip-address --name vnet-ingress-test -g rg-appg-ingress-test --ip-address 10.0.0.100
```

Create the following file named `internal-ingress.yaml` with the chosen IP address.

```yaml
controller:
  service:
    loadBalancerIP: 10.0.0.100
    annotations:
      service.beta.kubernetes.io/azure-load-balancer-internal: "true"
```

This will be used to configure the NGINX Helm chart to use the given IP address for the ingress controller. 

```bash
# Create a namespace for your ingress resources
kubectl create namespace ingress

# Add the ingress-nginx repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Use Helm to deploy an NGINX ingress controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
    --namespace ingress \
    -f internal-ingress.yaml \
    --set controller.replicaCount=2 \
    --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
    --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```

It may take a few minutes for the IP address to be assigned. 

```shell
$ kubectl --namespace ingress get services -o wide -w nginx-ingress-ingress-nginx-controller
NAME                                     TYPE           CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE    SELECTOR
nginx-ingress-ingress-nginx-controller   LoadBalancer   10.0.75.105   <pending>     80:31026/TCP,443:30254/TCP   2m8s   app.kubernetes.io/component=controller,app.kubernetes.io/instance=nginx-ingress,app.kubernetes.io/name=ingress-nginx
```

## Deploying two test applications

Let's create a namespace for the sample apps.

```bash
kubectl create ns ingress-test
```

Deploy the first sample application. 

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-helloworld
  namespace: ingress-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-helloworld
  template:
    metadata:
      labels:
        app: aks-helloworld
    spec:
      containers:
      - name: aks-helloworld
        image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
        ports:
        - containerPort: 80
        env:
        - name: TITLE
          value: "Welcome to Azure Kubernetes Service (AKS)"
---
apiVersion: v1
kind: Service
metadata:
  name: aks-helloworld
  namespace: ingress-test
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: aks-helloworld
EOF
```

Now, deploy the second test application in the same namespace. 

```bash
cat <<EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ingress-demo
  namespace: ingress-test
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ingress-demo
  template:
    metadata:
      labels:
        app: ingress-demo
    spec:
      containers:
      - name: ingress-demo
        image: mcr.microsoft.com/azuredocs/aks-helloworld:v1
        ports:
        - containerPort: 80
        env:
        - name: TITLE
          value: "AKS Ingress Demo"
---
apiVersion: v1
kind: Service
metadata:
  name: ingress-demo
  namespace: ingress-test
spec:
  type: ClusterIP
  ports:
  - port: 80
  selector:
    app: ingress-demo
EOF
```

Okay, create the ingress definition to verify part of the ingress controller.
This will create an ingress rule to map requests for that domain to the appropriate service in Kubernetes.

```bash
export DOMAIN_NAME="ingress.gaunacode.com"

cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: hello-world-ingress
  namespace: ingress-test
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "false"
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
  - host: $DOMAIN_NAME
    http:
      paths:
      - backend:
          serviceName: aks-helloworld
          servicePort: 80
        path: /hello-world-one(/|$)(.*)
      - backend:
          serviceName: ingress-demo
          servicePort: 80
        path: /hello-world-two(/|$)(.*)
      - backend:
          serviceName: aks-helloworld
          servicePort: 80
        path: /(.*)
EOF
```

**Notice:** how there's an annotation of `nginx.ingress.kubernetes.io/ssl-redirect: "false"`. <mark>This will ensure that if we ever assign a TLS certificate to the ingress definition, NGINX won't start re-routing `http` traffic to `https`.</mark> This is important for us since we are using an Application Gateway that will terminate SSL and we want this behavior to be enforced by the Application Gateway, not the ingress controller. Otherwise, it might mess up with the health probes from the Application Gateway to  the Kubernetes cluster.

## Testing the ingress controller from a test container

Now, let's launch a pod to validate the configuration.

```bash
kubectl run -it --rm aks-ingress-test --image=debian --namespace ingress-test
```

You will be inside the container at this point. Then install curl, we're going to use `curl` against our ingress controller. 

```bash
apt-get update && apt-get install -y curl
```

Once `curl` is installed on the container, then let's make sure that our ingress is working.

```bash
curl -L -H "Host: ingress.gaunacode.com" http://10.0.0.100
```

Notice how we're changing the `Host` header to ensure that our ingress route is used. We haven't created an external DNS record and we haven't configured the application gateway yet.

If everything works well, you should see HTML with "Welcome to Kubernetes". That's one of our sample applications.

```
root@aks-ingress-test:/# curl -L -H "Host: ingress.gaunacode.com" http://10.0.0.100
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <link rel="stylesheet" type="text/css" href="/static/default.css">
    <title>Welcome to Azure Kubernetes Service (AKS)</title>

    <script language="JavaScript">
        function send(form){
        }
    </script>

</head>
<body>
    <div id="container">
        <form id="form" name="form" action="/"" method="post"><center>
        <div id="logo">Welcome to Azure Kubernetes Service (AKS)</div>
        <div id="space"></div>
        <img src="/static/acs.png" als="acs logo">
        <div id="form">      
        </div>
    </div>     
</body>
</html>
```

## Preparing an Application Gateway

If you don't have one, here's how to create a `Standard_v2` application gateway. It pre-configures some aspects like the backend. It uses the private IP of the ingress controller.

```bash
az network public-ip create -g rg-appg-ingress-test -l eastus -n pip-appg-ingress-test --sku Standard

az network application-gateway create --name azappg-appg-ingress-test -g rg-appg-ingress-test -l eastus --sku Standard_v2 --public-ip-address pip-appg-ingress-test --vnet-name vnet-ingress-test --subnet appg --servers 10.0.0.100
```

## Configuring the Application Gateway (Manually)

Next, grab the public IP of the application gateway and create an external DNS record. 

![Where to find the Public IP on the App Gateway from the portal](/assets/uploads/appg-public-ip.png#wide "Where to find the Public IP on the App Gateway from the portal")

In my case, 

```
[A record @ ingress.gaunacode.com] -> 20.72.158.202
```

Modify the default HTTP settings and override the hostname. This will ensure that our ingress rule is used in the NGINX ingress controller.

![Creating an HTTP listener on the app gateway](/assets/uploads/appg-http-setting.png "Creating an HTTP listener on the app gateway")

Verify that ingress works. I'm my case, `http://ingress.gaunacode.com`. HTTPS should not work yet.

Create an HTTPS listener. I am using a trial certificate for the `ingress.gaunacode.com` domain.

![Creating an HTTPS listener on the app gateway](/assets/uploads/appg-https-listener.png "Creating an HTTPS listener on the app gateway")

Next, create a "Rule" to tie the HTTPS listener to the backend.

![Creating an App Gateway Rule for HTTPS - Part 1](/assets/uploads/appg-rule-2-1.png "Creating an App Gateway Rule for HTTPS - Part 1")

Then the "Backend Targets"

![App Gateway Rule 2](/assets/uploads/appg-rule-2.png "Creating an App Gateway Rule for HTTPS - Part 2")

Once the "Rule" is created, then the App Gateway should accept traffic from the public IP, through the HTTP listener, tied to a "backend" using the Rule and `http` settings. The App Gateway creates a new connection to the NGINX ingress controller through a private static IP and overriding the "hostname" so that the Ingress rule kicks in.

![Browser showing it works](/assets/uploads/appg-tada.png#wide "Browser showing it works")

That's it! Hope that helped.