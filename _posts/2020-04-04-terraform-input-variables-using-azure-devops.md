---
layout: post
title: Terraform input variables using Azure DevOps
tags:
  - devops
date: 2020-04-04T03:52:49.203Z
featured: false
hidden: false
comments: false
---
Did you know pipeline variables in Azure DevOps YAML pipelines get mapped to environment variables in the pipeline agent? On the other hand, any input variable that starts with `TF_VAR_` will get mapped to an input variable in Terraform. Combining the two can mean more succinct pipelines.

<!--more-->

## Azure DevOps

So, variables in Azure DevOps pipelines get mapped to environment variable. There's one catch, it will always be uppercase. 

```yaml
variables:
  someVariable: 'someValue'
```

The variable `someVariable` becomes an environment variable named `SOMEVARIABLE`.

There is also another catch. Secrets won't get mapped to environment variables for security reasons. For example, 

```yaml
variables:
  someVariable: '$(SomeConnectionString)'
```

Assuming that `SomeConnectionString` is a pipeline variable stored as a secret, 

## Terraform

Let's say you have the following variables.

```hcl
variable "app_name" {
  type = string
}

variable "location" {
  type = string
}

variable "environment" {
  type = string
}
```

When we seek to perform a `terraform plan` and then `terraform apply`, we can specify the values of the variables using the `-var` flag. 

```bash
terraform apply -var "app_name=someapp"
```

Also, we can specify its value by defining an environment variable that starts with `TF_VAR_`. This way, there's no need to override with flags. 

```bash
# Assuming an environment variable TF_VAR_app_name is already defined
terraform apply
```

## Combining the two

So, if we define Azure DevOps pipeline variables with a prefix of `TF_VAR_`, they will get mapped into environment variables that Terraform will pick them up.

```yaml
variables: 
  TF_VAR_APP_NAME: 'someapp'
```

Then, in your Terraform configuration, you have to define the variables with <mark>capital letters</mark>. Why? Because Azure DevOps will always transform pipeline variables to uppercase environment variables.

```hcl
variable "APP_NAME" {
  type = string
}
```

Except, this won't work for Azure DevOps pipeline variables saved as secrets.  For secrets, you will still have to pass them as variables. For example:

```yaml
- task: TerraformTaskV1@0
  displayName: "Terraform Plan"
  inputs:
    provider: 'azurerm'
    command: 'plan'
    workingDirectory: '$(System.DefaultWorkingDirectory)/iac/'
    environmentServiceNameAzureRM: $(AzureServiceConnection)
    commandOptions: -input=false -var "VM_ADMIN_PASSWORD=$(TF_VAR_admin_password)"
```

`TF_VAR_admin_password` is a pipeline variable saved as a secret. 