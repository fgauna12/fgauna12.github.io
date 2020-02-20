---
layout: post
title: Reading Terraform outputs from a YAML pipeline
tags:
  - devops
date: 2020-02-20T02:56:23.959Z
featured: false
hidden: false
comments: false
---
When using Terraform and YAML pipelines in Azure DevOps, it's not clear how to read the output variables of a Terraform configuration.

<!--more-->

### The basics

First, you have to name the task.

``` yaml
- task: TerraformTaskV1@0
  name: TerraformOutputs
```

Then, the task will store the output variables in a _json_ file in a certain file path. You can get this path through the `jsonOutputVariablesPath` variable. 

Then you can use this Azure DevOps task output variable and read the file then parse it for values. 

For example, here's an example using bash reading the `cluster_name` and the `resource_group_name` output variables from Terraform.

``` yaml

- bash: |
    CLUSTER_NAME=$(cat $(TerraformCluster.jsonOutputVariablesPath) | jq '.cluster_name.value' -r)
    RESOURCE_GROUP_NAME=$(cat $(TerraformCluster.jsonOutputVariablesPath) | jq '.resource_group_name.value' -r)

```

How this works is this:
- Using bash, we use the `cat` function to read the contents of the file
- Then, we _pipe_ the output to an utility called **jq** which will parse the raw string to json and allow us to filter its values
- Applying a **jq** filter, we look for the _raw value_ of those variables. For example: [see this snippet](https://jqplay.org/s/5PXsqvY2UQ)
- We assign the filtered value to a variable

### Pipeline Variables

Once the value is parsed, it can then be assigned to a pipeline variable. 
Here's how to do it from bash.

``` yaml
echo "##vso[task.setvariable variable=Outputs.ClusterName]$CLUSTER_NAME"
```
