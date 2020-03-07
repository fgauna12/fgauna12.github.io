---
layout: post
title: State-based vs migrations-based database deployments
tags:
  - devops
date: 2020-03-07T02:08:15.914Z
featured: false
hidden: false
comments: false
---
There's a lot of great tools available to help with automated database deployments. Ultimately, there's two main paradigms available in these tools. There are migration-based database deployments and state-based database deployments.

<!--more-->

State-based database deployments are where the desired state of the database schema is committed to source control. Then the tools will figure out to apply change scripts against a database to make it look like the source of truth. 

Migrations-based database deployments are where you have more control and you create incremental change scripts that run in sequence against a database. The tools will help you with the maintenance and execution of these scripts in order. Also, they help with storing the state of the latest migration applied to a database. In the end, the accumulation of all the change scripts committed to source control in the proper sequence will produce the desired database schema.

State-based database migrations are effective early in projects. When there's a lot of thrashing in requirements, when the system is evolving, and especially when the product has not been released, state-based migrations offer agility. There's no change scripts to worry about and there's likely less concern about the data itself (since the product has not be released).

After a product has been launched, it can be more effective to switch towards a migration-based model. Especially if the system has high availability demands. With migrations, you will have more control over the database changes and have the flexibility to create backwards-compatible migrations in the event of a mishap. You will be in a position where you can rollout code changes gradually and also have the ability to rollback if desired.

For more information, here's a [whitepaper from RedGate](https://www.red-gate.com/library/state-or-migrations-based-database-development) comparing two of their database automation products. They have one product geared towards state-based development and one for migrations-based development.