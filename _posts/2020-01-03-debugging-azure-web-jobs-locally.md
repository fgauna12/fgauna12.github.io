---
layout: post
title: Debugging azure web jobs locally
tags:
  - azure
date: 2020-01-02T20:48:49.924Z
featured: false
hidden: false
comments: false
---
Recently, I wanted to move a Windows service to Azure using .NET Framework. It seems that the Azure Function team is pushing a lot of .NET Core right now. The new Azure Function [runtimes](https://docs.microsoft.com/en-us/azure/azure-functions/functions-versions) only support .NET Core. It makes sense since .NET Core and .NET Framework will be one framework in .NET 5. But **right now**, it means that it's a bit non-intuitive to host a scheduled job on Azure and we have to resort to older tech - web jobs.

<!--more--> 

I found this [beautiful nugget](https://github.com/Azure/azure-webjobs-sdk-extensions/wiki/TimerTrigger). It explains in depth how to ensure that the azure web job can run locally. 

To summarize, you first want to ensure each developer has their own storage account on Azure when developing locally. For some reason, you can't use the Azure Storage Emulator. If you try it, there will be an exception letting you know that it's not supported. On a different note, make sure that your environments don't share the same storage account otherwise you will run into trouble.

You also want to ensure you have an environment variable `AzureWebJobsEnv` with a value of `Development`. Note, you might have to restart Visual Studio for this take effect.

Don't forget, to ensure that you have the necessary code to initialize any extensions that you might be using through the `Microsoft.Azure.WebJobs.Extensions` package. For example, the following is an example of what I had to use in order to configure the `TimerTrigger`.

<pre><code class="language-csharp">
var config = new JobHostConfiguration();
            
if (config.IsDevelopment)
{
    config.UseDevelopmentSettings();
    config.Singleton.ListenerLockPeriod = TimeSpan.FromSeconds(15);
}

config.UseTimers();

var host = new JobHost(config);
// The following code ensures that the WebJob will be running continuously
host.RunAndBlock();
</code></pre>

Notice how in _development mode_ you can also set the `config.Singleton.ListenerLockPeriod` to 15 seconds. This is a tip per the wiki shared above.

All to sum up - azure web jobs are a little quirky. But, they do beat running Windows services on IaaS.
