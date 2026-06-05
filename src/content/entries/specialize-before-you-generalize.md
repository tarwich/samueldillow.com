---
type: writing
title: Specialize Before You Generalize
description: Write your function to do one thing before you try to make it do many things.
pubDate: 2026-06-05
image:
  src: /writing/specialize-before-you-generalize.png
  alt: A programmer surrounded by formulas and controls while looking at a tiny circle on a monitor.
category: Technology
tags:
  - writing
  - technical
  - programming
  - software development
featured: true
---

I asked an engineer to write me a function that would render circles on the screen. This was part of a larger iteration. The next step was going to be a function that called the circle-rendering function for a massive dataset.

What I expected was something like this:

```python
def render_circle(x, y, radius):
    ...
```

But instead, I got this:

```python
def render_ellipsoid(
  x, y, z, # Center point
  rx, ry, rz, # Ellipsoid parameters
  edge_thickness, fill_color, stroke_color # Painting parameters
):
    ...
```

And the actual function was a lot more complicated. I don't remember all the details, but it had things like depth culling and some ability to specify the granularity of the circle. It was supposed to draw a solid dot, but it supported transparent wireframes. I call this "generalization".

This is similar to Parkinson's Law: "_work expands to fill the time available for its completion_." In this case, the work expanded to fill every possible use case he could imagine. He sat there, thought of every conceivable way the function could be used, and wrote the function to support all of them.

## The Cost of Being Too Ready

Problem: No one can use the new function because now it requires a degree in parapsychology to understand it. Even if all the parameters are optional, you have to read a book of documentation to figure out which ones you need, what they do, and which values are valid.

Problem: Sometimes when you overgeneralize, you support a potential future use case in a manner that doesn't work. For example, you add `filter: regex` to a function, but later you need a non-regex filter too. What do you do? Add `nonRegexFilter` as well?

And if you're unit testing, you have to test every permutation of parameters. That's a lot of test cases. If you want to remove a parameter or change it, you need a way of knowing if that change will cause a regression, or if the parameter was only there because someone imagined it might be useful someday.

## Start With the Shape You Need

Write your function to cover as few use cases as possible. Then, when you need to add a new use case, you can add it without breaking the existing code. I call this "specialization". Which completes the name of my maxim: "_Specialize before you generalize_".

The problem is not that a function has parameters. `radius` is a parameter and is necessary. The problem starts when a parameter exists because you imagined a future caller instead of helping the caller in front of you.

When the second use case comes along, make the parameter changes necessary to support it without breaking the first use case. This is when unit testing is useful. However, you don't always have to modify the base function. Sometimes you can make a sibling function that does the same thing but takes different parameters. Sometimes it makes sense to have the sibling function be a wrapper around the base function.

The advantage of developing this way is that it tends to naturally produce a more modular and maintainable codebase. For example, in the circle function above you might have ended up with `draw_circle` and `draw_ellipse` functions. And you might eventually have `draw_circle` become a sugary wrapper around `draw_ellipse`.

## Watch for Branching

There's one way (of many) to determine if you should write a single abstraction instead of another specialized function. Inspired by [The Wrong Abstraction (Sandi Metz)](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction), imagine the feature you're trying to add. If you find yourself branching inside the function to support different concepts, you probably should've specialized it instead.

What I've seen is that this branching tends to become a plague that grows as the function grows. One function starts doing three different jobs, but the differences are hidden behind parameters. It would've been easier to have one main branch that runs a completely different algorithm.

```python
def draw_shape(shape_type, x, y, radius, width, height):
    if shape_type == "circle":
        ...
    else:
        ...
```

Once a function has to ask what kind of thing it is, that's a sign the wrong thing may have become the abstraction. Start specialized. Let the second and third use cases show you what the shared function should be.

## Guessing Isn't Free

The general version should feel discovered, not invented. If you can't point to the use cases that shaped it, you're probably not generalizing yet. You're guessing. And guessing isn't free. Sometimes a new parameter looks like a harmless little edit. But now someone has to understand it, test it, maintain it, and figure out whether it was ever needed in the first place.
