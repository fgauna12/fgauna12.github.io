---
layout: post
title: Meta automation
tags:
  - devops
date: 2020-01-25T03:44:19.975Z
featured: false
hidden: false
comments: false
---
Every now and then, there's a lot of manual work to do to introduce automation. Whatever the process - it can take a *while.* It can also be quite error prone. When the situation arises, automating the manual steps in the creation of automation can be quite useful. For giggles, let's call it *meta automation*.

<!--more-->

This can be especially true for items like *configuration settings*. One application can have many application settings. When implementing CD, you might move these settings out of source control and make them part of the pipeline. Alternatively, you might choose to publish them to a secret store like Azure Key Vault. This process can be quite mind-numbing and error-prone. 

For example, I recently had to move two older web ASP.NET applications to Azure App Services. They *each* had a large number of app settings in their `web.config` configuration files. So, I found myself mind-numbingly writing the same json/yaml snippets to parameterize these config settings. So, I chose to try something. I created a Powershell script to generate code snippets based on the existing config settings on the old config files so that I could paste them into my ARM templates, and pipelines. I later evolved them to upload them to the config store (Azure DevOps Variable Groups).

It took me the rest of the workday to complete the script and finish the parameterization of all the config settings programatically. If I did it manually, it might have taken me the rest of the day too. The difference is that now I have a *script* that I can run again to true-up and reload all the settings as they should be. Also, it lessened the likelyhood of making manual mistakes (I wrote *some* unit tests for these scripts).

If you're curious, [here's ](https://github.com/fgauna12/AppServiceMigrationScripts)what the final output looks like.

This technique of automating the automation process can be used in other ways too. For example, create scripts that generate test-case snippets pre-baked with data from the database when doing integration or functional tests. Or like the example above, create scripts that read a legacy config file and uploads the key/values to a config store.
