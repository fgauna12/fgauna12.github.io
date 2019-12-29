---
layout: post
title: CI/CD for Web App for Container
tags:
  - devops
  - azure
date: 2019-12-29T03:13:18.254Z
featured: false
hidden: false
comments: false
---
Deploying to an Azure Web App for Container is a bit different than deploying to a traditional Azure Web App. Why? Because when using traditional application deployments, we *push* our code to the destination. With containers, we instead *pull* a container that contains our code and runtime. 

<!--more--> 

## The Container Way

We first ought to upload our container to a container registry. A container registry stores container images so that users can pull these images and use them. This distribution model also applies to transferring the image to our Azure Web App. From the web app, we ought to pull the correct version of an image from a container registry. Our responsibility is to tell Azure what the new image and image tag are so that it can pull it down.

Since we're reversing the deployment flow, there's new practices we want to adopt. For instance,

* Run unit tests and automated security tests before you publish to a container registry so that more hardened images are uploaded
* Tag the image with a build number or git version so that you can pull it down later

### Continuous Integration

There's a simple task on Azure DevOps to build and push a container image to a container registry. It supports Docker Hub, Azure Container Registry, and other registries.  Conveniently, you can also tag an image as you push it. Notice how we're tagging the image with the pre-defined build variable `$(Build.BuildNumber)`

```yaml
- task: Docker@2
  displayName: Build and Push
  inputs:
    command: buildAndPush
    containerRegistry: $(DockerHub.ContainerRegistryServiceConnnection)
    repository: $(DockerHub.OrganizationName)/codecampster
    buildContext: .
    Dockerfile: $(App.Dockerfile)
    tags: |
      $(Build.BuildNumber)
      latest
```

### Continuous Delivery

As promised, instead of deploying code, we will be pulling the right version of the container image from Azure. At this point, we already uploaded a version of a container image and tagged it with the build number. Next, we ought to signify our Azure Web App to pull the correct version. In my experience, the most effective way to do this is by simply using Infrastructure as Code. 

From the pipeline, we can use a task to deploy an ARM template and passing the builder number as a parameter.  This steps assumes that we would have had an ARM template published as part of the build artifacts. 

```yaml
- download: current
- task: AzureResourceManagerTemplateDeployment@3
  displayName: ARM Template Deployment
  inputs:
    deploymentScope: 'Resource Group'
    azureResourceManagerConnection: '$(Azure.ServiceConnection)'
    action: 'Create Or Update Resource Group'
    resourceGroupName: '$(ResourceGroup)'
    location: 'East US'
    templateLocation: 'Linked artifact'
    csmFile: '$(Pipeline.Workspace)/iac/armdeploy.json'
    csmParametersFile: '$(Pipeline.Workspace)/iac/armdeploy.parameters.json'
    overrideParameters: "$(FullImageTag)"
    deploymentMode: 'Incremental'
```

### Infrastructure as Code

For the previous step to work, we must have an ARM template published as a build artifact. 
Here's an example of what the snippet for an Azure Web App for Containers looks like. 
Notice the `linuxFxVersion` variable... this is how we control the container image version.
If you're using a private container registry, then you might have to specify additional app settings with the docker username and password. 

```json
{
    "apiVersion": "2018-11-01",
    "name": "[parameters('name')]",
    "type": "Microsoft.Web/sites",
    "location": "[parameters('location')]",
    "dependsOn": [
        "[concat('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]"
    ],
    "properties": {
        "name": "[parameters('name')]",
        "siteConfig": {
            "appSettings": [
                {
                    "name": "DOCKER_REGISTRY_SERVER_URL",
                    "value": "[parameters('dockerRegistryUrl')]"
                },
                {
                    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
                    "value": "false"
                }
            ],
            "linuxFxVersion": "[variables('linuxFxVersion')]",
            "appCommandLine": "[parameters('dockerRegistryStartupCommand')]",
            "alwaysOn": "[parameters('alwaysOn')]"
        },
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', parameters('hostingPlanName'))]",
        "hostingEnvironment": "[parameters('hostingEnvironment')]",
        "clientAffinityEnabled": false
    }
}
```

Where the variable `linuxFxVersion` looks like this: 

```json
"variables": {
    "linuxFxVersion": "[concat('DOCKER|', parameters('fullImageTag'))]"
}
```

From the pipeline, you can easily upload the ARM template as artifacts using these two steps: 

```yaml
- task: CopyFiles@2
  displayName: "Copying IaC to artifacts directory"
  inputs:
    SourceFolder: 'iac'
    Contents: '**'
    TargetFolder: '$(Build.ArtifactStagingDirectory)'
- task: PublishBuildArtifacts@1
  displayName: "Publishing Build Artifacts"
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'iac'
    publishLocation: 'Container'
```
The _publishLocation_ means that it will be uploaded to Azure DevOps and associated with the pipeline. It has nothing to do Docker containers.

### Putting it all together

Feel free to take a look at [this repository](https://github.com/onetug/Codecampster/blob/master/pipelines/main.yml) for a completed pipeline publishing to a container registry and issuing an ARM deployment to update the image version. Within that repository, there's an [ARM template](https://github.com/onetug/Codecampster/blob/master/iac/armdeploy.json) you can use to deploy the azure web app. Alternatively, you can use the trick I described [here ](https://gaunacode.com/quick-and-dirty-arm-template)to create a nicely done ARM template.

Hopefully, you have all the pieces to have full CI/CD to work to this web app for container. 

## Side Note

Choosing a container registry is a big decision. It's going to be a central repository for the container images to be deployed and also their various versions. Whether you choose to pick Docker Hub or something like Azure Container Registry, please don't host your own container registry. 

The implications of hosting your own come down to this: if your container registry goes down, it could be catastrophic to your production and non-production systems. Consider making your container registry highly available, especially after your organization starts adopting containers more and more.
