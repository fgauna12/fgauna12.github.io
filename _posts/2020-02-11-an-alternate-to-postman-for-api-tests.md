---
layout: post
title: An alternate to Postman for API tests
tags:
  - devops
date: 2020-02-11T02:06:36.536Z
featured: false
hidden: false
comments: false
---
[Pester](https://github.com/Pester/Pester) is a unit testing library for Powershell. With some creativity, Pester can be a great tool to write API tests. Perhaps, it can be more effective than Postman for .NET developers and those in the Windows ecosystem.

<!--more-->

### Making RESTful calls

Without Pester, making an API call can be fairly straight-forward.

```powershell
$response = Invoke-WebRequest -Method Get -Uri "http://someurl/api/orders" `
            -Headers @{'Authorization'= "Bearer $accessToken"} `
            | Select-Object -ExpandProperty Content `
            | ConvertFrom-Json
```

This example makes an API call to `/api/orders` and provides an access token as part of the header. From the response, we pipe the `Content` and we convert parse the JSON.  This is vanilla Powershell functionality.

*Side Note:* If you use your own homegrown authentication system on your API, you will have more flexibility to authenticate against it with Powershell. Postman only accepts [standardized and well known protocols](https://learning.postman.com/docs/postman/sending-api-requests/authorization/#no-auth).

### Pester

Pester provides the test runner and the assertion behaviors. So, instead of creating unit tests for testing Powershell code, we can leverage Pester to run our API calls and validate the responses.

Here's what a test could look like using Pester.

```powershell
Describe "Get Orders" {

    $response = Invoke-WebRequest -Method Get -Uri "http://someurl/api/orders" `
            -Headers @{'Authorization'= "Bearer $accessToken"} `
            | Select-Object -ExpandProperty Content `
            | ConvertFrom-Json
   
    It "Has results" {
        $response.values | Should -Not -BeNullOrEmpty
        $response.total | Should -BeGreaterThan 0
    }
  }
```

Here this test verifies that the data coming back has orders and that the values are not empty. Fairly simplistic. The API data would be something like `{ values: [{...}], total: 5 }`

The assertion happens through the `Should` function. It allows us to check Here's all the [assertions](https://pester.dev/docs/usage/assertions/) possible through Pester.

### Test from the pipeline

Once you have a nice test suite, you can also run these tests from your CI/CD pipeline. 

Using Azure DevOps, here's what the YAML could be when running on a hosted agent:

```yaml
steps:
- powershell: |
     Install-Module -Name Pester -Force
     Invoke-Pester -EnableExit
```



### So, why Powershell/Pester?

When using something like Postman, it's limited to only testing API calls. Also, in my experience it's easy to create Postman tests that they only use for local development. They're easy to forget about and hard to maintain. Even more so, it's rare that they're incorporated into CI/CD pipelines. \
\
Creating Powershell tests is a niche. Certainly, won't be effective for all .NET teams. 

If you're unfamiliar with Powershell, here's a great [PluralSight course](https://app.pluralsight.com/library/courses/everyday-ps/table-of-contents) that helped me.
