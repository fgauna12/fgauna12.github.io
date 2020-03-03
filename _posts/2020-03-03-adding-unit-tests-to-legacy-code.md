---
layout: post
title: Adding unit tests to legacy code
tags:
  - devops
  - testing
date: 2020-03-03T04:11:59.479Z
featured: false
hidden: false
comments: false
---
Let's face it. Unit tests are rare. What are your choices for adding unit tests to legacy code that doesn't have any? 

Well, yes... you *could* wait until a rewrite of the app. The problem with that is that you'll likely not get better at unit tests. Also, the time might never come when you rewrite the app. 

Another way is to create *characterization tests*.

<!--more--> 

Think about it this way. When creating unit, integration, functional tests you are testing that code and have some expectations on what it should do.  

[Characterization tests](https://michaelfeathers.silvrback.com/characterization-testing) is a way to apply more of the scientific method to discover the "characteristics" of some legacy code that you don't yet understand. 

First, you are going to have to figure out how to execute the code path you're looking to discover. Your goal should to iterate quickly and have a quick feedback loop so that you design many small experiments to test your small hypothesis. 

Then, after several iterations and having formed many hypothesis, you will have effectively found characteristics and designed integration tests for them. <mark>You will end up with <em>some code coverage</em> to which you can start to refactor and start creating the first unit tests.</mark>

## A case study

I recently worked on a project that had a module that spun up compute on AWS using EC2 instances. We were looking to rebuild this module so it uses Azure Virtual Machine Scale Sets instead. The challenges were significant. No unit tests and the original developers that created this module no longer worked there. 

```csharp
public class SpinUpCompute
{
    ...
    //many args here
}

public class SpinUpComputeResponse 
{
    public bool IsSuccess { get; set; }
}

public class AwsModule {
    public SpinUpComputeResponse SpinUpCompute(SpinUpCompute spinUpCompute) 
    {

    }
}
```

There were many moving parts that interacted with this module. And, I yet did not understand how the other moving parts worked. So, I did not really understand how to test this module effectively with the user interface.

Even if I had the time, I would have to re-write the entire module using Azure and re-run my manual test cases using the user-interface. 

And.. the result would be a **huge** pull request. Large batches and a lot of WIP are [productivity killers](https://gaunacode.com/wip-the-silent-killer).

So, I wrote some characterization tests. I iterated quickly through a unit test runner. In the end, they happened to look like integration tests but of creating them was different.

First, I attempted to invoke the module.

```csharp
[TestClass]
public class AwsModuleCharacterizationTests 
{
    [TestMethod]
    public void SpinUpCompute_Initialize(){
        var module = new AwsModule();

        var response = module.SpinUpCompute(new SpinUpCompute());

        Console.WriteLine(JsonConvert.SerializeObject(response));
    }
}
```

Once I got it to work without blowing up, I learned:

* What app settings the definitely module needs
* How the module needs to be constructed
* What the first results looked like

From observing the first results (since I was outputting them to the console), I also learned that `IsSuccess` was always **false**. After looking at the implementation, I traced the code path and yes... all the code paths were never set that flag to true. 

Great. Critical lesson of characterization tests. <mark>Resist the urge to fix bugs in the legacy code.</mark> Why? Because users might be used to this bug and if you tackle this work, it would be *unplanned work*. The code is already in production and its fix should be prioritized and tested accordingly. Not on the fly like this.

Moving on. 

I modified my test to cement my first characterization test.

```csharp
[TestClass]
public class AwsModuleCharacterizationTests 
{
    [TestMethod]
    public void SpinUpCompute_Initialize()
    {
        var module = new AwsModule();

        var response = module.SpinUpCompute(new SpinUpCompute());

        // this should be false even if it really works
        Assert.IsFalse(response.IsSuccess);
        Console.WriteLine(JsonConvert.SerializeObject(response));
    }
}
```

Tada! First characterization test. Then, I continued to ask myself more questions. With each question, I kept creating new tests. I would always add assertions to validate what I had just learned. Similar to the first case I demonstrated.

For example, I asked

* What would happen if I sent no arguments?
* What would happen if I sent invalid arguments?
* What does the response look like?
* Is the data coming back similar tie into other methods in this module?
* Let me watch the AWS console while I invoke this module with these arguments

In the end, I ended up with a suite of test cases of characteristics I learned about the code. 

Here's the kicker. I effectively discovered integration tests. <mark>Now that I had some test coverage, I could start doing small re-factorings to add unit tests.</mark>

Effectively working **down** from the testing pyramid.

![Testing Pyramid](assets/TestingPyramid.png#center)
