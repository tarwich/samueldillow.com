---
title: Generating a Towers Puzzle
description: Notes on building a small browser puzzle — Latin squares, a solver-driven generator, and what splitting it into modules clarified.
pubDate: 2026-05-08
category: Play
tags:
  - games
  - browser
  - generators
  - puzzle
featured: true
---

> **[→ Play Towers](/games/towers/)** — pick a difficulty and go.

Towers (a.k.a. Skyscrapers) is a small logic puzzle: fill a 5×5 grid so each
row and column contains 1–5, and edge clues say how many towers are visible
from that side. A taller tower hides every shorter tower behind it.

The rules are easy. Generating a puzzle that is both playable *and* uniquely
solvable is the part that takes some thought.

## The grid

The first move is to make a valid filled grid — a Latin square. Backtracking
from the top-left, with a shuffled candidate order at each step, is enough at
this size. The candidate order comes from a seedable PRNG (Mulberry32, four
lines), so the same seed always produces the same puzzle. That makes the Share
button trivial: copy the URL, the seed comes with it.

## The clues

Every side of every row and column gets an edge clue: scan the line and count
how many towers are visible from that side. That part is mechanical.

The interesting question is *which* clues to remove. Show all twenty and the
puzzle is over before it starts. Hide too many and the grid has multiple valid
completions. The threshold between those is what makes the puzzle.

The generator leans on the solver to find it:

1. Compute every clue from the filled grid.
2. Shuffle the twenty clues.
3. Walk them in order. Try removing one. Run a backtracking solver capped at
   two solutions. If exactly one remains, keep the clue hidden; otherwise,
   restore it.
4. Stop when the difficulty target is hit.

The two-solution cap is the trick. The solver doesn't need to count *every*
completion — only enough to know whether more than one exists. That keeps each
removal cheap, even though the loop runs across all twenty clues.

## The pieces

The implementation lives in five modules:

- `prng` — Mulberry32, seed parsing, shuffle.
- `puzzle` — Latin-square generator, clue computation, solver.
- `state` — A `TowersGame` class that owns the grid, pencil-marks, undo/redo,
  and the win check.
- `view` — DOM build and render. Knows nothing about events.
- `main` — Wires up controls, keyboard, and URL state.

Each one is small. Each one was awkward to find inside the original
single-file prototype. Splitting them out cost almost nothing and made the
solver and the generator legible on their own.

## Why bother

A 5×5 puzzle isn't going to teach me anything I haven't seen before. But it's
a small enough surface that the whole thing — generator, solver, UI, undo/redo,
share links — fits in an afternoon, and I walk away with sharper instincts
about state, batching, and where modules want to break.

That's almost always the trade. Small games are small only on the outside.
