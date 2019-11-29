---
layout: post
title: 'Taking a Lamborghini through a sidewalk '
categories: DevOps Kubernetes
date: 2019-11-29T20:37:06.966Z
featured: true
hidden: true
featured_image_thumbnail: ''
featured_image: /assets/uploads/lamborghini-2137815_640.jpg
comments: false
---
The other day I spoke to some folks and they were wondering if they should use Service Fabric - Microsoft's orchestrator. I get it. It powers a sizable chunk of Azure. Microsoft has been successful with it. 

First, I was surprised to hear that some people are still considering Service Fabric even when Kubernetes is pretty much the industry standard for orchestration. 

Secondly, I was surprised to hear that such a small team was seeing the platform as appealing. They were charmed by the complexity, the power, the bells and whistles, the idea that they too could be like Microsoft. 

<!-- more--> 

Regardless of Kubernetes or Service Fabric, I hear that often. Developers and architects becoming enamored by the complexity of these platforms - even when they don't have the problems these platforms solve. 

Lamborghini's like Service Fabric and Kubernetes are accessible and we get excited. We want to say we drove a Lamborghini. But, we don't stop to think where we need to go and how to best get there.\
\
But if you read the [Site Reliability Engineering](https://www.amazon.com/Site-Reliability-Engineering-Production-Systems/dp/149192912X/ref=sr_1_4?crid=RGG8BLOCXFXU&keywords=site+reliability+engineering&qid=1575060537&sprefix=site+reliab%2Caps%2C145&sr=8-4) book, you'll understand how Google thinks about running production systems and you'll start to see the ideas that inspired Kubernetes. They want to reduce the repetitive tasks and take a developer's mindset to the operations' job. They understand that 100% availability is impossible and the more available an application is, the more costly and less agile it will become.

So, if the path ahead of you is not a highway, instead it's a sidewalk, don't take a Lamboghini on a sidewalk because you've seen Google and Microsoft racing. If you have a sidewalk, use a skateboard, or a scooter, or just put some running shoes on.

If the application you're working on will only be used at most 100 times a day and the business won't lose significant revenue if it goes down for a day, you have a sidewalk. 

If you're using Kubernetes because it's a green-field project and this is your chance to push new technology, but the product hasn't been proven in the market and the company hasn't committed to it long-term, you have a sidewalk. 

If the application you're working on won't have on-going development for a while and there's no need to deploy without downtime, then you have a sidewalk.

Kubernetes is more than just another new tool or framework - it's a platform. You're going be asking a lot of people in your company to learn a lot of new things. Choose wisely - there's plenty of new things to learn.
