---
layout: post
title: Installing Linkerd using Azure DevOps
tags:
  - devops
  - kubernetes
date: 2020-03-05T04:21:21.218Z
featured: false
hidden: false
comments: false
---
Similar to a previous [post](https://gaunacode.com/installing-fluxcd-using-azure-devops-and-helm-on-aks), this is a small guide on how to create some **glue code** to ensure Linkerd is installed on a Kubernetes cluster.

<!--more-->

### Pre-Requisites

* A YAML pipeline
* A pipeline that can issue `kubectl` commands. This post has [some clues](https://gaunacode.com/installing-fluxcd-using-azure-devops-and-helm-on-aks) on how to connect to an AKS cluster using the Azure CLI.

### Installing Linkerd

First, define a pipeline variable for the version of Linkerd to use.

```yaml
variables:  
 - name: LinkerdVersion
   value: stable-2.7.0
```

Then, assuming your agent can issue `kubectl` commands against a cluster. Meaning, you already connected, then you can proceed with using the plain `bash` task.

We will use instructions from the official [Microsoft docs](https://docs.microsoft.com/en-us/azure/aks/servicemesh-linkerd-install?pivots=client-operating-system-linux) on how to install Linkerd, with some small modifications.

```yaml
- bash: |
    set -e

    echo "installing linkerd"
    # Specify the Linkerd version that will be leveraged throughout these instructions
    LINKERD_VERSION=$(LinkerdVersion)

    curl -sLO "https://github.com/linkerd/linkerd2/releases/download/$LINKERD_VERSION/linkerd2-cli-$LINKERD_VERSION-linux"

    sudo cp ./linkerd2-cli-$LINKERD_VERSION-linux /usr/local/bin/linkerd
    sudo chmod +x /usr/local/bin/linkerd
```

The first line, `set -e`, will ensure that the pipeline fails when there's an error in the bash script.

The next steps ensure that the Linkerd CLI is installed on the agent running the pipeline. We'll use the Linkerd CLI to install Linkerd itself.

But first, check to see if Linkerd is already installed. Because we'll run some pre-installation checks if Linkerd is truly not installed on the cluster. Once those checks pass, we'll install Linkerd. Without checking that it's already installed, the pipeline would fail for clusters in which Linkerd exists.

We'll check pre-existing installation with `kubectl` and [jq](https://stedolan.github.io/jq/) to see if there's already a `linkerd` namespace.

```bash
FLUX_NAMESPACE=$(kubectl get ns -o json | jq '.items[].metadata.name | select(.=="flux")')
if [ -z "$FLUX_NAMESPACE" ]
then
  echo "Linkerd not installed. Installing Linkerd"
  echo "Running pre-checks with Linkerd"
  linkerd check --pre

  echo "Installing Linkerd"
  linkerd install | kubectl apply -f -
else 
  echo "Linkerd already installed"
fi
```

Lastly, we'll run some checks to verify the health of the installation. Probably a good idea to run regardless if the pipeline installed Linkerd.

```bash
echo "Checking installation"
linkerd check
```

### Putting it all together

```yaml
- bash: |
    set -e

    echo "installing linkerd"
    # Specify the Linkerd version that will be leveraged throughout these instructions
    LINKERD_VERSION=$(LinkerdVersion)

    curl -sLO "https://github.com/linkerd/linkerd2/releases/download/$LINKERD_VERSION/linkerd2-cli-$LINKERD_VERSION-linux"

    sudo cp ./linkerd2-cli-$LINKERD_VERSION-linux /usr/local/bin/linkerd
    sudo chmod +x /usr/local/bin/linkerd

    FLUX_NAMESPACE=$(kubectl get ns -o json | jq '.items[].metadata.name | select(.=="flux")')
    if [ -z "$FLUX_NAMESPACE" ]
    then
      echo "Linkerd not installed. Installing Linkerd"
      echo "Running pre-checks with Linkerd"
      linkerd check --pre

      echo "Installing Linkerd"
      linkerd install | kubectl apply -f -
    else 
      echo "Linkerd already installed"
    fi
    echo "Checking installation"
    linkerd check
  continueOnError: false
```

That's it!