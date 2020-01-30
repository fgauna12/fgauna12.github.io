---
layout: post
title: Detecting configuration drift programatically
tags:
  - devops
date: 2020-01-30T21:34:35.868Z
featured: false
hidden: false
comments: false
---
Once piece that is often overlooked in the CI/CD practices is config management. Even in scenarios where the application is deployed to production through automation, there can be cases where there's some manual involvement. This is often true for promoting new settings to production.

<!--more-->

Why? Because it's not a good idea to have secrets on source control, we store secrets/config values with pipelines, secret stores, or other services like Consul. Since they're not in source control, it's not easy to remember to retire configuration settings or *promote them.*

For example, a new developer adds a feature that requires a new configuration setting to be defined. The developer defines the new config setting manually in the staging environment but they don't have access to production. They forget to submit a ticket to promote the setting. Maybe, there's no formal process for this type of work. The deployment happens and the new setting is missed. The application now crashes because the setting is not defined.

## Creating some checks 

You can probably write a simple script to detect drift between config stores in various environments. For example, here's a script I wrote to verify that all the config settings have been promoted to production using Azure DevOps variable groups. 

```powershell
$organization = "<Azure DevOps Organization>"
$project = "<Your Team Project>"
$personalToken = "<Your Personal Access Token>"

$token = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($personalToken)"))
$header = @{authorization = "Basic $token" }

$sourceGroup = Invoke-RestMethod `
    -Method Get `
    -Uri "https://dev.azure.com/$organization/$project/_apis/distributedtask/variablegroups?api-version=5.0-preview.1" `
    -Headers $header `
| Select-Object -ExpandProperty value `
| Where-Object { $_.name -eq 'test' }


$targetGroup = Invoke-RestMethod `
    -Method Get `
    -Uri "https://dev.azure.com/$organization/$project/_apis/distributedtask/variablegroups?api-version=5.0-preview.1" `
    -Headers $header `
| Select-Object -ExpandProperty value `
| Where-Object { $_.name -eq 'prod' } 

$greenCheck = @{
    Object          = [Char]8730
    ForegroundColor = 'Green'
    NoNewLine       = $true
}

$redMark = @{
    Object          = [Char]10060
    ForegroundColor = 'Red'
    NoNewLine       = $true
}

$results = $sourceGroup.variables.PSObject.Properties | ForEach-Object { [PSCustomObject]@{
        Name      = $_.Name
        IsPresent = $_.Name -in $targetGroup.variables.PSObject.Properties.Name
    } }

$results | ForEach-Object { 
    $status = if ($_.IsPresent) { $greenCheck } else { $redMark };
    Write-Host @status
    Write-Host "  $($_.Name)"
}
```

It uses the Azure DevOps REST API to query the values in a variable group and compare them with a different variable group. 

In this example, we have a `test` and a `prod` variable group.  The script scans the `prod` variable group and marks any setting that doesn't yet exist like this: 

![Azure DevOps Variable Group Config Drift Example](/assets/uploads/variable_group_drift.png "Azure DevOps Variable Group Config Drift Example")


You could do something similar to check the existence of settings in Azure KeyVault or other secret stores. You could also extend to have this script run nightly. Even better, you could run this sort of check as part of your pipeline and fail the release if someone forgets to promote a config setting from a non-prod environment before it deploys to production.
