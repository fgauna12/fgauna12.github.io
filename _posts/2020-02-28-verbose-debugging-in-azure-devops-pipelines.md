---
layout: post
title: Verbose debugging in Azure DevOps pipelines
tags:
  - devops
  - azure
date: 2020-02-28T23:17:12.895Z
featured: false
hidden: false
comments: false
---
You might already know about the easy button. The diagnostics option when you manually trigger a pipeline. Are you debugging a pesky pipeline and tired of manually triggering it?

Here's a quick tip.

<!--more-->

### Background

The diagnostics option is found when queueing a new build.

![](/assets/uploads/2020-02-28_18-19-22.png "Enable diagnostics through checkmark")

Then from the pipeline output, you can see more verbose logs in pretty colors. 

![](/assets/uploads/2020-02-28_18-21-28.png)

\
\
Again, but it can be quite tedious when troubleshooting something intensely.

### Permanently

To do it permanently, you can simply set `system.debug` as a pipeline variable.

```yaml
variables:
  System.Debug: true
```

Or you can set it as separate variable that won't get source controlled. But it's probably more effective for secrets really. 

![](/assets/uploads/2020-02-28_18-23-52.png "Pipeline variable button")

If it were me, I would probably forget to remove it.
