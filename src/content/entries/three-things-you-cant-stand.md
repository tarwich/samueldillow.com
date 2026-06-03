---
type: writing
title: The Three Things Rule
description: Every tool has problems. Find the ones you can't live with before you bet the system on it.
pubDate: 2026-05-26
image:
  src: /writing/three-things-you-cant-stand.png
  alt: Two piles of white rocks, one with three dark rocks on top and one with three dark rocks buried inside.
category: Technology
tags:
  - writing
featured: true
---

## The Three Things Rule

When I was five, my dad took me to a lake to fish. As we walked along the edge, he silently yanked me into the air by one arm. I was scared because I had no idea what was happening. My whole body dangled from the arm now attached to his hand, and for a second all I knew was that my feet had left the ground.

I looked down and saw weeds passing beneath me. Then I realized he had pulled me up right before I stepped into an inlet. I couldn't see it because the weeds were as tall as I was. I had been walking toward a problem I could not see from where I stood.

Software development has some of the same hidden problems. You can be walking along with a tool that looks solid from where you stand, then find out the dangerous part was just below your line of sight. That is usually how frustrating tools get into important places. They don't look dangerous at first; they just look like the thing that finally fixes the old pain.

It seems like every tech stack has one tool that frustrates you. It's somehow critical to the process, but it has three<sup>[[1]](#1)</sup> things you just can't stand. I often find this in programming languages:

- JavaScript [can't handle floating point numbers](https://0.30000000000000004.com/)
- Objective-C uses entire [essays as function names](https://github.com/Quotation/LongestCocoa) such as [CNLabelContactRelationYoungerCousinMothersSiblingsDaughterOrFathersSistersDaughter](https://developer.apple.com/documentation/contacts/cnlabelcontactrelationyoungercousinmotherssiblingsdaughterorfatherssistersdaughter)
- PHP tends to have irritating performance issues

So then someone comes along with a new shiny tool or programming language and it solves those three issues. You breathe a deep sigh of relief and snatch it up as quickly as possible. As you start deploying it throughout your ecosystem, you practically giggle with delight. Then you discover something you hate about this new tool.

It had so much promise! As it turns out, you end up finding as many intolerable things about the new tool as you couldn't stand with the old tool. That is the three things rule. It reminds me of the XKCD comic [Standards](https://xkcd.com/927/).

So what do you do? Do you just never adopt new technology? Do you become a technology hermit and always use the old and proven thing so you can avoid the update headaches? It certainly sounds tempting, especially in this world where new security concerns pop up every few minutes.

### Find the three things first

The biggest problem with the three things is deploying a solution before you know what those three things are going to be. You can't plan around problems you haven't seen yet. You also can't make a good call about which parts of your system should stay on the old tech and which parts should move to the new tech.

The annoying part is not always just annoying. Sometimes one of the three things is a security hole you didn't know to look for. Sometimes it's a bug that only appears under real traffic. Sometimes it's a workflow problem that makes every small change slower than it used to be.

That's the real risk. You aren't just trading old irritation for new irritation. You might be moving an unseen failure mode into the center of your company. By the time everyone notices, the new tool is already sitting under work people depend on.

Find a way to kick the tires of the new tool before you gut the old system. Don't rip out the old stuff yet. Maybe spend a [spike](<https://en.wikipedia.org/wiki/Spike_(software_development)>) using the new thing, or run it on a side project at home. Get to know it until you can figure out what the three things are first.

Once you find them, the decision gets a lot less romantic. You might discover the new problems are unbearable, but they would never surface in your current stack. You might discover they would affect you, but they would still be less painful than what you have now. Or you might find they're worse and you dodged a bullet.

### Use it in low-risk areas

Deploy the new tech in an area you only touch once a month. Or deploy it somewhere with a large tolerance for failure. You still get real experience with the tool, but you aren't betting the company on your first impression. That gives the shortcomings room to show up without shooting you in the foot.

For critical infrastructure, you definitely want to wait before applying the new tech. You might never apply it. Sometimes the pain of the old frustrating thing is better than the pain of unknown failure. There are areas where you just stick with the old because the hidden cost of being wrong is too high.

### Keep track of the things

You really ought to keep track of the things you can't stand. Put them in a journal, email, social media post, or whatever place you will actually search later. We have a way of romanticizing the unfamiliar. That means you can easily forget the problems and go back to something that ends up being a thorn in your side.

In the same way, it's worth checking back in on old tech that used to frustrate you. You might find the maintainers fixed one of the three things. At that point, it may be worth another look. If you do choose to go that route, you still want to court it like you would a brand new tool.

As obvious as those three things seem in the moment, time has a way of making you forget the times you wanted to slam your head into a wall. That is how you end up stepping into the same inlet twice. So do something to help you keep track of them for later.

### Footnotes

<a id="1"></a>1: It's not always exactly three, but it's usually a small number.
