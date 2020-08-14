---
layout: post
title: Running one-time jobs during Kubernetes deployments
tags:
  - kubernetes
  - devops
date: 2019-08-24T00:00:00.000Z
featured: false
hidden: false
featured_image_thumbnail: /assets/uploads/kubernetes.svg
featured_image: /assets/uploads/business-1845350_640-1-.jpg
comments: true
---

Sometimes, we want to run a one-time job during our deployments. For example, running an Entity Framework migration. By creating a console application, packaged as a Docker image, we can run these one-time jobs as a Kubernetes Job upon a deployment.

<!--more-->

## Setting up the example

I created a simple .NET Core console app that will run as a fake one-time job. In following posts, I will show how to run an Entity Framework migration instead.

The example source code can be found [here](https://github.com/fgauna12/KubernetesOneTimeJob).

### The Dockerfile

``` dockerfile

# Build imaage
FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build-env
WORKDIR /app
COPY *.csproj ./
RUN dotnet restore
COPY . ./
RUN dotnet publish -c Release -o output

# Runtime image
FROM mcr.microsoft.com/dotnet/core/runtime:2.2
WORKDIR /app
COPY --from=build-env /app/output .
ENTRYPOINT ["dotnet", "HelloFakeJob.dll"]

```


### Verifying the container

This is important. **We want to make sure that the container stops itself after the task inside the container is finished**. Otherwise, you will have a never ending job in Kubernetes.

For example: 

``` console

docker build -t hellokubernetesjob .

```

Then running and ensuring it is not running by looking at the _STATUS_ column:

``` console

➜  docker run -it hellokubernetesjob
Hello World!
➜  docker ps -a
CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS                      PORTS               NAMES
5e5d66390226        hellokubernetesjob   "dotnet HelloFakeJob…"   2 minutes ago       Exited (0) 2 minutes ago                        vigila
```

## The Kubernetes Deployment

``` yaml

apiVersion: batch/v1
kind: Job
metadata:
  name: hellokubernetesjob
spec:
  template:
    spec:
      containers:
      - name: hellokubernetesjob
        image: myregistry.azurecr.io/samples/hellokubernetesjob
      restartPolicy: OnFailure
  backoffLimit: 4

```

After having pushed the docker image to a container registry, deploy the job

``` console

➜  kubectl apply -f hellofakejob.yml
job.batch/hellokubernetesjob created


``` 

Kubernetes will run the job and keep the job metadata and pod forever. The purpose of this is to see what jobs were run and have access to their logs. 

The jobs will have to be manually deleted. **I recommend that you create a runbook pipeline or script that runs periodically and deletes the old jobs.**


``` console

➜  kubectl get job/hellokubernetesjob
NAME                 COMPLETIONS   DURATION   AGE
hellokubernetesjob   1/1           21s        36s

```

Ensure that your job completes. You can also retrieve the container logs:

``` console

➜  kubectl get pods --selector=job-name=hellokubernetesjob
NAME                       READY   STATUS      RESTARTS   AGE
hellokubernetesjob-lbxsm   0/1     Completed   0          9m14s
➜  kubectl logs hellokubernetesjob-lbxsm                  
Hello World!

```

### Optional: Verify Failure

Try to verify the behavior of something terribly wrong happening within the container. I will modify my sample app to throw an exception.

``` csharp
using System;

namespace HelloFakeJob
{
    class Program
    {
        static void Main(string[] args)
        {
//            Console.WriteLine("Hello World!");
            
            throw new Exception("Uh ohhhhhhhh");
        }
    }
}
```

**Note** - Any subsequent job deployments require a different name. Otherwise, Kubernetes will not apply. Instead it will say:

`job.batch/hellokubernetesjob unchanged`

**It's best that you append an identifier to the job name. For example, a pipeline build number, a datestamp, etc.**

``` console

➜  kubectl apply -f hellofakejob.yml                         
job.batch/hellokubernetesjob-failure created
➜  kubectl get pods --selector=job-name=hellokubernetesjob-failure
NAME                               READY   STATUS             RESTARTS   AGE
hellokubernetesjob-failure-hckhz   0/1     CrashLoopBackOff   2          41s

```

As expected, the pod will continuously restart **4** times as per the `backoffLimit` setting.

### Optional: Helm

One feature in helm that can be useful for issuing these one time jobs are [deployment hooks](https://github.com/helm/helm/blob/master/docs/charts_hooks.md).

Helm provides hooks in the helm chart lifecycle such as: 
- _pre-install_
- _post-install_
- _pre-rollback_

The deployment hooks allow us to run a job before a deployment using the `pre-install` hook. 
To declare a job to run before the installation of a helm chart, you would add an annotation:

``` yaml

annotations:
    "helm.sh/hook": pre-install

```

You can also indicate the order of which hooks have to run using _weights_.
The lower the number, the sooner it will run.

Lastly, you can clean up these one time jobs and remove the need to create a *runbook* pipeline or script that cleans up these jobs later. 
The self cleanup is possible using the _hook deletion policies._

``` yaml

annotations:
  "helm.sh/hook-delete-policy": hook-succeeded

```

#### Putting it all together

{% raw %}

``` yaml

apiVersion: batch/v1
kind: Job
metadata:
  name: "{{.Release.Name}}"
  labels:
    app.kubernetes.io/managed-by: {{.Release.Service | quote }}
    app.kubernetes.io/instance: {{.Release.Name | quote }}
    app.kubernetes.io/version: {{ .Chart.AppVersion }}
    helm.sh/chart: "{{.Chart.Name}}-{{.Chart.Version}}"
  annotations:
    "helm.sh/hook": pre-install
    "helm.sh/hook-weight": "1"
    "helm.sh/hook-delete-policy": hook-succeeded
spec:
  template:
    spec:
      containers:
      - name: hellokubernetesjob
        image: myregistry.azurecr.io/samples/hellokubernetesjob
      restartPolicy: OnFailure
  backoffLimit: 4

```

{% endraw %}

## Next Steps

- Create a pipeline that publishes your job to your container registry
- From your main deployment pipeline for your application, either: 
   - Include the job as part of your Helm chart and make the job name unique per deployment. For example, you can use the chart release name and a version number.
   - If you don't use Helm, run a `kubectl apply` before the main deployment and also have the job name be unique per deployment
- If you're not using Helm deployment hooks, create a runbook (i.e. script or pipeline). This will help you clean up old job deployments. Maybe you can configure this to run on a timer.


