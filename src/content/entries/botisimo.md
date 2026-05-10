---
type: portfolio
title: Botisimo
description: Creator-tools platform for live streamers — multi-platform broadcasting, cross-platform chat and giveaways, AI-assisted moderation, and an aggregated ad model. Acquired by OpTic Gaming in 2023.
pubDate: 2026-05-07
image:
  src: /entries/botisimo.svg
  alt: Stylized Botisimo dashboard with charts, command controls, and stream-platform indicators.
tags:
  - SaaS
  - creator tools
  - streaming
  - Node.js
  - PostgreSQL
  - AI
featured: true
role: Software Engineer
outcome: Built the multi-platform streaming engine, chat relay, AI-assisted moderation, donations, and analytics behind a creator-tools platform that pooled small streamers into a real ad audience. Acquired by OpTic Gaming in 2023.
caseStudyUrl: /projects/botisimo/
demoUrl: /portfolio/botisimo/
gallery:
  - src: /entries/botisimo.svg
    alt: Botisimo product surface reconstruction.
---

## The Problem

It's the middle of a live stream. A creator is two minutes from announcing a
giveaway winner. Twitch chat is moving fast enough that they can't read it;
YouTube chat is on a second screen and they haven't looked at it in ten
minutes. The viewers on YouTube don't know there's a giveaway. The viewers on
Twitch don't know the YouTube viewers exist. They pick a winner from the chat
they can see, and hope nobody asks why half their audience never got a chance.

That was the problem Botisimo set out to solve. The tools to talk to viewers
across platforms simply didn't exist — every service was its own island, with
its own chat, its own subscribers, and its own dashboard. Chip Armstrong, a
streamer himself, started Botisimo to bridge them. I joined to help build it
out.

## The Work

Botisimo connected Twitch, YouTube, Facebook, Discord, and Trovo into a single
broadcast. A chat relay turned five separate conversations into one, so a
viewer on YouTube could reply to a viewer on Twitch in real time. Giveaways,
raffles, and polls worked across every platform — anyone watching, anywhere,
could enter the same drawing.

On top of the relay we built the rest of what a creator needs while live:
schedules, timers, auto-replies, auto-bans, and a rules engine streamers could
shape to fit their channel. As LLMs matured, we leaned into them — the bot
could respond intelligently in chat, and a streamer could describe a
moderation filter in plain English instead of writing regex. We also built a
donation platform so creators could take tips without standing up their own
payment stack.

## The Hard Parts

**Bridging chats without creating message loops.** The first time we relayed a
message between platforms in staging, the bot quoted itself. Twitch sent a
test message to YouTube; YouTube echoed it back to Twitch as if it were new;
Twitch sent it again. The channel had a few hundred copies of the same line
stacked on top of each other before anyone noticed. Funny in staging,
catastrophic on a live broadcast — so deduplication, replay handling, and
reconnect logic became the whole game, not a side concern.

**Database scaling.** We were collecting multiple gigabytes of engagement data
per user per day, because that was the only honest way to give advertisers
viewership stats. Postgres held up for a long time, then it didn't. We split
the hot tables for write throughput, used materialized views to keep
reporting fast, and kept the older partitions queryable so customers could
still pull historical data on demand.

**An ad model that worked for small streamers.** Most creators on Botisimo
didn't have enough viewers to sell their own ads — a few dozen people per
stream is invisible to a brand. But thousands of streamers in aggregate is a
real audience. We pooled them across every active stream and sold the
combined audience as a single buy, then paid out a share to the small creators
who could never have closed an ad deal on their own. The analytics and
targeting work behind that was some of the most interesting engineering on
the platform.

## What Happened to It

In 2023, OpTic Gaming acquired Botisimo and brought the product in-house for
their own streamers and campaigns. The public version was wound down then,
which is why the demo here is a static reconstruction rather than a live link.

What I'd want to build next is more of the same kind of problem: real-time
tools that have to be right while people are watching, and platforms that
make small audiences economically viable.

## Tech Used

- Node.js, TypeScript
- PostgreSQL with table partitioning and materialized views
- AWS
- LLM integration (chat filters, intelligent bot replies)
- Real-time chat relay across multiple streaming platforms

## Demo

The demo is a static reconstruction of the original product surfaces. It starts
with the dashboard and links into commands, timers, stream reports, and the
stream-frame designer.

<a href="/portfolio/botisimo/" target="_blank" rel="noopener noreferrer">Open the demo</a>
