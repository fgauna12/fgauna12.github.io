---
layout: post
title:  "RavenDB Lessons Learned"
date:   2017-03-06 08:14:14 -0500
categories: RavenDB
comments: true
---

For the last 3 years, I've been using RavenDB in various projects. Most have been really positive experiences, but like any other technology, there's going to be gotchas. Here's a random collection of lessons learned from my point of view.

## 1. When you try to boil the ocean, bad things happen

#### 128 - The out-of-the-box result limit on the client-side

Sometimes we get lazy, and we do something like this:

``` csharp

public class BirdRepository : IRepository<Bird>
{
	  public IEnumerable<Bird> GetAll()
    {
    	return _documentSession.Query<Bird>().ToList();
    }
}

```

Let's say that `IRepository<Bird>` forces us to implement a `GetAll()` method. Our implementation is trying to load *all* the documents into memory because that's how we defined the interface.

Some time later, you might notice that although you have 200+ documents, you're always getting 128 results from your query. This is because RavenDB is built to be **safe-by-default**, i.e. it won't let you boil the ocean and load all the documents into memory.

#### 1024 - The out-of-the-box result limit on the server side

Similarly, if you try to by-pass the aforementioned limit by doing a `Take(1000)` or even worse `Take(int.Max)`, Raven will only give you 1024 documents because this is the limit on the server side. 
In other circumstances, you might have a transformer that's trying to group results and take a count. Grouping data in a transformer is allowed only up to this limit. _Captain Obvious:_ grouping data from a transformer is allowed for the sake of transformation and not for aggregation. 

#### So what should you do then?

- Use [paging](https://ravendb.net/docs/article-page/3.5/csharp/indexes/querying/paging), it's really easy
- If you **have** to iterate through all the documents because you're exporting to a CSV file or building a report, you can use the [Streaming API](https://ravendb.net/docs/article-page/3.5/csharp/client-api/session/querying/how-to-stream-query-results). This API allows you to iterate through the whole collection one document at a time. 
- If you must aggregate data, use a [Map-Reduce index](https://ravendb.net/docs/article-page/3.5/csharp/indexes/map-reduce-indexes)


## 2. Web API - Identity Separator

When first using RavenDB, one of my first challenges was trying to make Web API routing and Raven IDs work nicely together.

For instance, when attempting to build a route to `GET` a resource by ID:

``` csharp
GET api/birds/{id}
```

If ID is `birds/1`, the Web API router won't be able to find the matching controller action.

Your first instinct might be try to use `int` or `Guid` IDs in your raven documents. But resist this urge. There's a simpler way. Just change the convention for the identity separator.

```
documentStore.Conventions.IdentityPartsSeparator = "-";
```

Tada! Everything else should fall in place. No special code or side effects later on.

## 3. Polymorphic Documents

The RavenDB [documentation](https://ravendb.net/docs/article-page/3.5/csharp/indexes/indexing-polymorphic-data) on this topic is quite helpful. There's a couple of strategies on how you can store polymorphic data in RavenDB.

Similar to how Entity Framework does it, you can store the entities separately or together. 


#### Separate Collections - Multi-Map Indexes


``` csharp

public class Birds_ByName : AbstractMultiMapIndexCreationTask
{
	public Birds_ByName()
	{
      AddMap<Owl>(owls => from o in owls select new { o.Name });

      AddMap<Eagle>(dogs => from e in eagles select new { e.Name });
	}
}

```

Then you can query all birds:

``` csharp

IList<Bird> results = session
	.Query<Bird, Birds_ByName>()
	.Where(x => x.Name == "Bald")
	.ToList();
    
```

#### Same Collection - Overriding Default Tag Name

``` csharp
documentStore.Conventions.FindTypeTagName = type =>
{
    if (typeof(Bird).IsAssignableFrom(type))
    return "Birds";
    return DocumentConvention.DefaultTypeTagName(type);
}
```

With this convention, all the documents that extend `Bird` will be stored as part of the same
collection. All queries and indexes will be against the new tag name. 

For instance, an `Owl` document will be indexed by: 

``` csharp
from animal in docs.Birds
select new { animal.Name }
``` 

## 4. Large Document Collection? Consider Disabling In-Memory Indexing

Won't happen in most applications, but if you have limited resources on your RavenDB host and you expect a very large document collection (1 million+ documents), you might consider not storing the index results in memory. 

You can toggle this feature right from the index definition.

``` csharp
public class Birds_ByName : AbstractIndexCreationTask<Bird>
{
  public Birds_ByName()
  {
      // Map Function Here
      DisableInMemoryIndexing = true;
  }
}
```