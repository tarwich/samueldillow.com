---
type: writing
title: Prompting Toolbelt
description: A practical set of AI prompting habits for getting cleaner answers, better options, and fewer confident mushroom mistakes.
pubDate: 2026-05-15
image:
  src: /writing/prompting-toolbelt.svg
  alt: A small set of labeled prompt cards arranged like tools on a workbench.
category: Technology
tags:
  - ai
  - prompting
  - research
  - writing
featured: false
---

There's a joke online about mushrooms and AI. I don't know who started it, so I'm going to tell it as a story instead of pretending it's mine. Somebody asks AI, "Is this mushroom safe to eat?" AI says, "Yes. That mushroom is safe to eat." A few hours later, the person is in a hospital bed. "That mushroom was poisonous," they say. AI responds, "You're absolutely right. Would you like to know more about poisonous mushrooms?"

That's funny because it's barely a joke. If you've used AI for more than ten minutes, you've probably seen some version of this happen. It gives you an answer with complete confidence. You push back, and then it agrees with you with the same complete confidence, as if being wrong was just a fun little detour on the way to being helpful.

I get a lot of questions about how to use AI. People ask how to use it for research, writing articles, creating images, writing computer programs, planning meals, summarizing documents, and arguing with their insurance company without sounding like they were raised in a barn. This isn't going to cover all of that. I want to give you a small AI toolbelt. These are the things I reach for when I'm using AI for text, research, planning, or any other situation where I need the answer to be better than a confident mushroom diagnosis.

## Context Window

I have to get a little nerdy for a minute, because this idea explains a lot of AI behavior. A context window is how much of the conversation AI can keep in mind. You can think of it as the amount of text AI is carrying while it answers you.

