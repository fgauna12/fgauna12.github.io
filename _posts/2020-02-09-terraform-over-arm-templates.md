---
layout: post
title: Terraform over ARM templates
tags:
  - devops
  - azure
date: 2020-02-09T00:33:58.767Z
featured: false
hidden: false
comments: false
---
I work strictly on Azure. I don't use other cloud providers except when I'm helping clients move away from say... AWS. For many years, I've used ARM templates as the Infrastructure as Code tool of choice. They're powerful and they do the job. But, lately others have been telling me about the amazingness of Terraform... even for when just using Azure. 

<!--more-->

### Terraform is succinct

I didn't have to spend a whole lot of time trying to understand the syntax of HCL. Mostly, because the language is not verbose like JSON. JSON was an improvement to XML. YAML is an improvement to JSON and so is HCL.

Large ARM templates [can be monstrous.](https://www.yobyot.com/azure/example-arm-template-azure-sql-vcore-failover-group-elasticpool/2020/02/04/#Azure-SQL-Database-Sample-Arm-Template-File)

Also, it's quite painful and often in practical to split ARM templates into multiple files. In order to deploy linked ARM templates, they have to be uploaded to blob storage first. I find it annoying.

With Terraform, it's quite easy to add new files and break out infrastructure into smaller pieces. I'm quite tempted translate the nasty ARM template linked above to Terraform.

### [](https://www.yobyot.com/azure/example-arm-template-azure-sql-vcore-failover-group-elasticpool/2020/02/04/#Azure-SQL-Database-Sample-Arm-Template-File)Terraform has providers

I talked about [](https://gaunacode.com/terraform-for-the-other-things)[](https://gaunacode.com/terraform-for-the-other-things)[yesterday](https://gaunacode.com/terraform-for-the-other-things) how Terraform buys you the flexibility to provision resources outside of Azure. Realistically, even if you don't use other clouds like me, there's still some pieces of infrastructure that are outside of Azure. A great example is DNS configuration.

### Terraform has modules

I ran into this great talk on [YouTube](https://www.youtube.com/watch?v=RTEgE2lcyk4) about lessons learned for writing lots of Infrastructure as Code. He emphasized the power of creating many small modules so that each component is testable. I agree and especially when there's automated tests that test each piece of infrastructure through small integration tests.

Here's a nice [guide](https://blog.gruntwork.io/how-to-create-reusable-infrastructure-with-terraform-modules-25526d65f73d) by the same speaker.

### Terraform has state

It can be a double edged sword. But Terraform keeps track of all the resources it creates through a state file. Assuming you follow [best practices for it](https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa), then there's power to it. 

`terraform destroy`

Destroy all the resources created by Terraform? What!

With ARM you have to delete the entire resource group.
