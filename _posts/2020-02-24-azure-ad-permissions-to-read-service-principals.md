---
layout: post
title: Azure AD permissions to read service principals
tags:
  - devops
  - azure
date: 2020-02-24T01:37:34.971Z
featured: false
hidden: false
comments: false
---
[Yesterday](https://gaunacode.com/azure-container-registry-and-aks-with-terraform), I wrote a guide on configuring an AKS cluster to pull down images from a private Azure Container Registry. I demonstrated this using Terraform. If you're like me, you'll want to run any automation using a pipeline so that there's no chance for manual mistakes. The problem: you'll need a service principal and there's a high chance service principal won't have enough permissions to interact with Azure AD.

<!--more-->

### More background

The Terraform documentation also warns you that your service principal will need additional rights to be able to read from Active Directory.

![](/assets/uploads/2020-02-23_20-45-52.png#center "Terraform documentation warning")

Otherwise, this would happen.

![](/assets/uploads/2020-02-23_20-48-47.png#center "Sample error message")

```
Error: Error listing Service Principals: graphrbac.ServicePrincipalsClient#List: Failure responding to request: StatusCode=403 -- Original Error: autorest/azure: Service returned an error. Status=403 Code="Unknown" Message="Unknown service error" Details=[{"odata.error":{"code":"Authorization_RequestDenied","date":"2020-02-23T05:10:39","message":{"lang":"en","value":"Insufficient privileges to complete the operation."},"requestId":"bla blah"}}]
```

### The solution

Go to Azure AD, then **Roles and Administrators**. 

Then select **Directory Readers**.

![](/assets/uploads/2020-02-23_20-41-53.png#wide "Select the Directory Readers group in Azure AD")

Then add your service principal that you're using to deploy.  The search box supports the application/client id.

Don't forget to save.

#### But why?

Out of the box, much like guest users in Azure AD, service principals can't list users or app registrations also part of the Azure AD directory. It's a security measure.  So if you're looking to list other objects in the directory with a service principal, you have to give it additional permissions to do so.

If you're looking to create service principals (i.e. app registrations), then you can also add this service principal to the **Application Administrator** group.

![](/assets/uploads/2020-02-23_20-39-03.png "Application administrator")
