---
layout: post
title: Enabling copy/paste on an Ubuntu VM on VMware Workstation
tags:
  - miscellaneous
date: 2020-08-31T13:52:03.511Z
featured: false
hidden: false
comments: false
---
This is a bit of a miscellaneous post. 
I've had some trouble making my copy/paste work on a Ubuntu VM and hopefully it will help someone. 

## Installing VMware tools

First, make sure you have VMware tools installed.

``` shell
sudo service vmware-tools status
```

If it's not installed, then first make sure you **don't** have the open-vm-tools installed.

``` shell
sudo service open-vm-tools status
```

If you do have it installed, uninstall it.

``` bash
sudo apt-get remove open-vm-tools
sudo apt-get remove --auto-remove open-vm-tools
sudo apt-get purge open-vm-tools
sudo apt-get purge --auto-remove open-vm-tools
sudo reboot
```

Then, after your computer reboots, you can install the VMware tools.
<mark>If you didn't have open-vm-tools, you can skip to this step.</mark>

Click on Virtual Machine > Install / Update / Reinstall VMware Tools.
Extract the VMware Tools tar to the Desktop and follow the below commands.

``` bash
cd Desktop/vmware-tools-distrib
Run this command to install VMware Tools:
sudo ./vmware-install.pl
```

Follow the prompts to install. I picked the defaults.

Reboot your computer and copy/paste should work with the default window manager.

## i3

If you use i3 as a window manager, go to the i3 config at `~/.config/i3/config` and add the following line at the end. (This assumes you already had an i3 configuration file created).

```
exec --no-startup-id vmware-user
```

Log out and log back in.

That's it! Goodluck!
