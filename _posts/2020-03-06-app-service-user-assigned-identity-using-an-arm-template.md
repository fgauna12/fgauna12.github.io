---
layout: post
title: User Assigned Identity using an ARM template for an App Service
tags:
  - azure
date: 2020-03-06T02:56:55.604Z
featured: false
hidden: false
comments: false
---
[Managed identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) on Azure are great. No need to store client secrets corresponding to a service principal. Instead, we let Azure worry about that. We can let compute resources (like app services) authenticate against Azure AD to use other Azure resources securely. 

There's [two flavors](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview#how-does-the-managed-identities-for-azure-resources-work) of managed identity. *User assigned* and *system assigned* managed identity. The main difference is that with *system assigned* identity only lives with the lifetime of the associated resources. With *user assigned* identity, the identity lives on regardless if the main resource gets destroyed. 

Here's a quick guide on how to use *user assigned* with an app service through an ARM template.

<!--more-->

First, create a variable or parameter for the name of the user assigned managed identity.

```json
"variables": {
  "identityName": "some managed identity name"
}
```

Personally, I like to concatenate the name using the app service name.

```json
"variables": {
  "webAppPortalName": "some name",
  "identityName": "[concat(variables('webAppPortalName'), '-identity')]"
}
```

Then, create the user assigned managed identity resource. 

```json
{
    "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
    "name": "[variables('identityName')]",
    "apiVersion": "2018-11-30",
    "location": "[resourceGroup().location]"
}
```

Then, from the app service (`Microsoft.Web/sites`), reference the value of the managed identity. Note, you'll have to ensure you have a `dependsOn` attribute to signal Azure to daisy chain the creation of the resources. Next, you'll have to specify a `identity` object on the app service resource.

```json
{
      "apiVersion": "2018-11-01",
      "type": "Microsoft.Web/sites",
      "kind": "app",
      "name": "[variables('webAppPortalName')]",
      "location": "[parameters('location')]",
      "identity": {
          "type": "UserAssigned",
          "userAssignedIdentities": {
              "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('identityName'))]": {}
          }
      },
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('appServicePlanName'))]",
        "[resourceID('Microsoft.ManagedIdentity/userAssignedIdentities/',variables('identityName'))]"
      ]
    }
```

That's it!

If you're interested in the full sample, here's the quickstart [sample repo](https://github.com/fgauna12/AzureQuickstartUserAssignedManagedIdentity) I created.