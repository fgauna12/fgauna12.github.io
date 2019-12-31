---
layout: post
title: Think week outcome
tags:
  - culture
date: 2019-12-30T01:38:47.436Z
featured: false
hidden: false
comments: false
---
Earlier [this week](https://gaunacode.com/think-week), I mentioned how I was going to try my own version of a *think week*. During the course of two days after Christmas, I took some PTO to be able to focus and contribute to the Orlando Code Camp website. Unlike Bill Gates' think weeks, it was not purely thinking and reading. Instead, it was a refreshing time to think and contribute without disruptions and the stress of the daily life. I managed to see the problems with a fresh set of eyes. In the end, I was surprised how much I was able to accomplish without the meetings, interruptions, and ceremony of updating task boards.

<!--more--> 

Part of what was useful to me, came down to this - <mark>I gave myself permission to not crank out a bunch of code and show amazing finesse</mark>. So, I *stepped back* and looked at how other code camps are solving the problem. *Surely*, there was an easy way to do this. 

Every year, there are many code camps hosted by grassroots movements around the country. I searched for code camps around major cities and ran into the [Seattle Code Camp](https://seattle.codecamp.us). This website was fairly simple and it also struck me since it's using Sessionize for displaying the schedule and the agenda for the event. For them, they're simply using Squarespace to build the website and then using Sessionize for everything else. I got excited because we are already starting taking speaker submissions through Sessionize this year's code camp. We were already half way there.

**If** I would have tried to squeeze the work in after hours, during the weekends, or during plane rides, I would have put more pressure on myself to accomplish smaller tactical tasks during each small time-frame I had available. In order to "get it done," I would have done a lot of work during the course of time without stopping to ask:

> What problem am I trying to solve?

### Background

In the past, the Orlando Code Camp website was an ASP.NET Core web app. It was built using MVC and leveraging an Azure SQL database to serve the data. It managed speakers, sessions, and allowed organizers to assemble agendas. There was quite a bit of code and custom logic. It has custom authorization logic, a notion of user types like admins, speakers, and attendees. Also, it had some custom code to render an elaborate agenda. All in all, there was a lot of work put in by past volunteers.

For now, you can see the 2019 version of the website [here](https://2019.orlandocodecamp.com/).

### Why am I contributing?

In the past couple of years, I have attended Orlando Code Camp and it bugged me that the website was not very mobile friendly - especially for checking out times/rooms the day of the event. I figured I certainly not the only person struggling with this since there's usually about ~600 attendees that register each year. Besides, it's an event for software developers by software developers... it just had to look better.

If you're curious, you can see the final contribution [here](https://github.com/onetug/Codecampster/pull/58).
