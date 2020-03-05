---
layout: post
title: Installing Flux using Azure DevOps and Helm on AKS
tags:
  - devops
  - kubernetes
  - azure
date: 2020-02-24T22:01:58.353Z
featured: false
hidden: false
comments: false
---
[Flux](https://landscape.cncf.io/selected=flux) is an open-source project that's currently being incubated by the Cloud Native Computing Foundation. It enables Kubernetes cluster to adopt a [GitOps](https://gaunacode.com/gitops) workflow for deployments. Terraform can get you most of the way there. But, ultimately, there's some **glue code** needed. 

This is a quick guide on how to do it through Azure DevOps, Azure CLI, Helm 3, and AKS.

<!--more-->

### Background

Here's the [official documentation](https://docs.fluxcd.io/en/1.18.0/tutorials/get-started-helm.html) on how to install Flux using Helm. It also gives you instructions on how to install the Helm operator. The Helm operator watches for [declarative YAML](https://github.com/gaunadevops/flux-get-started/blob/master/releases/redis.yaml) based declaration on what Helm charts should be installed on the cluster.

### Azure DevOps

Step zero, you'll want to ensure that the running agent has Helm 3 installed.

```yaml
- task: HelmInstaller@1
  inputs:
    helmVersionToInstall: 'latest'
```

#### The Prep

First, you'll want to use the Azure CLI task (`AzureCLI@2`). We'll be using this to manually connect to the AKS cluster to issue `kubectl` and `helm` commands from the script. 

```yaml
- task: AzureCLI@2
  displayName: Install Fluxctl
  inputs:
    azureSubscription: '[your azure service connection]'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      set -e
      ## script will go here
```

`set -e` will make the build fail if there's an error in the inline script.

Next, you'll want to install `fluxctl`.

```bash
sudo snap install fluxctl --classic
```

Then, connect to the AKS cluster. If you're running from an agent that's already has working `kubectl` commands, then you won't need this step. The purpose of the following command is to be able to use `kubectl` and `helm` command line.

```bash
az aks get-credentials -n $CLUSTER_NAME -g $RESOURCE_GROUP_NAME
```

For me, the `CLUSTER_NAME` and `RESOURCE_GROUP_NAME` variables come from Terraform outputs.

Then, you'll be ready to install Flux.

#### Finally installing Flux

First, create the flux namespace.

```bash
kubectl apply -f flux.yaml
```

Where the contents of the `flux.yaml` file are

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name:  flux
```

With this approach, we can apply this configuration file and it won't fail if the namespace already exist.

Next, use Helm to install Flux.

```bash
helm repo add fluxcd https://charts.fluxcd.io

helm upgrade -i flux fluxcd/flux \
        --set git.url=$(ManifestsRepoUrl) \
        --namespace flux
```

`$(ManifestsRepoUrl)` is the variable that points to the Git repo URL for the main repository to be used by Flux.

Next, install the helm operator.

```bash
helm upgrade -i helm-operator fluxcd/helm-operator \
        --set git.ssh.secretName=flux-git-deploy \
        --namespace flux \
        --set helm.versions=v3
```

Since I am not using Helm v2, I am specific about only using Helm 3 by specifying the `helm.versions` value in the Helm chart.

Lastly, you'll want to get the SSH public key the flux operator so that it can interact with the Git repository. For this, we'll use `fluxctl` to get the "identity."

```bash
STAGING_SSH_PUBLIC_KEY=$(fluxctl identity --k8s-fwd-ns flux)
echo "##vso[task.setvariable variable=Staging.Flux.SshPublicKey;issecret=true]$STAGING_SSH_PUBLIC_KEY"
```

That's it! 

As shown above, I am also assigning the public ssh key to a pipeline variable. This later allows me to configure GitHub with a new deploy key for the repo being watched.

### By the way

Here's what it looks like all together

```bash
- task: AzureCLI@2
  displayName: Install Fluxctl
  inputs:
    azureSubscription: '[azure service connection]'
    scriptType: 'bash'
    scriptLocation: 'inlineScript'
    inlineScript: |
      set -e

      CLUSTER_NAME=$(cat $(TerraformCluster.jsonOutputVariablesPath) | jq '.cluster_name.value' -r)
      RESOURCE_GROUP_NAME=$(cat $(TerraformCluster.jsonOutputVariablesPath) | jq '.resource_group_name.value' -r)
      
      echo "installing fluxctl"
      sudo snap install fluxctl --classic

      echo "acquiring credentials for cluster"
      az aks get-credentials -n $CLUSTER_NAME -g $RESOURCE_GROUP_NAME

      echo "ensuring flux namespace exists"
      kubectl apply -f k8s/flux.yml

      echo "installing flux. adding fluxcd helm repo"
      helm repo add fluxcd https://charts.fluxcd.io

      echo "installing flux. installing the main operator"
      
      helm upgrade -i flux fluxcd/flux \
        --set git.url=$(ManifestsRepoUrl) \
        --namespace flux

      echo "installing flux. installing the helm operator"
      helm upgrade -i helm-operator fluxcd/helm-operator \
        --set git.ssh.secretName=flux-git-deploy \
        --namespace flux \
        --set helm.versions=v3
      
      sleep 5
      
      echo "acquiring public ssh key for flux"
      STAGING_SSH_PUBLIC_KEY=$(fluxctl identity --k8s-fwd-ns flux)
      echo "##vso[task.setvariable variable=Staging.Flux.SshPublicKey;issecret=true]$STAGING_SSH_PUBLIC_KEY"
```