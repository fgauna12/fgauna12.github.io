---
layout: post
title:  "Thinking about microservices? You need DevOps first"
date: 2019-06-09
categories: DevOps Microservices
tags: devops microservices
comments: true
featured_image_thumnail: assets/images/posts/2019/devops-1-640.jpg
featured_image: assets/images/posts/2019/devops-1-1280.jpg
---


With the rise of new virtualization technologies using containers, people are starting to think more and more about using microservices in their organizations. It’s definitely a topic that has been getting a lot of attention. Many of the top technology companies have attributed some of their recent success to microservices. Some of these companies include Netflix, Amazon, Uber, and Spotify. Every day these companies use hundreds of microservices to power their products and allows them to stay nimble.

## Microservices

What’s a microservice architecture?
A microservice architecture is the practice of building a large application with the use of multiple services working together. A business capability is developed end-to-end and encapsulated in a small service, i.e. a microservice. Each service also runs on their own process and communicates with other services using RESTful or queue-based protocols. All the database access, business logic, any other infrastructure code is encapsulated in one service with the purpose of fulfilling a business need.

### But why?
As an industry, we have gotten better at providing meaningful experiences for our users. Users see the value and request more features. However, our applications reach a point of diminishing returns. The law of diminishing returns teaches us that at some point in time, we will see diminishing returns for the amount of effort placed on development.

So how does a company continue to innovate and stay agile as products get larger? One solution is microservices. With this approach, you focus on developing business capabilities autonomously. Instead of having to orchestrate a large release to offer new features, a new business capability can be added by simply adding new service. Eventually, you end up creating microservices that can be developed, tested, deployed, and managed independently of other parts of the application.

## You need DevOps first
The world of microservices is so rich already that it’s easy to get enamored with its tools and technologies. We may try to shortcut our way to success by purchasing platforms and tooling centered around building microservices. One of the best ways to reduce the risk is to educate ourselves behind the principles of microservice and the role of DevOps within it. So here’s 3 reasons why you should start with DevOps.

### Reason #1: Conway’s Law
Conway’s Law states that a company will design systems that reflect how the organization communicates.
For instance, if your system is split into a front-end tier, a back-end tier, and a database tier, then it’s likely that there are a front-end, a back-end, and a database teams. So if your organization is structured in a way that does not mirror a set of independent and autonomous services, then it probably won’t be capable of building microservices. Could you build small services with large horizontal teams? Sure. But teams could very quickly be swarmed with micro-tasks in order to support a microservice architecture.

### Reason #2: Without DevOps, you might be worse off than before
If you don’t start with DevOps, teams can become less independent than they were before. Productivity can grind to a halt because development teams can’t deploy their code. Quality Assurance teams could become bottlenecks because all the untested code hitting their backlogs at once.

Defect count would soar because issues are not “reproducible.” Developers would have to develop with many services running at once because of the lack of automated testing. This would be highly cumbersome, especially with the addition of new services and new team members. Developers would have to interrupt each other constantly to help others troubleshoot and run their services.

### Reason #3: Microservices is just DevOps in practice
A microservice architecture is a natural progression of embracing DevOps. A successful DevOps practice results in continuous integration & delivery, automated testing, and applying monitoring and telemetry. There are many more benefits of DevOps but to touch on a few:

#### Continuous Integration & Delivery
Teams build and package their services without having to rely on other teams/departments in the company.
Teams release often and frequently without impacting other teams.

#### Automated Testing
Teams know immediately if there’s a regression in their service.
Teams are encouraged to write unit tests because that’s the quickest way to get feedback.

#### Advanced Monitoring and Telemetry
Issues are narrowed down to a microservice quickly, reducing the constant need for escalations to get issues resolved.
Teams become responsible for supporting their own service.
Teams get encouraged to experiment and improve their services while measuring their performance.