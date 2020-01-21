---
layout: post
title: What azure is not great at
tags:
  - azure
date: 2020-01-21T03:49:12.770Z
featured: false
hidden: false
comments: false
---
I find Azure great for many things like Kubernetes, Serverless, PaaS, IaaS, and so on. It continues to grow and there's always new improvements. It's always becoming more rich and easier to use with Cloud Shell, the constant portal improvements, and other value-packed offerings like Azure Policy and Azure Security Center.

<!--more--> 

Should you look elsewhere? In my honest opinion, there's a few of these.The biggest one being the world of JAMStack.

[JAMStack](https://jamstack.org/) is an architecture in which you build web applications by creating static pages that are optimized to have data baked into them at build time. Therefore, if we can rely on our CI/CD pipeline to build our application often, we can push many of our concerns to *build time.* This blog is a great example of a JAMStack app. The blog posts are Markdown that get compiled to HTML at *build time* by [Netlify](https://www.netlify.com/). So, there's no need for me to have a Wordpress instance that leverages a database. I have no database for this blog. 

Great, so what's it like to create a JAMStack app on Azure? It's doable and it's not *too hard*. First, you ought to make a storage account with blob storage with [static website hosting enabled](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website). Secondly, you want to make a CI/CD pipeline probably using Azure DevOps. 

The pipeline would have to:

* Build the static site content using your preferred framework. In my case, it's Jekyll.
* Create a release pipeline that copies files to Azure Blob Storage.
* If you're using a CDN, you might want to purge the CDN too.

It's not a terrible amount of work and I'll probably write a blog post on how to do it in the future. **But**, when compared to how easy it is to do with Netlify, it's very cumbersome and painful. 

With the power of open source and Netlify, you can pick a starter template, create a pipeline, and push to your new Netlify-hosted website in less than 5 minutes. In my experience, it's mind-blowing fast and absurd how much easier it is than putting the pieces together on Azure. Also, Netlify is free.

How does Netlify do this? They focus on a small audience of the market. Not enterprises, not middle-sized companies, not companies with complex business processes. They cater to the hobbyist, to the freelancer web developer, to the designer who wants to create a fast, simple, and lightweight static website with automation. Hell, you can even publish a feature branch to a custom domain with a few clicks. It's just remarkable.

Azure is great. But, Azure does cater to the masses. It caters to the big/middle enterprises. It also appeals to start-ups. It's a huge audience. So, if you're looking to solve a very \_specific problem\_ with the least resistance, for very little money, then maybe there's other options. That's certainly the case for static website hosting.
