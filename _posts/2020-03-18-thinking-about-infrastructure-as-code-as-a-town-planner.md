---
layout: post
title: Thinking about Infrastructure as Code
tags:
  - devops
  - azure
date: 2020-03-18T01:32:22.033Z
featured: false
hidden: false
comments: false
---
I'm not a town planner. I did go through a phase of being pretty addicted to a game called [City Skylines](https://store.steampowered.com/app/255710/Cities_Skylines/). In this post, I'll draw some connections in my "pretend town planner experience" with building complex multi-application infrastructures using code.

![](/assets/uploads/citi-skylines-2.jpg "City skylines screenshot")

<!--more--> 

In this game, you start with a huge field. In this field, you'll have a highway with traffic already flowing. The idea is that you will build a town where there's people coming into your city and staying. 

On of the first things they do is walk you through creating a road that connects to the highway. This way, newcomers can start to come into your town. Next, you start creating *zones* along the roads so that residents can build different things. You have the choice to zone for commercial, residential, and industrial zones.  With each zone, there's various choices like having residential buildings far from industrial zones so that there's less noise and traffic for residents. 

Fast forward. Eventually, I always hit some growing pains.  Here's one thing that usually sucked: re-routing roads and re-zoning. I did not want to change these things. I did not particularly enjoyed creating roads. What I really wanted was to create *huge* skyscrapers. In order to get there, I needed efficient roads to be able to sustain the population.

## Infrastructure as Code

There's different types of infrastructure. Some infrastructure that we want to change often and some that we don't. So, how do we structure infrastructure as code? 

### Networks and roads

Network layouts are like the roads in town planning. Pointing out the obvious, this is the pathways to which we will connect buildings together and expose them to the outside. More importantly, much like roads, re-designing and re-building networks *later* is much more painful. Also, it's highly *unlikely* that after the network is established, that it will change often.

It can be effective have an infrastructure repository that cohesively declares the networking design using code. Changes to the infrastructure repo could have different policies, more approvals, more strict reviews. Changes to the infrastructure could have a huge impact radius. It could affect all the applications in the system.

Another benefit of having a separate repository for core infrastructure like networking is deployment speed. By keeping the infrastructure that doesn't change often separate from the applications, we can iterate on the applications much more quickly and safely. Less risk.

### Buildings and applications

Applications are like buildings. Applications can *expect* that the core infrastructure like networks will exist. With this approach, deployments of applications become simpler. The code that defines the infrastructure for the application can be scoped to just what's immediately necessary. The infrastructure code can be committed and source-controlled with the application.  The infrastructure code can be run with the application code each time. \
The combination of the infrastructure as code, the application code, and the pipeline become the blueprint for the building.