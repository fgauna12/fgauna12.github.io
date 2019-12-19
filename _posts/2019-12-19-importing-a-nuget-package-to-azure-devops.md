---
layout: post
title: Importing a NuGet package to Azure DevOps
tags:
  - devops
date: 2019-12-19T01:41:19.521Z
featured: false
hidden: false
comments: false
---
Sometimes, when first adopting Azure DevOps, you might find out about Azure Artifacts. With Azure Artifacts, you can host your NuGet packages (along with other package types) securely and easily. You end creating a *feed*. Then, it's also easy to restore packages from your Azure DevOps pipelines.

<!--more-->

## Pre-Requisites

* [Create an Azure DevOps feed](https://docs.microsoft.com/en-us/azure/devops/artifacts/get-started-nuget?view=azure-devops)
* NuGet CLI - I like to use \[Chocolatey] to install it

## The Work

Once you have the NuGet CLI, upload a test package. Borrowing the instructions from [this MSFT doc](https://docs.microsoft.com/en-us/azure/devops/artifacts/nuget/publish?view=azure-devops#get-or-create-a-sample-package-to-push) with a small modification for Azure DevOps.

```powershell
nuget install HelloWorld -ExcludeVersion
nuget push -Source {NuGet package source URL} -ApiKey key HelloWorld\HelloWorld.nupkgnuget.exe
```

NuGet will probably ask you to login so that it can authenticate against Azure AD to use Azure DevOps. Once authenticated, you'll see the package in the feed. 

Lastly, you want to find the `.nupkg` file for the package you want to upload. On older .NET Framework projects, there's usually a `packages` folder next to the solution file. If you're moving from a self-hosted NuGet server, you might be able to fish the package from there. 

Once you find the `.nupkg`, you can upload the package to Azure DevOps using the same method. 

```powershell
nuget push -Source {NuGet package source URL} -ApiKey az {your .nupkg file} 
```