> **Token** I don't want to get too much into what a token is. You can think of it as a word, even though that isn't exactly right. If you want to see what tokens look like, play with the [OpenAI Tokenizer](https://platform.openai.com/tokenizer).

The important part is this: AI isn't only reading the last sentence you typed. It's usually dragging the whole conversation behind it. Every correction, every wrong turn, every example, every half-baked idea you threw into the chat at 11:30 p.m. while eating cereal over the sink. That can be helpful if you're working on one focused task, because AI remembering the conversation is the whole point. The problem is that it can also remember things you wish it would forget.

### Context Pollution

Imagine you ask AI to write a recipe for a creamy lemon sauce. It includes milk. You tell it you're deathly allergic to milk, and it rewrites the recipe like this:

- add olive oil
- add lemon
- add garlic
- do not add milk if you are allergic

There was no need to mention milk anymore. Milk should've left the building. But now milk is part of the conversation, so it keeps showing up in weird little ways. That's context pollution. The conversation has picked up junk, and now the junk is influencing the answer.

This matters most when you're still figuring out what you want. If the first ten messages are you wandering around, contradicting yourself, testing ideas, and learning the vocabulary, that's fine. That's how learning works, or at least that's how I learn when I'm not pretending to be more organized than I am. Just don't make that messy chat the place where you ask for the final answer. Sometimes the easiest way to fix AI isn't to correct it one more time. It's to start a new chat.

## Microprompting

Microprompting is my word for using small, disposable prompts to figure out what you should ask next. You're not trying to get the finished answer yet. You're trying to learn the terrain, which means the chat is allowed to be messy. It can be wrong. It can give you five options where four of them are useless. That's fine, because the point isn't to finish. The point is to find the direction.

Let's say everyone is bringing a dip or sauce to a party, and you have no idea what to bring. You could ask AI for "a party recipe," but that's how you end up with a seven-layer dip that requires a broiler, a food processor, three grocery stores, and emotional maturity. Start smaller:

> Everyone is bringing a dip or sauce to a party. I don't know what to bring. I'm good with stovetop stuff, but not microwave. I want to spend 20 minutes. Give me five simple options. Short descriptions only.

That's a good microprompt because it doesn't ask AI to solve the whole problem. It asks AI to give you options. Once you see the options, you'll probably know more about what you want. Maybe it gives you queso, caramel sauce, buffalo chicken dip, honey mustard, and a fruit salsa. You look at the list and realize you don't want anything savory. You want something sweet.

So you steer it:

> I'm looking for something sweet. Give me five options in that direction.

Now maybe it gives you caramel apple dip, chocolate ganache, cinnamon cream cheese dip, strawberry sauce, and a brown sugar butter sauce. At that point, stop. You've learned enough. Pick the direction you want, and start a new chat with a cleaner request.

That's the part people miss. The messy chat is for wandering. The clean chat is for working.

## Give AI A Rubric

A rubric is success criteria. It tells AI what a good answer is supposed to do. That's different from giving AI an example. An example says, "Make it look like this." A rubric says, "Judge the answer by these standards."

If you're still working on the party sauce, your rubric might look like this:

> I want a sweet sauce or dip for a party. A good answer should take 20 minutes or less, use stovetop only, have common grocery store ingredients, and be easy to transport. Do not include anything that needs a microwave. Give me three options and explain why each one fits.

That's much stronger than:

> What should I bring to a party?

The second prompt makes AI guess what matters. The first one tells AI what matters. That doesn't guarantee a perfect answer, but it gives the model something to aim at besides "sound helpful," which is the default setting for almost every answer AI gives.

Rubrics are especially useful when the answer could be correct in several different ways. If you ask for a workout plan, do you care more about losing weight, not getting injured, building strength, or not hating your life? If you ask for a vacation plan, do you care more about cost, food, quiet, walking distance, or keeping your children from staging a tiny rebellion in the airport? AI can work with vague prompts, but it works better when you define the target.

## The Final Sentence

The final sentence of your message is insanely powerful. I don't know if this is formally true in some technical way, and I'm not going to pretend I ran a controlled study in my kitchen, but in practice it matters a lot. If you ask AI for a list of ingredients, it might give you a paragraph, a table, a shopping list, a recipe, or a small novel about its love of lemons. If you care about the shape of the answer, say so at the end.

> Make a list of ingredients for a creamy lemon sauce. Use a bulleted list.

That last sentence pulls the answer into the format you want. You can use the final sentence to tell AI how to work, not just how to format the answer.

> Find me five beginner-friendly hikes within 50 miles of 12345. Research online. Bulleted list.

The prompt isn't fancy. It doesn't need to be fancy. It gives AI the task, the constraint, the method, and the format. When I'm unhappy with an AI answer, this is one of the first things I check. Did I bury the important instruction in the middle of a paragraph? Did I end with something weak like "what do you think?" Did I ask for research, then forget to say I wanted links?

AI pays a weird amount of attention to the last thing you say. Use that.

## Provide Examples

Examples are different from rubrics. A rubric tells AI what success means. An example shows AI the shape you want. Suppose you want AI to summarize research for you. You could say:

> Summarize this article.

That might work, but it might not give you the kind of summary you want. If you already know the format you like, show it.

> Summarize this article in this format:
>
> - Main claim:
> - Best evidence:
> - Weakest part:
> - One thing I should look up next:

That example doesn't have to be perfect. It just has to give AI a pattern. This is one of the reasons examples are so useful. They let you skip a lot of vague explanation and just say, "Do something shaped like this."

Examples work especially well after microprompting. You can use one messy chat to gather information, then paste the useful pieces into a clean chat and say, "Turn this into the format below." That keeps the final chat from inheriting every wrong turn you took while you were learning.

## Make AI Cite Its Research

Now we're back to the mushroom.

Suppose you ask AI for the best technique for climbing a mountain, and it says something like:

- most climbers prefer this method
- this is the most secure gear
- this is the best time of year

Those might be true. They might also be mushroom advice. In their current form, they're just confident claims. If the answer matters, make AI show its work. Ask for sources you can read yourself.

These prompts are useful:

- Please provide citations I can use to find the original sources.
- Please link to the original sources where possible.
- Please separate what the source says from your own interpretation.

These are weaker:

- Cite your sources.
- Link to original.

They're not useless, but they tend to produce thin citations or broken links. I like asking for enough information that I can find the source myself even if the link fails. That's not because I enjoy homework. I don't. It's because a link that looks official can still be wrong, outdated, or misunderstood.

### What If AI Is Wrong?

Sometimes AI will cite a source, and the source won't say what AI claims it says. I've seen it quote opinion as fact, rely on outdated material, or read a sentence that says something doesn't work and somehow come away believing the thing works great.

When that happens, don't panic. Also don't treat the citation as decoration. Click the link. Read enough of the source to see whether AI understood it. If something feels off, I usually keep the correction narrow:

> The source you cited seems to say the opposite. Re-check that source and explain what it actually supports.

Or:

> Separate the claims that are directly supported by the source from the claims you inferred.

That's the boring work that keeps you out of the mushroom hospital.

> **Hallucinating** is when AI invents a fact out of thin air. Sometimes this happens because AI is generating plausible text, not verifying reality. Sometimes it happens because you or someone else stated something confidently, and AI went along with it.

AI is useful. I use it constantly. But I try to remember what it's good at. It's good at giving me options. It's good at helping me find words. It's good at turning messy thoughts into a cleaner shape. It isn't good at being trusted just because it sounds calm.

That's the toolbelt: use small prompts to find your direction, start clean when you know where you're going, give it a rubric, put the important instruction last, show it examples, and check its sources when the answer matters.

Especially if mushrooms are involved.
