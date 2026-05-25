---
type: writing
title: Prompting Toolbelt
description: A practical map for using AI prompts when you need options, cleaner answers, better sources, and fewer confident mushroom mistakes.
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

There's a joke online about mushrooms and AI. I don't know who started it, so I'm going to tell it as a story instead of pretending it's mine.

**Person**: "_Can I eat this mushroom?_"

**AI**: "_Yes. Would you like some recipes?_"

A few hours later the person is in a hospital bed.

**Person**: "_That mushroom was poisonous!_"

**AI**: "You're absolutely right. Would you like to know more about poisonous mushrooms?"

That's funny because it's barely a joke. If you've used AI for more than ten minutes, you've probably seen some version of this happen. It gives you an answer with complete confidence. You push back, and then it agrees with you with the same complete confidence, as if being wrong was just a fun little detour on the way to being helpful.

So the answer is not "write the perfect prompt." I don't believe in the perfect prompt. The useful skill is knowing which tool to reach for next. This article covers some of the things I've learned that make talking to the computer more effective.

## Map

**Toolbelt**

- [Microprompting](#microprompting): use small prompts to find the shape of the problem before asking for the final answer.
- [Rubric](#rubric): tell AI what a good answer has to do.
- [Examples](#examples): show the format or style you want instead of trying to describe it perfectly.
- [Closing words](#closing-words): put the most important instruction at the end.
- [Cite research](#cite-research): make AI give you links you can click to verify current information.

**Terms**

- [Tokens](#tokens): the chunks of text AI reads and writes.
- [Context Window](#context-window): how much of the conversation AI can keep in view.
- [Hallucinating](#hallucinating): when AI invents something and presents it like a fact.

**Flows**

- [Flow: make a dip for a party](#flow-make-a-dip-for-a-party): how to wander, choose, start clean, and adjust portions.

If you're in the middle of a real task, skip the definitions and start with the flow.

## Tools

### Microprompting

Start a new conversation, ask AI a question, then close it. I call this flow microprompting and it's one of my most useful tools. It keeps your main conversation focused and distraction-free and helps prevent contamination of the [Context Window].

Imagine you're talking to someone about making risotto and they use a bunch of words you don't understand. If you ask them to define every cooking term in the middle of the recipe, it takes away from the conversation, changes how they talk to you in the future, and sometimes gets them to forget what they were about to say.

On the other hand, if you could pause time, ask someone else, and come back, your conversation would be much clearer. You still learn as much, but without confusing the person who is trying to help you out.

This can also be useful when you're not even in a conversation. For example if you're trying to figure out what to even ask in the first place. A microprompt or two can help you better understand the domain to ask a better starting question. If a microprompt leans in a direction you don't like, throw away the conversation and start over.

Useful microprompts:

**Scenario**

You don't know what to cook for dinner. You don't even know what kind of food you want. You need some starter ideas before you ask for a recipe.

> What are some things I can cook for dinner tonight that will fill me up without making me fat?

Get some food ideas, then when you figure out you want something Italian inspired, start a new chat entirely to get rid of any other explorations you did on the way.

**Scenario**

You want to make a mushroom sauce, but you don't know which mushrooms are normal grocery store mushrooms and which ones are "brief hospital vacation" mushrooms.

> What mushrooms are commonly sold in grocery stores for cooking, and which mushroom names should I avoid unless I know exactly what I'm doing?

Ask about the different types of mushrooms, storage, flavor, and basic safety. Once you have an idea of what you're going to cook, start a new chat. This keeps the new chat focused.

**Scenario**

AI said a cooking word you don't understand. Instead of getting off track, start a new conversation and ask for a definition.

> What does chiffonade mean?

**Scenario**

AI is making a meal plan for your current week. You don't like it at all, but you don't know where to start with your complaints.

> Look at this meal plan. What stands out the most to you that you would change?

### Rubric

A rubric tells AI what success means. It is the difference between "help me pick a recipe" and "give me a recipe that takes 20 minutes, uses one pan, travels well, and won't make me look like I stopped at a gas station on the way over."

Rubrics are useful when there are several correct answers. A recipe can be fast, cheap, high-protein, low-mess, kid-friendly, impressive, or safe to eat after a 30 minute car ride. Those are not the same answer. If you don't say what matters, AI will guess. It guesses with the confidence of a man backing a trailer for the first time.

Good rubrics will use bullet points (which AI uses as a checklist), state things in measurable terms, and be brief.

```
A good answer should be
- take 20 minutes or less
- use ingredients I can buy at a normal grocery store
- survive a 30 minute car ride
- taste good at room temperature
```

Or (you can also use checkboxes):

```
A good recipe should
- [ ] take 20 minutes or less
- [ ] survive a 30 minute car ride
- [ ] taste good at room temperature
```

If AI finds a rubric in the chat (especially at the beginning) it will have a tendency to check it before sending you an answer instead of being confidently wrong.

### Examples

Don't tell AI. Show AI. Instead of fighting to get AI to return things in the way you want, give it an example. It can even be fake! AI will be much closer to what you're looking for.

```
Find me a list of party dip recipes and return them in a format similar to this:

Caramel apple dip (20 min) - Sweet - Stovetop
- Travels well
- Good warm or room temperature

Whipped feta dip (10 min) - Savory - No cooking
- Needs a blender
- Best served cold
```

### Closing Words

The end of your prompt matters more than people think. Remember being a kid and someone says "what do you think about that?" You scramble through your brain trying to remember what they asked, but all you remember is how the conversation started and what they just asked you. Same thing with AI.

If you care about the format, put it last.

```
Find some party dip recipes […ramble…]. Use a bulleted list with links.
```

Tell AI what to do

- Tell me what you think
- Search the internet

Keep AI from rambling

- Be brief
- Two paragraphs

These can actually be as short as I wrote them.

```
What are some things I can eat tonight that are high in protein. 5 recipe names. Bulleted list.
```

### Cite Research

AI has a tendency to make stuff up or repeat unfounded claims it found online. When you're asking about things that change, tell AI to search and give you links you can click to verify the answer yourself. Sometimes AI will still [hallucinate](#hallucinating) and you might simply say "read your sources".

For a recipe, this is less about citing a peer-reviewed paper on bean dip. Please do not do that to your guests. It's more about real-time information. What dips are people making right now? Is the recipe from a real cook or a content farm with a stock photo and a prayer? Is that mushroom actually sold for cooking, or is AI about to turn dinner into a medical case study?

Ask for the trail of breadcrumbs:

> Search the internet for what dips people are making for parties right now. Give me five options. For each one, include a link where I can verify it is a real recipe or current trend, and say what the link proves.

Or, if you're asking about safety:

> Is this mushroom safe to eat? Give me links from sources I can check myself. If you are not sure, say you are not sure.

The point is not that AI should decorate the answer with blue links. The point is that you should be able to click something and verify the exact claim before you repeat it, cook it, serve it, or eat it.

## Terms

### Tokens

Tokens are the chunks of text an AI model processes. They are often close to words, but not exactly words. Short common words may be one token. Longer words, punctuation, and weird strings can split into several tokens. If you want to see this instead of trusting my hand-wavy version, use the [OpenAI Tokenizer](https://platform.openai.com/tokenizer).

You usually don't need to count tokens by hand. You do need to understand that AI has limits. A long conversation, a pasted PDF, and your latest instruction are all competing for room.

### Context Window

[Context Window]: #context-window

The context window is how much text the model can keep available while answering. Think of it as the size of the desk AI is working on. A bigger desk helps, but it doesn't mean every paper on the desk gets read equally well.

That is why a fresh chat can be so powerful. If your old chat is full of abandoned options, corrected mistakes, and half-formed ideas, the model may keep dragging that junk behind it. Sometimes the fix is not one more correction. Sometimes the fix is a clean room.

### Hallucinating

Hallucinating is when AI invents something and presents it like a fact. It might invent a source, a quote, a recall notice, a recipe substitution, or a food safety rule. The sentence often sounds calm. That is the rude part.

This doesn't mean AI is useless. It means AI is not a witness. Treat it like a capable assistant who sometimes fills gaps with plausible nonsense because silence would be less helpful-looking.

## Flow: Make A Dip For A Party

Start with microprompts because you probably don't know what you want yet. You know the real constraints, though. Time, skill, ingredients, tools, transport, and whether the party is full of people who think "just a little spice" means "make everyone cough politely."

Try this:

> Everyone is bringing a dip or sauce to a party. I don't know what to bring. I'm good with stovetop cooking, but not microwave. I want to spend 20 minutes or less. Give me five simple options. Short descriptions only.

Maybe it gives you queso, buffalo chicken dip, caramel apple dip, honey mustard, and chocolate ganache. Now you know something. You don't want savory. You want sweet.

So the next microprompt is:

> Sweet sounds better. Give me five sweet dips or sauces that travel well and don't need a microwave.

At this point, stop using the messy chat as the workbench. Pick the direction you like and start a new chat. This matters because the first chat has too much wandering in it. The new chat gets the good parts without the noise.

Use the rubric, examples, and closing words together:

> I want a sweet dip or sauce for a party.
>
> A good answer should:
>
> - take 20 minutes or less
> - use stovetop only
> - use common grocery store ingredients
> - travel well
> - still taste good warm or at room temperature
>
> Use this format:
>
> - Recipe name
> - Why it fits
> - Ingredients
> - Steps
> - Transport notes
>
> Give me three options and recommend one at the end.

That prompt is not magic. It is just honest. It tells AI the job, the success criteria, the format, and the decision you need.

Once you pick the recipe, start another clean chat for adjustments:

> I picked the caramel apple dip below. Adjust it for 18 people. Keep the ingredient list practical, round measurements to normal kitchen amounts, and tell me what container size I need.
>
> [Paste recipe here.]

That last step is underrated. Don't make the model remember the whole party-planning chat. Paste the selected recipe into a clean chat and ask the specific adjustment. This is how you keep the sauce from slowly becoming a lifestyle brand.

## In Closing

Use microprompts when you're still figuring out what you want. Start a new chat when the messy exploration has done its job. Give AI a rubric when the answer could be correct in several different ways. Show examples when you care about the shape. Put the most important instruction at the end. Ask for citations when the answer matters enough to repeat.

AI is good at options, language, structure, and first drafts. It is not good at deserving your trust just because it sounds calm.

Especially if mushrooms are involved.
