---
type: writing
title: Three Things You Can't Stand
description: New tools solve old pain and bring their own. Find the tradeoffs before you bet the system on them.
pubDate: 2026-05-26
image:
  src: /writing/three-things-you-cant-stand.svg
  alt: Two pale rock stacks, one with three dark stones on top and one with three dark stones visible at the bottom.
category: Technology
tags:
  - writing
featured: true
---

## The Three Things Rule

It seems like in every tech stack there's one tool that frustrates you. It's somehow critical to the process, but it has three<sup>[[1]](#1)</sup> things you just can't stand. I often find this in programming languages:

- JavaScript [can't handle floating point numbers](https://0.30000000000000004.com/)
- Objective C uses entire essays as function names
- PHP tends to have irritating performance issues

So then someone comes along with a new shiny tool or programming language and it solves those three issues. You breathe a deep sigh of relief and snatch up that new shiny as quickly as possible. As you start massively deploying it throughout your ecosystem you practically giggle with delight. Until it happens:

You discover something you hate about this new tool. It had so much promise! As
it turns out, you end up finding as many intolerable things about the new tool
as you couldn't stand with the old tool. I call this "the three things" rule.

So what do you do? Do you just never adopt new technology? Do you become a technology hermit and always use the old and proven technology, preventing the update headaches? It certainly sounds tempting -- especially in this world when new security concerns pop up every few minutes.

### Find the three things first

The biggest problem with the three things is deploying a solution without knowing what those three things are going to be. There's no way to plan for them or know which parts of your system should stay on the old tech and what should move to the new tech.

Find a way to kick the tires of the new tool before you gut the old system. Don't rip out the old stuff yet, but maybe spend a [spike](<https://en.wikipedia.org/wiki/Spike_(software_development)>) on using the new thing. Maybe run it on a side project at home. Get to know it until you can figure out what the three things are first.

Once you find the three things with the new tech you might find they're unbearable but would never surface in your current stack. You discover they'd affect you but be less painful than what you have now. Or you might find they're worse and you dodged a bullet.

### Use it in low-risk areas

Deploy the new tech in an area you only touch once a month. Or you could deploy it in an area where there's a large tolerance for failure. This allows you to get familiar with the new tech and discover the shortcomings organically without shooting yourself in the foot.

For the critical infrastructure, you definitely want to wait before applying the new tech. You might never apply it. Sometimes the pain of the old frustrating thing is better than the pain of unknown failure. There are areas where you just stick with the old.

### Keep track of the things

You really ought to somehow keep track of the things you can't stand. Be it in a journal, email, or social media post. We have a way of romanticizing the unfamiliar, which means you could easily forget the problems and go back to something that ends up being a thorn in your side.

In the same way, you might check back in on old tech that used to frustrate you. You might find they've fixed one of the three things, and it's worth checking in on again. If you do choose to go that route, you still want to court it as you would with a brand new tech.

As much as it seems obvious what those three things were, time has a way of making you forget the times you wanted to slam your head into a wall. So do something to help you keep track of them for later.

### Footnotes

<a id="1"></a>1: It's not always exactly three, but it's usually a small number.
