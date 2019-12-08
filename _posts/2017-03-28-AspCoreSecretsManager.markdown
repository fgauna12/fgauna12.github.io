---
layout: post
title:  "Shhh, keep your secrets to yourself in ASP.NET Core"
date: 2017-03-28
categories: ASP.NET Core
comments: true
---

Azure provides wonderful PaaS options for developers, especially those using .NET. In many cases, services like Azure Service Bus, require connection strings and secured tokens used to authenticate our applications. If you want to make your repository publicly accessible, it is not a good idea to include these connection strings and other sensitive bits of information as part of the source code.

## Microsoft to the Rescue

Thankfully, with the newcoming of ASP.NET Core, there's a project called **[Secret Manager](https://github.com/aspnet/DotNetTools)** that lets you manage these secrets via command line so you don't have to include them in the source code. Then you can load these secrets into your ASP.NET Core app using a NuGet package.

### 1. Install the Secret Manager CLI

Right click on the project that you want to use these secrets against. Then edit the `.csproj` of the ASP.NET Core app and add the following item group:

``` xml
<ItemGroup>
    <DotNetCliToolReference Include="Microsoft.Extensions.SecretManager.Tools" Version="1.0.0" />
</ItemGroup>
```

Also generate your own Guid and add it as follows:

``` xml
<PropertyGroup>
    <UserSecretsId>{Your Guid}</UserSecretsId>
</PropertyGroup>
```

Then using the command line, navigate to project directory and use the .net CLI:

```
    dotnet restore
    dotnet user-secrets --help
```

### 2. Create your secrets

Start storing your secrets! Like the `--help` command indicated, you can use the `set` command to start storing away.

```
    dotnet user-secrets set AppConnectionString SomeAmazingConnectionString
```

The `set` command just takes in a key-value pair where the key is the secret and the value is the secret value.

You can check it stored properly by running the `list` command.

```
    dotnet user-secrets list 
```

### 3. Consume your secrets 

Install the `Microsoft.Extensions.Configuration.UserSecrets` NuGet package.

Then in the `Startup.cs` file, add the following to the configuration builder:

``` csharp
    builder.AddUserSecrets<Startup>();
```

Lastly, you can use the `IConfigurationRoot` instance to consume your secrets when setting up the dependency injection or the middleware. 

For example:

``` csharp
 var myConnectionString = Configuration["AppConnectionString"]
```

## Caveats

1. **Secrets are not encrypted**. What this tooling buys you is the ability to manage configuration settings that you don't want to have in your source code repository.

2. When working with others, you're going to have to share these secrets with them. At this point you might consider the Azure Key Vault or using a tool like LastPass.

3. ASP.NET Core projects hosted by Service Fabric might not work with this. Because of the way that configuration works in service fabric, even setting the `ASPNETCORE_ENVIRONMENT` environment variable was a challenge and it wasn't as straight forward as editing it from the project settings.

*EDIT 4-6-2017* - Added a 3rd Caveat and clarified how to use the `set` command