---
type: portfolio
title: Airpeggio
description: Fleet-management software for charter aviation teams, with inbox triage, quoting workflows, aircraft availability, reservations, customers, and management requests in one operational surface.
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
outcome: Helped build the fleet-management product surface used to turn inbound charter requests into qualified trips, quotes, reservations, and aircraft-management work.
caseStudyUrl: /projects/airpeggio/
demoUrl: /portfolio/airpeggio/
gallery:
  - src: /entries/airpeggio.svg
    alt: Airpeggio product surface reconstruction.
---

## The Problem

Charter aviation work starts messy. A request comes in by email. Someone needs to know who sent it, where the trip starts, where it ends, how many people are flying, whether the aircraft can handle the route, and whether the operator even wants that kind of trip. That is a lot to ask from an inbox that was built for reading messages, not running a flight operation.

Airpeggio is ENG Technology's fleet-management software for that work. The product brings requests, customers, aircraft, reservations, and management requests into one place so operators can move a trip from "somebody asked for something" to "we can quote this" without stitching the workflow together by hand.

## The Work

My work has been on the product software behind those operational surfaces. The inbox is the clearest example: requests are searchable, filterable, and tied to real aviation constraints like route, passenger count, date, aircraft profile, and trip qualification. The work is not glamorous in the marketing sense. It is the kind of software where the button placement matters because someone is trying to quote a flight before another operator gets there first.

The reconstruction here focuses on the inbox workflow because that is the part I have current visual references for. It shows the request table, saved inbox filters, the quick-quote modal, and the reusable shell that holds the rest of the application together.

## Demo

This is a static reconstruction for portfolio context, not a live customer system. It starts with the inbox and links into the filter-management surface.

<a href="/portfolio/airpeggio/" target="_blank" rel="noopener noreferrer">Open the demo</a>
