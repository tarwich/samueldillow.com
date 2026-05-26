---
company: Botisimo / OpTic Gaming
role: Software Engineer
startDate: 2021-01-01
endDate: 2023-12-31
dateLabel: 2021 - 2023
summary: Built the multi-platform streaming, engagement, and aggregated-ad-revenue systems behind Botisimo, a creator tools platform for live streamers that was acquired by OpTic Gaming in 2023.
bullets:
  - Built the multi-platform streaming engine that let creators broadcast simultaneously to Twitch, YouTube, Facebook, Discord, and Trovo, with a chat relay so viewers on every platform could see and respond to each other in one shared conversation.
  - Built giveaways, raffles, polls, and viewer rewards that worked across every connected platform, plus a rules engine for schedules, timers, auto-bans, and auto-replies, with AI-driven bot responses added as LLMs matured.
  - Built the analytics and ad-targeting work behind an aggregated-audience ad product that pooled viewers across thousands of small streams into a single buy, giving creators who were too small to sell their own ads a real share of ad revenue.
  - Built customer analytics and marketing data pipelines that informed product and growth decisions across the platform.
tags:
  - TypeScript
  - JavaScript
  - React
  - Node.js
  - PostgreSQL
  - AWS
  - Docker
  - CI/CD
  - OAuth2
  - JSON Web Token (JWT)
  - Generative AI
  - API Design
  - Full-Stack Development
  - SaaS
  - Operational Software
  - Distributed Systems
  - Observability
  - Network Monitoring
  - Performance Metrics
  - Software Architecture
  - Technical Leadership
  - Streaming
  - Analytics
emphasis: normal
---

Chip Armstrong had a problem. He was an online streamer who wanted to broadcast on multiple platforms at once — Twitch and YouTube at the same time — but Twitch didn't support that. He also wanted to talk to viewers on every platform without juggling tabs, and he wanted his Twitch viewers to see what people on YouTube were saying, and vice versa. On top of that, he wanted to run promotions, raffles, and giveaways across all of his channels at the same time.

So he built Botisimo.

Botisimo let creators stream to multiple platforms at once and engage with everyone in a single conversation. A chat relay carried messages from one platform to the others, so viewers no longer felt siloed by where they happened to be watching from. Giveaways, prize drawings, and polls worked across every platform — anyone watching, anywhere, could enter the same raffle.

The most interesting part of the product, though, was the ad model.

Most streamers on Botisimo didn't have nearly enough viewers to sell their own ads. A few dozen viewers per stream is invisible to a brand like Sprite. But Botisimo had thousands of streamers, and that meant Botisimo as a platform had a real audience. By aggregating the total audience across every active stream — say, 2,000 streamers with anywhere from 10 to 100 viewers each, totaling around 200,000 concurrent viewers — Botisimo could go to an advertiser and sell that combined audience as one ad buy. A small streamer who could never have afforded to host their own ads suddenly had a real ad-revenue stream, paid out from the platform's pooled buys. That changed the economics of being a small creator.

Botisimo also did the things you'd expect from a streaming bot: rules, schedules, timers, auto-ban filters, auto-reply rules, and the ability to teach the bot a streamer's schedule so viewers could ask "when's the next stream?" and get a real answer. As Botisimo was growing, AI started to take off. We integrated AI into the platform so the bot could respond intelligently to viewers instead of just matching keywords.

In 2023, Botisimo was acquired by OpTic Gaming, who brought the product in-house for their own streamers, campaigns, and events. The public-facing version of Botisimo was wound down at that point.
