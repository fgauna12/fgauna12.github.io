---
layout: post
title: Pester test results on Azure DevOps
tags:
  - devops
date: 2020-02-14T11:17:51.595Z
featured: false
hidden: false
comments: false
---
You might or might not know this. You can publish test results from common unit test frameworks to Azure DevOps so that they're associated with a build. [Two days ago](https://gaunacode.com/an-alternate-to-postman-for-api-tests), I mentioned an alternative to Postman for creating functional API tests using Powershell and Pester (unit-testing module for Powershell). Here's a quick guide on how to publish Pester test results to Azure DevOps. 

<!--more-->

![Screenshot of test results for Pester using Azure DevOps](/assets/uploads/2020-02-14_6-19-17.png "Test Results from Azure DevOps")

### The Set-Up

The [official documentation](https://pester.dev/docs/usage/test-results/#azure-devops) talk about the solution. Here's the concrete implementation. 

First, when you run the pipeline task for Pester, you have to also generate test results. Pester supports various formats including NUnit format. 

```yaml
steps:
- powershell: |
     Install-Module -Name Pester -Force
     Invoke-Pester -EnableExit -OutputFile ./test-results.xml -OutputFormat NUnitXml
```

Then, once the NUnit test results are generated, use the `PublishTestResults` task to publish the test results to Azure DevOps.

```yaml
- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'NUnit'
    testResultsFiles: '**/TEST-*.xml'  
```

Tada! 

That's it.
