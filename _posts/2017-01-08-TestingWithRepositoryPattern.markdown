---
layout: post
title:  "The Query Object and Repository Pattern"
date: 2017-01-08
categories: Unit-Testing Patterns
comments: true
---

The Repository Pattern has been around for a long time. According to a quick Google search, it predates the GoF patterns and the .NET framework. It's understandable. Inline SQL was king and it was sprinkled as code behind in many apps. 
The Repository Pattern was seen as a way to tuck away all this logic and starting to structure and decouple applications a little better. 

There's a huge drawback to repositories which **really really bugs me**.

## You can't test queries

Permissions, dashboards, notifications, alerts, and search filters are all features that we create which rely **heavily** on querying data.
**Queries often have business logic in them and we ought to test them.** 

Many of us resort to integration tests. We write tests that go straight to a shared database and we try to test our repository top to bottom. 
I cry. It's so hard so maintain. Eventually, we give up on those tests. Some even stop believing in unit testing.

*Example*: 

Let's say you're working report generator that runs once a day and emails it to your users. You start working on the query that identifies the records that should be part of the report.
It looks something like this:

``` cs
public class ThievesRepository : IRepository<Thief>
{
    ...
    public IList<Thief> GetThievesThatWentToJailThisMonthBecauseNoTeeth(){
        var startDate = DateTime.StartOfMonth(); //Pretend it's an extension
        var endDate = DateTime.EndOfMonth();
        return _dbContext.Thieves.Where(t => t.IncarceratedOn >= startDate 
            && t.IncarceratedOn <= endDate && t.IncarcerationReason == Reasons.HasNoTeeth).ToList();
    }
    ...
}
```
You're a good citizen, a good programer, and you want to test your feature. Well, evidently this implementation of the query is crucial to the query. 

I dont' know about you but I want to test it. I really really really want to test it. 
There's business logic in that snippet. How do we avoid writing integration tests?

## An alternative: the Query object

It's a containment class that hold the query arguments and works in unison with your repository. 
It this example it would look something like this:

```cs
public class ThievesReportQuery : IQuery<Thief> {
    public Func<Thief, bool> ToExpression(){
        return t => t.IncarceratedOn >= startDate 
            && t.IncarceratedOn <= endDate && t.IncarcerationReason == Reasons.HasNoTeeth;
    }
}
```

Then the repository would look like this:

``` cs
public class ThievesRepository : IRepository<Thief>
{
    ...
    public IList<Thief> Search(IQuery<Thief> query){
        return _dbContext.Thieves.Where(query.ToExpression()).ToList();
    }
    ...
}
```

The real pay-off is in the unit tests. You are now able to write unit tests and test just this query without going to a real database.
My tests usually look like this:

```cs
[TestFixture]
public class ThievesReportQueryTests {
    [TestMethod]
    public void Search_HasOneThief_ReportsThief(){
        using(var repository = new InMemoryRepository<Thief>())
        {
             //Arrange
             var thief = NewThief();
             repository.Save(thief);
             
             //Act
             var query = new ThievesReportQuery();
             var results = repository.Search(query);

             //Assert
             results.Count.ShouldBe(1);
             //More assertions here
        }
    } 
} 
```

The key here is that the `InMemoryRepository` uses a `List` instead. Many will cry wolf at this point because Linq to SQL and Linq to Objects don't always behave the same.
Especially when using `System.Data.DbFunctions` to trim a date or something. However, there are ways around it and most importantly 95% of the time you will be able to write tests that are maintainable for everyone in the team.
Remember, you won't have to worry about seeding a bunch of data in a real database to test your search queries. That certainly won't be the way that users use your system.


