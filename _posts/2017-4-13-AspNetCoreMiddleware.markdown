---
layout: post
title:  "Understanding ASP.NET Core Middleware"
date: 2017-04-14
categories: ASP.NET Core Middleware
tags: aspnet-core
comments: true
---

The more time I spend writing ASP.NET Core applications, the more I begin to experience how extensible it is. Besides first-class usage of dependency injection, the middleware is one of my favorite features. Understanding how middleware works, will give you insight into the flexibility and simplicity of the new framework.

## Just Picture a Pipe

![Middleware Pipeline]({{site.baseurl}}/assets/middleware-pipeline.png#left)

Just picture a pipe. Each segment in the pipe is a middleware component that you wrote or someone else wrote. At the end of the pipe, the request is handled and a response is generated.

But this pipe is a special. This pipe also bi-directional. Meaning each middleware component will get called twice, once for a request coming in and once of the response going out.

## Characteristics of the Middleware

**Simplicity** - In ASP.NET core _everything_ is part the middleware pipeline. MVC, Authentication, Authorization, and mysterious NuGet packages that you decide to use will be part of the pipeline in some form or another. It's easy and simple to picture when code is going to get executed and you have full control in how it gets executed.

**Testability** - Unit testing middleware you write is very easy. Because middleware supports dependency injection and IoCs, you can leverage SOLID principles to avoid tight coupling to HTTP requests and other dependencies. ASP.NET Core even supports writing full integration tests by loading your API into memory and executing the pipeline from start to finish. We can thank the abstraction of the web server for this. 

## How to Use Middleware

Configuring the middleware is simple. Most of the information you need to find will be available from the [MSFT docs](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/middleware). I'll point out some of the things mentioned in the documentation and **I'll include references to a sample project that demonstrates the different concepts**.

The sample project is available on [GitHub](https://github.com/Nebbia/AspNetCoreDemo). Feel free to clone it or fork it and experiment with the pipeline.

### Creating a middleware component

First, the middleware is configured via the `Configure` method in `Startup.cs`. Everything in this method will determine what's in the pipeline. 
To create a middleware component, you use the `Use` method. You can do something with the request and then pass it on to the next component in the pipeline. 

``` csharp

    app.Use(async (context, next) =>
    {
        // Do something with the request
        await next.Invoke();
    });

```

### Determining the Order of Execution

The order of execution is **top to bottom**. Whichever middleware components you declare towards the top, will be executed first.

``` csharp

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //Middleware component 1
        app.Use(async (context, next) =>
        {
            // Will be executed first
        });

        //Middleware component 2
        app.Use(async (context, next) =>
        {
            // Will be executed second
        });

        //Middleware component 3
        app.Use(async (context, next) =>
        {
            // Will be executed third
        });

        // More components here
    }

```

_Try running the [AspCoreDemo.Middleware.OrderOfExecution](https://github.com/Nebbia/AspNetCoreDemo) project in Edge._

### Short Circuiting the Pipeline

To _"Short Circuit"_ the pipeline means that you want to stop the request from being processed further in the pipe. This technique is very useful when you want to validate a request and return immediately without the rest of the handlers being invoked.

There are two ways to short circuit a pipeline: 

#### 1. From your middleware, don't invoke the next middleware component. 

``` csharp


    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //Middleware component 1
        app.Use(async (context, next) =>
        {
            await next.Invoke();
        });

        //Middleware component 2
        app.Use(async (context, next) =>
        {
            await context.Response.WriteAsync("Short circuit! <br/>");
            /*
            * ---------------------------------------------------------------------------------
            * Short Circuit! because we're not calling the next middleware component via next.Invoke()
            * ---------------------------------------------------------------------------------
            */
            //await next.Invoke();
             await context.Response.WriteAsync("Bye!<br/>");
        });       

        //App Run
        app.Run(async (context) =>
        {
            await context.Response.WriteAsync("This will not run!...<br/>");
        });
    }

```
_Try running [AspCoreDemo.Middleware.ShortCircuit2](https://github.com/Nebbia/AspNetCoreDemo) in Edge_

#### 2. Use the `Run` method earlier in the sequence. 

If you call the `Run` method earlier in the execution, the rest of the pipeline won't execute.

``` csharp

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //Middleware component 1
        app.Use(async (context, next) =>
        {
            await next.Invoke();
        });

        /*
        * ---------------------------------------------------------------------------------
        * Short Circuit! because call Run() earlier in the pipeline
        * ---------------------------------------------------------------------------------
        */
        app.Run(async (context) =>
        {
            await context.Response.WriteAsync("Short circuit via Run()!<br/>");
        });

        //This never runs
        app.Run(async (context) =>
        {
            await context.Response.WriteAsync("This will never run!...<br/>");
        });
    }

```

_Try running [AspCoreDemo.Middleware.ShortCircuit](https://github.com/Nebbia/AspNetCoreDemo) in Edge_

### Environments

You may know already that the `ASPNETCORE_ENVIRONMENT` environment variable tells ASP.NET Core in which environment it's running under. If you set this environment variable to `Development`, `Staging`, or `Production`, you can use methods like `env.IsStaging()` or `env.IsDevelopment()` using your `IHostingProvider` dependency in the start up. 

When it comes to middleware, you can configure the pipeline depending on which hosting environment you're running under. 
There's two ways of doing this:

#### 1. Instead of using the `Configure` method, you can create a method that the environment name in it. (e.g. `Configure[ASPNETCORE_ENVIRONMENT]`)

``` csharp

    // For Staging Environment
    public void ConfigureStaging(IApplicationBuilder app, IHostingEnvironment env)
    {
        // Short Circuits the Pipeline
        app.Run(async context =>
        {
            await context.Response.WriteAsync("Completely different pipeline for staging!<br/>");
        });
    }

```

_Try running the [AspCoreDemo.Middleware.Environments2](https://github.com/Nebbia/AspNetCoreDemo) project in Edge._

#### 2. Use the `IHostingEnvironment` to customize your pipeline

``` csharp

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        if (env.IsProduction())
        {
            //Custom middleware for production
        }

        // More pipeline
    }
```

_Try running the [AspCoreDemo.Middleware.Environments](https://github.com/Nebbia/AspNetCoreDemo) project in Edge._

### Pipeline Branching

Pipeline branching is when you want to create a different pipeline after some point.
Most of the time, branching is used for creating different pipelines depending on the request URL coming in. 

For example, if you have a set of web APIs and an MVC app hosted within the same ASP.NET Core application, you can segregate the middleware if you branch all requests starting with `/api/`.

``` csharp
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //Some Middleware

        app.MapWhen(x => x.Request.Path.Value.Contains("/api"), appBuilder =>
        {
            //Middleware for requests starting with /api
        });

        //Middleware that will NOT BE RAN whenever a request contains /api
        app.Run(async (context) =>
        {
            await context.Response.WriteAsync("Running... This never gets called when path is /api<br/>");
        });
    }
```

_Try running the  [AspCoreDemo.Middleware.Branching](https://github.com/Nebbia/AspNetCoreDemo) project_


#### Conditional Use

Sometimes, you don't want to use branching because it will not continue to use the middleware configured later. In order words, it doesn't "merge" back with the original pipeline. If you simply want to configure some special middleware to be executed on occasion when some requirement is met, you can use the `UseWhen` method.

``` csharp

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //Middleware component 1
        app.Use(async (context, next) =>
        {
            await context.Response.WriteAsync("Middleware Component 1<br/>");
            await next.Invoke();
            await context.Response.WriteAsync("Middleware Component 1<br/>");
        });

        app.UseWhen(x => x.Request.Path.Value.Contains("/api"), appBuilder =>
        {
            appBuilder.UseSomeSpecialMiddleware();
        });

        //This will still execute when request contains "/api"
        app.Run(async (context) =>
        {
            await context.Response.WriteAsync("Running... This gets called even from /api<br/>");
        });
    }

```

_Try running the [AspCoreDemo.Middleware.UseWhen](https://github.com/Nebbia/AspNetCoreDemo) project in Edge._

