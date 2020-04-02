---
layout: post
title: Install IIS on Azure VM using Terraform
tags:
  - devops
  - azure
date: 2020-04-02T17:28:00.153Z
featured: false
hidden: false
comments: false
---
Creating a VM can be easy. Installing and enabling features on each new VM can be time consuming. Similar to yesterday, I will show how to install IIS to a VM or VMSS using Terraform.

<!--more-->

In order to install IIS on a new Windows VM, we'll use simple powershell.  The command is `Install-WindowsFeature -Name Web-Server -IncludeAllSubFeature -IncludeManagementTools`. This Powershell command installs IIS, all it's sub features, and IIS Management tools. 

We can execute this script using the [virtual machine custom script extension](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows). When the VM is being provisioned, this script will be run and it won't show as "running" until this script executes without issues.

To invoke this custom script with Terraform, it's quite simple.

```hcl
resource "azurerm_virtual_machine_extension" "vm_extension_install_iis" {
  name                       = "vm_extension_install_iis"
  virtual_machine_id         = azurerm_windows_virtual_machine.vm.id
  publisher                  = "Microsoft.Compute"
  type                       = "CustomScriptExtension"
  type_handler_version       = "1.8"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
    {
        "commandToExecute": "powershell -ExecutionPolicy Unrestricted Install-WindowsFeature -Name Web-Server -IncludeAllSubFeature -IncludeManagementTools"
    }
SETTINGS
}
```

The only weird syntax is the `settings` object. It's raw json, so you can provide the same parameters as specified on the [custom script extension documentation](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows#extension-schema).

You can also provide `protectedSettings`. They are for more sensitive items like a storage account key. 

```hcl
resource "azurerm_virtual_machine_extension" "vm_extension_install_iis" {
  name                       = "vm_extension_install_iis"
  virtual_machine_id         = azurerm_windows_virtual_machine.vm.id
  publisher                  = "Microsoft.Compute"
  type                       = "CustomScriptExtension"
  type_handler_version       = "1.8"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
    {
        "commandToExecute": "powershell -ExecutionPolicy Unrestricted Install-WindowsFeature -Name Web-Server -IncludeAllSubFeature -IncludeManagementTools"
    }
SETTINGS

protected_settings = <<PROTECTED_SETTINGS
    {
        "commandToExecute": "myExecutionCommand",
        "storageAccountName": "myStorageAccountName",
        "storageAccountKey": "myStorageAccountKey",
        "managedIdentity" : {}
    }
PROTECTED_SETTINGS
}
```

That's it!

If you're having errors troubleshooting the extension because it didn't work, there's a set of [troubleshooting tips](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-windows#troubleshoot-and-support) published by Microsoft.