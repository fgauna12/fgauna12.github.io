---
layout: post
title: Choosing a feature flag platform
tags:
  - devops
  - architecture
  - azure
date: 2020-02-05T03:09:18.760Z
featured: false
hidden: false
comments: false
---
Yes, as more and more companies embrace Continuous Deployment, feature flags platform are becoming much more popular. I love feature flags, it's one of the coolest and more demonstrable aspects of DevOps. 

With all the noise, it can be overwhelming picking the appropriate solution. In some cases, if you have a very simple app like an ASP.NET Core site with a database, then look no further. Use the `Microsoft.FeatureManagement` [package](https://andrewlock.net/introducing-the-microsoft-featuremanagement-library-adding-feature-flags-to-an-asp-net-core-app-part-1/).

<!--more--> 

What if you want to coordinate the state of a feature flags across multiple services/apps? Then, you probably need a feature flag platform. <mark>A good platform will be highly resilient, has wide support across multiple languages, and has effective ways to manage its feature flags programatically.</mark>

## Optimizely

Optimizely is a plaform that is mostly aimed at marketers. I have worked with clients that were using this platform already because their marketing department wanted A/B testing.

Optimizely has wide support for feature flags in [multiple SDKs](https://docs.developers.optimizely.com/full-stack/v2.1/docs/install-the-sdk). Most interestingly to me, they offer JavaScript, .NET Core, and .NET Framework SDKs. So you are also able to add feature flags to legacy .NET applications. The potential is the ability to start re-writing features in-place from legacy apps. On the other hand, the `Microsoft.FeatureManagement` package only supports .NET Standard 2.0 and greater so it might be a bit more difficult to add support to a legacy app. 

As implied, they seem to cater less to engineering teams. It's an observation. I can't also seem to find an Infrastructure as Code solution. But, they do have an API. If you start using flags at scale, you might want to invest in a more declarative model of managing feature flags by using the API rather than relying on the portal all the time. 

Humans do make mistakes, regardless of how pretty the portal is.

The best part - Optimizely offers *free* feature flags. But, they don't advertise an SLA. If you want, you can pay for Premium Support.

## LaunchDarkly

The Azure DevOps team at Microsoft blogged about their usage of feature flags and how they've built their own platform. Their recommendation: don't build your own platform. Instead, [they recommend using LaunchDarkly.](https://docs.microsoft.com/en-us/azure/devops/learn/devops-at-microsoft/progressive-experimentation-feature-flags)

- Here's an [Azure DevOps lab](https://www.azuredevopslabs.com/labs/vstsextend/launchdarkly/) about LaunchDarkly. 
- Here's a [free e-book ](https://launchdarkly.com/effective-feature-management-ebook/)from LaunchDarkly that's a very good and short read.
- Here's an [Azure DevOps extension](https://docs.launchdarkly.com/docs/visual-studio-team-services-extension) for LaunchDarkly to map work items to feature flags already defined (in my experience, it's not super reliable).

LaunchDarkly also supports [multiple SDKs](https://launchdarkly.com/features/sdk/) including JavaScript, .NET Core, and .NET Framework. You'll also be able to use their SDKs on your legacy .NET applications. 

In contrast to Optmizely, the product seems to be more tailored towards engineers. They have a [fascinating article ](https://stackshare.io/launchdarkly/how-launchdarkly-serves-over-4-billion-feature-flags-daily)about how they've built the platform with extreme redundancy in mind. They also have natural circuit breakers in their SDKs so that if a feature flag doesn't exist or the service can't be reached, it defaults to some value. Lastly, they also have a [Terraform provider](https://www.terraform.io/docs/providers/launchdarkly/index.html) so that you can manage your feature flags declaratively.

LaunchDarkly is not free. They have a 30-day trial. They offer an SLA for the enterprise tier.

## Azure App Configuration

Azure App Configuration is a new service on Azure. It's still in Preview. It's free during the Preview. It also has no SLA. 

It's nice that it's on Azure. Less tools to use. The SDK is well-built because it was made by Microsoft. It also works well side by side with Azure KeyVault.

The main drawback with this service: it's not _mature_. Meaning, there's no support in other languages, especially JavaScript. Many applications today are built using Single Page Apps with back-end APIs. With Azure App Configuration, you can use feature flags from SPAs. From experience, this is extremely useful when having this type of architecture. 

Lastly, because it's not mature there's also no support for .NET Framework. Meaning, you won't be able to use this service unless you build your own class library to interact with the REST API. 

Although it's an Azure product and there is an Azure DevOps extension, there is no ARM template support. 

In my opinion, because it's free it could be effective for prototyping. It's unclear what the future holds for this service. Because feature flags are critical dependency, I value solutions that are mature/reliable and have an opportunity to reduce manual mistakes through automation.

*Edit*: they might have support for [JavaScript and Python](https://github.com/Azure/AppConfiguration#rest-api-reference) based on their GitHub repo. It's just not documented yet. Possibly not released either.

## Conclusion

Don't roll your own feature flag platform. When we take a dependency on a feature flag platform, our applications are likely going to see downtime if there's degraded services in our feature flag platform. Unless of course, the provider has circuit-breaking patterns built into their SDKs. 

Be smart about the risk. Choose a mature feature flag platform. It's a big decision. The ultimate value is worth it: being able to test in production, deploy often and safely, and releasing when you're ready.
