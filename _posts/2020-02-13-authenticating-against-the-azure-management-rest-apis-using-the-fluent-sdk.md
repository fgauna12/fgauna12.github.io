---
layout: post
title: Authenticating against the Azure Management REST APIs using the Fluent SDK
tags:
  - azure
date: 2020-02-13T23:11:50.903Z
featured: false
hidden: false
comments: false
---
There's a nice [fluent sdk](https://docs.microsoft.com/en-us/dotnet/azure/dotnet-sdk-azure-concepts?view=azure-dotnet) by Microsoft to help developers manage their Azure resources through code. To be clear, it's not infrastructure as code. But, if you have a *need* where business logic and infrastructure meet, then you <mark>might have to provision compute/storage on the fly.</mark>

<!--more-->

As the docs state, you have to authenticate against the Azure Management API. They have a great helper library to help with this. 

```csharp
AzureCredentials _azureCredentials = 
  SdkContext.AzureCredentialsFactory.FromFile(Environment.GetEnvironmentVariable("AZURE_AUTH_LOCATION"));
```

This works great for most usecases. To issue commands exposed through the Fluent SDK. 

But, what if you want to issue an API call to the Azure Management API to invoke a newer feature? 

### Example

We had this need were we were scaling out virtual machine scale sets based on demand to a batch system. We were having to use custom decision to determine when to scale out. Very different your typical web-application scenario based on website load. We also had to scale the scale sets in when the system had lower demands.

So, we had to use a preview feature. We had to protect a virtual machine that's part of a scale set from a *scale-down operation*. We didn't want an active/non-idle instance to be de-provisioned for the batch jobs they were performing. 

This functionality was only available through a *protection policy* at the instance level. We had to issue a [REST API](https://docs.microsoft.com/bs-latn-ba/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-instance-protection) call to the Azure Management API. 

```
PUT on `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualMachines/{instance-id}?api-version=2019-03-01`
```

So, to accomplish this through the Azure Fluent SDK, we had to do the following:

```csharp
var body = new StringContent(@"
{
  ""properties"": {
    ""protectionPolicy"": {
      ""protectFromScaleIn"": false
    }
  }        
}
", Encoding.UTF8, "application/json");
var request = new HttpRequestMessage(HttpMethod.Put, new Uri(
    "https://management.azure.com/subscriptions/{azure.GetCurrentSubscription().SubscriptionId}/resourceGroups/{vmssGroup.ResourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmssGroup.Name}/virtualMachines/{randomMachine.InstanceId}?api-version=2019-03-01"))
{
    Content = body
};
//Add authorization header
await _azureCredentials.ProcessHttpRequestAsync(request, CancellationToken.None);
var protectionResponse =  await httpClient.SendAsync(request, CancellationToken.None);
```

\
Besides building a normal HTTP request and sending it through an \`HttpClient\`, we had to add an \`Authorization\` header using the same mechanism that the Fluent SDK uses underneath. \
\
It took some perusing through the open source repo for the fluent SDK, but ultimately it came down to this line:\
\
\`await _azureCredentials.ProcessHttpRequestAsync(request, CancellationToken.None);\`

The main \`AzureCredentials\` class used to authenticate with the fluent SDK has a method to decorate an \`HttpRequest\` object with the proper headers. \
\
That's it!
