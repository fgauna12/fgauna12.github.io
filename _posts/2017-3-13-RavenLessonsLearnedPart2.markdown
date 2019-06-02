---
layout: post
title:  "RavenDB Lessons Learned - Part 2"
date:   2017-03-13 13:00:00 -0500
categories: RavenDB
comments: true
---

A continuation of my lessons learned on RavenDB. Some tips on testing and what not to do.

## 1. Testing Indexes is Really Really Really Important

One of the best features in RavenDB, is the ability to use a full in-memory database when running your integration tests.
There are so many features tied to a Lucene and Map-Reduce indexes, that you'll be thankful you wrote integration tests later. 
As you go along learning these features, it is hugely beneficial to show to a fellow developer how this feature works without having to seed example documents or sift through polluted data in an integration database somewhere.

Another reason to write unit tests with an embedded Raven database, is that Lucene and Map-Reduce will be new concepts for most developers. 
Therefore, if you have to perform a Lucene query to do a full-text search, you can back it up with a Raven unit test to ensure that this feature is always working.
Same can be said for aggregation queries using Map-Reduce.


### Use the Raven Test Helper NuGet Package
When developing your indexes and testing them from the studio, you want to make sure that it's not wasted work. Spent a little extra time creating automated tests with the [Raven Test Helper NuGet](https://www.nuget.org/packages/RavenDB.Tests.Helpers/)  package.
These tests pay huge dividends since *you're running an embedded version of RavenDB* and your tests don't have to be dependant on some server.

#### "But isn't it the same as writing tests against my DEV  database instead?"

**NOPE**. By having your database embedded with your tests, you can seed data into the database without affecting your other tests. 
In short, you can stand up an embedded database, seed data, and destroy it on **each test execution**.

**This is huge!** If only we were able to load RDBMS in memory on each unit test execution so that we're able to test our views, stored procedures, paging logic, etc etc.


## 2. You have Reporting or Business Intelligence Needs? Don't Use Raven

It's well documented and talked about by [Ayende](https://ayende.com/blog/136197/when-should-you-not-use-ravendb). NoSQL in general is not a good solution for a system that has to serve enterprise reporting capabilities.
Unless of course, you have a Big Data problem.

Yes there's a Raven to SQL Replication Bundle. It works amazingly well. However, you'll run into a new set of issues. For example: 
- Your RDMBS most likely won't be able to keep with Raven.
- You'll still be responsible for a schema, post development
- Manual Deployment of SQL replication scripts

**However**, if your approach to reporting is [embedded analytics](http://searchcio.techtarget.com/definition/embedded-analytics), then Raven be a good use-case. 
Features like dashboards and self-service analytics suit very well with features available in Map-Reduce and Lucene.

## 3. Think Twice About Using the Repository Pattern

The Repository pattern is great for hiding inline SQL or other types of data access code. There's plenty of material on why you shouldn't use the Repository pattern on top of an OR/M.
Here's some material on why it's a bad idea in general:
- [Ayende's Blog - The Evils of the Repository Pattern](https://ayende.com/blog/4784/architecting-in-the-pit-of-doom-the-evils-of-the-repository-abstraction-layer)
- [Ayende's Blog - Over-abstracting an OR/M](https://ayende.com/blog/4788/the-wages-of-sin-proper-and-improper-usage-of-abstracting-an-or-m)
- [SO Answer - Reason's why not to use it](http://stackoverflow.com/a/20159814/3638742)
- [SO Answer - If you're going to use it, use it right](http://stackoverflow.com/a/17449231/3638742)
- [Repositories on top of UoW are not a good idea](http://rob.conery.io/2014/03/04/repositories-and-unitofwork-are-not-a-good-idea/)

Personally, I've been part of a project that chose to use the Repository pattern on top of Raven. Some of the issues we ran into where:
- Could not control a `TransactionScope` for operations across document collections
- Led you to forget about eventual consistency - no safety guards against this
- For CRUD operations, there wasn't much "business logic" being decoupled
- It was tempting to create a base generic repository which caused Raven session limitations
- Reduced Raven performance because you have to call `SaveChanges` much more frequently.
- You'll be tempted to hack around it even more - i.e. disabling change tracking

Instead some solutions are :
- No Pattern - Just use the Client Directly
  - If you use DDD, then use Raven [straight from the Application layer](http://stackoverflow.com/a/17583529/3638742)
- [Specification Pattern](https://en.wikipedia.org/wiki/Specification_pattern)
- [CQS or CQRS](https://lostechies.com/jimmybogard/2012/10/08/favor-query-objects-over-repositories/)
