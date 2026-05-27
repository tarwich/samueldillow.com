---
type: writing
title: Three Things You Can't Stand
description: New tools solve old pain and bring their own. Find the tradeoffs before you bet the system on them.
pubDate: 2026-05-26
image:
  src: /writing/three-things-you-cant-stand.svg
  alt: Two software stacks on a workbench with warning flags marking the tradeoffs in each.
category: Technology
tags:
  - writing
featured: true
---

Every tech stack has one tool that makes you mutter at your monitor.

It is somehow critical to the process, but it has three<sup>[[1]](#1)</sup> things you can't stand. I notice this most often in programming languages:

- JavaScript has [floating point weirdness](https://0.30000000000000004.com/)
- Objective-C uses entire essays as function names
- PHP can make performance feel like a personal dispute

Then someone shows up with a shiny new tool or programming language, and it fixes those three problems. You breathe a deep sigh of relief. You adopt it as quickly as possible. You start rolling it through the ecosystem and, for a brief and beautiful moment, you think the industry may have finally learned its lesson.

Then the new tool shows you its teeth.

It has problems too. Sometimes they are smaller. Sometimes they are worse. Sometimes they are just different enough that you do not recognize them until they are already wired into your deployment pipeline. I call this the three things rule: every tool has a short list of things you will eventually hate about it.

That does not mean you should become a technology hermit and refuse every new thing. It does mean you should find the tradeoffs before you bet the system on them.

## Find the three things first

The biggest mistake is deploying the new solution before you know what its three things are. Until you know them, you cannot plan around them. You cannot tell which parts of the system should move and which parts should stay boring.

Find a way to kick the tires before you gut the old system. Spend a [spike](<https://en.wikipedia.org/wiki/Spike_(software_development)>) on the new thing. Use it for a side project. Put it through a task that looks like your real work, not the happy-path demo from the homepage.

Once you find the three things, you can make a real decision. Maybe the problems are ugly, but they would never show up in your system. Maybe they would affect you, but they are still less painful than what you have now. Or maybe they are worse, and you just saved yourself six months of pretending the migration is almost done.

## Use it in low-risk areas

If you do adopt the new thing, start where failure is annoying instead of catastrophic. Use it in an area you only touch once a month. Use it behind an internal tool. Use it where the blast radius is small and the rollback story is not "everyone panic."

That gives you room to learn the tool honestly. You can discover the sharp edges while they are still just sharp edges, not production incidents with calendar invites.

For critical infrastructure, wait. You might never move it. Sometimes the old frustrating thing is still better than a new failure mode you do not understand yet.

## Keep track of the things

Keep track of what you hate.

That sounds petty, but it is useful. Write it in a note, an email, a ticket, or a private rant you have the wisdom not to publish. The format matters less than the memory. We romanticize unfamiliar tools, and we also romanticize old tools once the bruises fade.

The record also gives you a reason to check back later. An old tool may have fixed one of the things that drove you away. A new tool may have made one of its tradeoffs worse. Either way, you are judging the tool you actually have now, not the version that annoyed you three years ago.

As obvious as those problems feel in the moment, time has a way of making you forget the exact shape of the pain. Keep the list. Future you is going to be tempted by a migration deck with clean diagrams.

## Footnotes

<a id="1"></a>1: It's not always exactly three, but it's usually a small number.
