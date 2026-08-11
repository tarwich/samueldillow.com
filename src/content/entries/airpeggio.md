---
type: portfolio
title: Airpeggio
description: Fleet-management software for charter aviation teams. An AI pipeline reads inbound flight requests, drafts quotes for human review, and turns handwritten flight logs into records, on top of inbox triage, aircraft availability, reservations, and customers in one operational surface.
pubDate: 2026-05-11
image:
  src: /entries/airpeggio.svg
  alt: Airpeggio inbox dashboard reconstruction.
tags:
  - SaaS
  - aviation
  - fleet management
  - TypeScript
  - workflow software
featured: true
role: Software Engineer, ENG Technology
outcome: Helped build the AI pipeline that turns inbound charter emails into quotes for human approval and reads handwritten flight logs into records, plus the fleet-management surface around it.
caseStudyUrl: /projects/airpeggio/
demoUrl: /portfolio/airpeggio/
gallery:
  - src: /entries/airpeggio.svg
    alt: Airpeggio product surface reconstruction.
---

## The Problem

Charter aviation work starts messy. A request comes in by email. Someone needs to know who sent it, where the trip starts, where it ends, how many people are flying, whether the aircraft can handle the route, and whether the operator even wants that kind of trip. That is a lot to ask from an inbox that was built for reading messages, not running a flight operation.

Airpeggio is ENG Technology's fleet-management software for that work. The product brings requests, customers, aircraft, reservations, and management requests into one place so operators can move a trip from "somebody asked for something" to "we can quote this" without stitching the workflow together by hand.

## What the AI Does

The feature I'm proudest of is the pipeline that carries a request from email to flight log without anyone retyping it.

A charter request usually arrives as a plain email: fly from here to there, on these dates, with this many people. The assistant reads that email and turns it into a structured quote, pulling out route, dates, passenger count, and aircraft fit instead of making a coordinator parse it by hand.

Nothing goes out on its own. The AI drafts the quote and then waits. A person reviews it, fixes anything that's wrong, and approves it before it reaches the customer. That human-in-the-loop step is the whole point: the AI removes the typing and the guesswork, but a person still owns the decision.

After the trip flies, the loop closes on the other end. The assistant reads handwritten flight logs from photos and turns them into clean records, so the paperwork that normally piles up gets captured while it's fresh.

Underneath is a LangChain assistant grounded in each customer's own data, which also powers in-app chat. The hard part was never wiring up a model. It was making it accurate enough that an operator would trust it with a quote, and keeping a person in control of the parts that matter.

## The Work

My work included the product software behind those operational surfaces. The inbox is the clearest example: requests are searchable, filterable, and tied to real aviation constraints like route, passenger count, date, aircraft profile, and trip qualification. The work is not glamorous in the marketing sense. It is the kind of software where the button placement matters because someone is trying to quote a flight before another operator gets there first.

I also added iCal integration so flight schedules can stay in sync with the external calendar apps crews and coordinators already use.

The reconstruction here focuses on the inbox workflow because that is the part I have current visual references for. It shows the request table, saved inbox filters, the quick-quote modal, and the reusable shell that holds the rest of the application together.

## Demo and Live Site

What's here is a static reconstruction for portfolio context, not a live customer system. It starts with the inbox and links into the filter-management surface.

<a href="/portfolio/airpeggio/" target="_blank" rel="noopener noreferrer">Open the demo</a>

The real product is a paid, login-gated SaaS, so I can't drop you straight into the working app. The marketing site is public, though, if you want to see how it's positioned: <a href="https://airpegg.io/" target="_blank" rel="noopener noreferrer">airpegg.io</a>.
