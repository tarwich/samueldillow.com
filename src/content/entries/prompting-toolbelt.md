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
- [Cite research](#cite-research): make AI separate confident claims from supported claims.

**Terms**

- [Tokens](#tokens): the chunks of text AI reads and writes.
- [Context Window](#context-window): how much of the conversation AI can keep in view.
- [Hallucinating](#hallucinating): when AI invents something and presents it like a fact.

**Flows**

- [Flow: make a dip for a party](#flow-make-a-dip-for-a-party): how to wander, choose, start clean, and adjust portions.
- [Flow: find a hiking trail](#flow-find-a-hiking-trail): how to learn the words, add location, and narrow toward the actual trail.

If you're in the middle of a real task, skip the definitions and start with one of the flows.

## Tools

### Microprompting

Start a new conversation, ask AI a question, then close it. I call this flow microprompting and it's one of my most useful tools. It keeps your main conversation focused and distraction-free and helps prevent contamination of the [Context Window].

Imagine you're talking to someone about how bridges are built and they use a bunch of words you don't understand. If you ask them to define all the words for you, it takes away from the conversation, changes how they talk to you in the future, and sometimes gets them to forget what they were about to say.

On the other hand, if you could pause time, ask someone else, and come back, your conversation would be much clearer. You still learn as much, but without confusing the person who is trying to help you out.

This can also be useful when you're not even in a conversation. For example if you're trying to figure out what to even ask in the first place. A microprompt or two can help you better understand the domain to ask a better starting question. If a microprompt leans in a direction you don't like, throw away the conversation and start over.

Useful microprompts:

**Scenario**

You don't know what to cook for dinner. You don't even know what kind of food you want. You need some starter ideas before you ask for a recipe.

> What are some things I can cook for dinner tonight that will fill me up without making me fat?

Get some food ideas, then when you figure out you want something Italian inspired, start a new chat entirely to get rid of any other explorations you did on the way.

**Scenario**

You want to ask how to wire under lighting into your car, but you don't even know where to start.

> Can I wire LEDs into my car so they turn on only when the car is on? Is this possible?

Ask about different types of lights and wiring scenarios and battery concerns. Once you have an idea of what you're going to do start a new chat. This keeps the new chat focused.

**Scenario**

AI said a word you don't understand. Instead of getting off track, start a new conversation and ask for a definition.

> What does ineffable mean?

**Scenario**

AI is making a meal plan for your current week. You don't like it at all, but you don't know where to start with your complaints.

> Look at this meal plan. What stands out the most to you that you would change?

### Rubric

A rubric tells AI what success means. It is the difference between "help me pick a recipe" and "give me a recipe that takes 20 minutes, uses one pan, travels well, and won't make me look like I stopped at a gas station on the way over."

Rubrics are useful when there are several correct answers. A hiking trail can be beautiful, safe, shaded, dog-friendly, steep, crowded, close, or quiet. Those are not the same answer. If you don't say what matters, AI will guess. It guesses with the confidence of a man backing a trailer for the first time.

Good rubrics will use bullet points (which AI uses as a checklist), state things in measurable terms, and be brief.

```
A good answer should be
- within 45 minutes of Austin
- mostly shaded
- currently open
- no more than five miles
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
Find me a list of hiking trails near me and return them in a format similar to this:

Cedar Ridge trail (2mi) - Easy - 20 miles away
- Restrooms available
- Parking available

Blue Foot trail (3mi) - Challenging - 20 miles away
- Parking available
```

### Closing Words

The end of your prompt matters more than people think. Remember being a kid and someone says "what do you think about that?" You scramble through your brain trying to remember what they asked, but all you remember is how the conversation started and what they just asked you. Same thing with AI.

If you care about the format, put it last.

```
Find some hiking trails […ramble…]. Use a bulleted list with links.
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

AI has a tendency to make stuff up or repeat unfounded claims it found online. When you're asking about things that matter, tell AI to cite its sources with links if available. Sometimes AI will still [hallucinate](#hallucinating) and you might simply say "read your sources".

Every AI will comply in a different manner. Some will give you a bibliography, some will give you links, and some will actually give up entirely. The point is when AI tells you to take ivermectin, before you do something stupid, you can at least read the places where AI got its information.

## Terms

### Tokens

Tokens are the chunks of text an AI model processes. They are often close to words, but not exactly words. Short common words may be one token. Longer words, punctuation, and weird strings can split into several tokens. If you want to see this instead of trusting my hand-wavy version, use the [OpenAI Tokenizer](https://platform.openai.com/tokenizer).

You usually don't need to count tokens by hand. You do need to understand that AI has limits. A long conversation, a pasted PDF, and your latest instruction are all competing for room.

### Context Window

[Context Window]: #context-window

The context window is how much text the model can keep available while answering. Think of it as the size of the desk AI is working on. A bigger desk helps, but it doesn't mean every paper on the desk gets read equally well.

That is why a fresh chat can be so powerful. If your old chat is full of abandoned options, corrected mistakes, and half-formed ideas, the model may keep dragging that junk behind it. Sometimes the fix is not one more correction. Sometimes the fix is a clean room.

### Hallucinating

Hallucinating is when AI invents something and presents it like a fact. It might invent a source, a quote, a legal rule, a trail closure, a recipe substitution, or a technical detail. The sentence often sounds calm. That is the rude part.

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

## Flow: Find A Hiking Trail

Hiking is a good example because people start with the wrong prompt all the time. They ask, "What's a good hike near me?" and then get a list that sounds plausible, outdated, or suspiciously assembled from travel-blog confetti.

Start by learning the words:

> I want to find a hiking trail, but I don't know the right terms. What trail features and difficulty terms should I understand before searching?

Now you might get words like elevation gain, loop trail, out-and-back, scramble, exposed, shaded, creek crossing, trailhead parking, permit, and seasonal closure. That is useful. You can search better once you know what the signs are called.

Then add your location and constraints:

> I live near Austin, Texas. I want a trail for Saturday morning. I care about shade, water features, easy parking, and a route under five miles. What location-specific details should I check before choosing?

That prompt should push AI toward weather, current closures, heat, parking pressure, trail conditions, and whether "water feature" means "beautiful creek" or "one damp rock if it rained last month."

Now refine toward the dream trail:

> Find three trail candidates within 60 miles of Austin. A good answer should be under five miles, have shade or water, be reasonable for a casual hiker, and include current source links for access, closures, parking, and trail details. Separate confirmed facts from your interpretation. End by recommending the best fit.

Notice what changed. You did not start by asking AI to pick the trail. You first learned the vocabulary. Then you learned the local constraints. Then you asked for sourced candidates. That keeps the final answer from being a pretty paragraph with no legs under it.

## In Closing

Use microprompts when you're still figuring out what you want. Start a new chat when the messy exploration has done its job. Give AI a rubric when the answer could be correct in several different ways. Show examples when you care about the shape. Put the most important instruction at the end. Ask for citations when the answer matters enough to repeat.

AI is good at options, language, structure, and first drafts. It is not good at deserving your trust just because it sounds calm.

Especially if mushrooms are involved.
