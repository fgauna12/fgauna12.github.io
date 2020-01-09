---
layout: post
title: Enforcing resource group tags
tags:
  - azure
date: 2020-01-09T02:14:17.990Z
featured: false
hidden: false
comments: false
---
Resource group tags can be very useful. It can be one those things that you don't realize that you need it *until* you wish you had it. One of those moments might be *billing*.

<!--more-->

Resource group tags are an additional data point that can help with optimizing costs on Azure. They could be useful to grouping resources together based on environment, application tier, cost center, or in like in our case - clients.

But, they do have a caveat. For them to be practical, they are most effective as part of Infrastructure as Code (IaC) deployments. Even more so, they will be best when using IaC deployments from CI/CD pipelines so that we can ensure they're always there. When we use IaC, we don't have to depend on someone maintaining these tags manually. Also, we don't have to remember to apply them to *all* environments.

There's also [Azure Policy](https://docs.microsoft.com/en-us/azure/governance/policy/overview). It can help us remember to apply tags when we're creating those IaC templates. From the portal, one of the easiest Azure Policies to play with *is* enforcing the creation of tags on resource groups. They can be set to *enabled/disabled* which are more like *active/passive*. `Enabled` will forbid the creation of a new resource group when it violates the policy. `Disabled` will show as a compliance issue but won't stop the creation of a resource group. So, we can create Azure Policies that are \`Enabled\` to check for the existence of a particular tag on resource groups before they get created. 

For more detailed information, there's this [extensive blog](https://sharegate.com/blog/everything-you-need-to-know-about-resource-tagging-in-azure) post that dives much deeper into this topic. They talk about Azure Policy for a bit.  If you want to know more about Azure Policy, here's a video from a talk given during [MS Build](https://youtu.be/dxMaYF2GB7o).
