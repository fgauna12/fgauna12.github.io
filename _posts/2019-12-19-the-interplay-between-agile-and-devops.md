---
layout: post
title: The interplay between Agile and DevOps
tags:
  - devops
date: 2019-12-19T22:09:55.514Z
featured: false
hidden: false
comments: false
---
I hear it often. Companies looking to adopt agile so that they can move faster. To streamline their slow processes. To improve the quality of software they build. What happens if a company tries to adopt Agile without DevOps? What if they have neither? Which one should they focus on first?

<!--more--> 

## Personal anecdote

Speaking from a personal experience, prior to knowing what DevOps was, I worked on a project in which we followed Scrum to the book to develop a line of business application. We did all the ceremonies. We had a dedicated Scrum master facilitating. We spoke to the product owner from the business often. 

A year an half later, we release the software to production for the first time. The system was riddled with bugs, riddled with performance issues, and riddled with feature gaps where our users could not do their daily jobs. We had an influx of bugs, **over 800**. Then we couldn't keep up, test, and release the fixes fast enough for our users. It was a nightmare.

Retrospectively, we had accumulated a year and half of work. The amount of Work In Progress was enormous - it was bound to fail. Scrum or waterfall, it was the lack of testing in production with real users that ultimately prevented us from learning incrementally. We had developed a system using Scrumfall.

For a year and half, we were laser focused on accomplishing more arbitrary "user stories" and ensuring that we met the definition of done. Our definition of done, was deploying a story to QA and having our QA resource validate it. It was all based on information that went on a ticket. 

## What it could have been

First, if we were releasing to production often, we could have found creative ways to test with real users and validate that they could do their jobs. We could have also started learning about the complexity of the business rules, learned how to effectively automate the testing, and streamline the value delivery to production so that we are able to deploy quickly and safely. 

Moral of the story - if you're wanting to adopt Agile and DevOps, start with DevOps. Once you are able to have a streamlined way of delivering software and learning from production, you will be in a much better place to adopt Agile. Especially when you set the *definition of done* to deploying a user story to **production**. Avoid Scrumfall.
