---
layout: post
title: Taking CKA/CKAD as a past .NET developer
tags:
  - devops
  - kubernetes
date: 2020-08-18T10:30:25.663Z
featured: true
hidden: true
featured_image: /assets/uploads/photo-1504639725590-34d0984388bd.jfif
comments: false
---
Last week, I got the great news that I passed the Certified Kubernetes Administrators (CKA) exam. A few months ago, I had passed the Certified Kubernetes Application Developer (CKAD) exam. I found both exams to be challenging, yet fun and rewarding. This post shares my experience and my take on how to get ready as a .NET developer.

<!--more-->

I think prepping for the CKA or CKA without any past Linux experience will be hard - harder than most other types of developers/admins. <mark>So, be patient and diligent.</mark> I love Kubernetes and I think it's the present and future. Yeah, I think it's worth it.

## Background

I was once a traditional .NET developer working at an enterprise. I used Windows and Visual Studio Code to build solutions using C# and .NET. In that realm, I rarely used the command line and I lived in Visual Studio, *clicking around*. It wasn't until Node and SPA frameworks like Angular that started to become very popular where I started to use the command line more. 

## The Pre-Requisites

It was invaluable to be comfortable with the **command line** and with Docker well before taking the exam. Years before taking the exams, I have been using Docker and PowerShell in production. I highly recommend [this course](https://app.pluralsight.com/library/courses/everyday-ps/table-of-contents) to get you acquainted to using PowerShell in every day workflows.

What's also useful is an understanding of **Unix basics**. Windows and Unix/Linux have very different methodologies. Having a context around Unix/Linux is extremely beneficial to understand - even if you just want to be a developer building app on Kubernetes. A friend of mine gave me [this book](https://www.amazon.com/Linux-Command-Line-2nd-Introduction/dp/1593279523/ref=sr_1_3?crid=1WSGF5Q0OO0V0&dchild=1&keywords=the+linux+command+line&qid=1597757164&sprefix=The+Linux+Command%2Caps%2C163&sr=8-3), it's a warm introduction into this world.

Lastly, having a strong understanding of Docker is fundamental. It will only be useful in building containerized apps. I recommend all of Nigel's courses, including the Kubernetes ones:

1. [Docker Getting Started](https://app.pluralsight.com/library/courses/docker-getting-started/table-of-contents)
2. [Docker Deep Dive](https://app.pluralsight.com/library/courses/docker-deep-dive-update/table-of-contents)
3. [Kubernetes Fundamentals](https://app.pluralsight.com/library/courses/docker-kubernetes-big-picture/table-of-contents)

## The CKAD

I think, the most important aspect of taking the exam is time-management. Questions are weighted (they show you the weight) and so it's very risky to spend a lot of time on a questions that is not weighted high. I did not pay attention to this during the CKAD. 

If you read other experiences and hear other opinions, most will say that the CKA is the hardest. In my experience, CKAD was the hardest. Both tests are hands-on, night and day difference from the multiple-choice/case-study questions from the Azure certifications.

The test was 2 hours long and I ran out of time. I did not get to finish two questions. 
I got an 84 on the exam. 

Before the test, I spent a little less than a week preparing. My preparation was [Mumshad's course on Udemy](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/). The practice exams were amazing. 

<mark>Practice practice practice</mark>. During the practice, I felt like I was sharpening my Vim skills than anything else. Vim is essential to the test because you don't have other editors given during the test.

In the end, I think I had a harder time with the CKAD because I ran out of time and I had less practice than when taking the CKA.

## The CKA

During the CKA, I finished an hour early and had time to go back to two questions I half-answered. In the end, I ended the exam half-hour early after having gone through all my answers. I think the difference was the amount of practice.

Leading up to the exam, I also used [Mumshad's course on Udemy](https://www.udemy.com/course/certified-kubernetes-application-developer/). This time, I practiced and practiced and practiced. I ran through the lightening test 5 times and each of the practice tests two times. I also went through Kubernetes the Hard Way, slowed down to learn Vim shortcuts along the way, and installed a cluster using Kubeadm.

## The miscellaneous

I received the CKAD test results within two hours. But, for the CKA, it was a full 48 hours. A couple of days after you get the certificate, you're also awarded the pretty badges. 

<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="bd51ffc4-4b4d-4533-951f-b8d56be49de1" data-share-badge-host="https://www.youracclaim.com"></div><script type="text/javascript" async src="//cdn.youracclaim.com/assets/utilities/embed.js"></script>

<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="4782ece5-1f6b-4399-9800-e395455b0a9c" data-share-badge-host="https://www.youracclaim.com"></div><script type="text/javascript" async src="//cdn.youracclaim.com/assets/utilities/embed.js"></script>

As part of taking the exams, I had to sign an agreement that I would not discuss the questions in the exam. But, during Mumshad's courses, he explains a lot of useful tips when taking the exam like using *imperative* commands instead of bothering with creating YAML files to save time.

## Conclusion

Both exams are very challenging and rewarding. Please note, as part of my day job, I used Docker and Kubernetes in production for a while before taking the exams. The problem I had with learning something organically (based on need), that I had knowledge gaps. Everyone has them. But, getting ready for the exams helped me find those gaps and fill them. 

If you're a traditional .NET developer and want to jump on the cloud-native/Kubernetes bandwagon, you have a lot of work to do. This is especially true if you don't have Linux/scripting/Docker skills. Personally, I think it's one of the best things you could do for your career. Take it slow.

<mark>Too many times have I seen teams adopt too much at once</mark>. Teams that were once  stagnant with old tech _now all the suddenly_ use Azure, Kubernetes, DevOps, microservices, OpenID connect, and .NET core. It doesn't end well. You can only learn so much in a given time. You either cut corners or learn things superficially. Just because you deployed a cluster with `az aks create`, doesn't mean you're ready to run things in production. There's a lot to it and you will run into gaping holes that you can't address. `</soapbox>`

Reach out if you want help with your prep. Happy to help.