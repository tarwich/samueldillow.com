---
type: writing
title: "The AI Policy Your Company Needs Before Everyone Starts Making One Up"
description: "A practical AI policy scaffold for companies that want the upside of AI without pretending employees are not already using it."
pubDate: 2026-05-18
image:
  src: /writing/ai-policy-before-chatgpt.svg
  alt: A desk with policy notes, AI prompts, and security rules arranged into four clear lanes.
category: Technology
tags:
  - ai
  - policy
  - security
  - leadership
featured: false
---

## The Daymare

I have a recurring daymare. It's sort of like a nightmare, except I'm awake and my mind just decides to throw a what-if hellscape at me. In it, I find out our company leaked PII or other sensitive information into an AI tool. Someone outside the company discovers it, and now we're dealing with lawyers, customers, screenshots, and the horrible realization that we don't have a clean way to back out, recover, or keep the same thing from happening again next week.

This healthy paranoia helps me use AI responsibly, but not everyone in an organization shares the same daymare. That's the problem. We don't know who's using AI, which tools they're using, what data they're pasting, or whether the answer they got is now sitting inside a customer email, a sales deck, a pull request, or a spreadsheet that makes somebody important feel very confident.

According to [Gallup's 2026 workplace research](https://www.gallup.com/workplace/704225/rising-adoption-spurs-workforce-changes.aspx), half of employed U.S. adults say they use AI in their role at least a few times a year, and 41% say their organization has integrated AI tools to improve organizational practices. That means AI policy isn't a future problem. It's already in the building, wearing an employee badge, and quietly helping someone write a paragraph they don't want to write.

## Don't Make Employees Hide AI

You probably shouldn't:

- completely ban AI use
- lock AI down so tightly you miss the useful parts
- shame employees who use it
- shame employees who don't
- pretend "be careful" is a policy

Instead, a useful policy should:

- encourage employees to report how they're using AI
- give them approved tools
- classify data before prompts
- teach managers how to spot risky use
- define what happens when something goes wrong

It's hard to prepare for a threat you can't see. You don't want employees hiding AI under the table. You also don't want them feeling watched every time they use a tool that may genuinely help them do better work. The middle ground is visibility without surveillance.

Create a place where people can share useful AI patterns. In Microsoft Teams you can create a **Loop** for collaborating on ideas. Slack provides a **Canvas** or **List** for the same. You could even use a forum or knowledge base such as Notion. The point is to make normal use visible enough that the company can learn where AI is helping, where people are confused, and where the guardrails need to move.

## Give People An Approved Place To Work

If the company wants employees to stop bringing their own AI tools, it needs to provide an approved place to work. Something like [ChatGPT Business](https://help.openai.com/en/articles/8798634-managing-data-sharing-and-privacy-in-chatgpt-and-other-ai-chatbots), with Codex seats where needed, is a reasonable example.

[OpenAI's security and privacy page](https://openai.com/security-and-privacy/) says two things that matter here:

- ChatGPT Business doesn't train models on your organization's data by default.
- Your content is encrypted at rest and in transit between you and OpenAI, and between OpenAI and its service providers.

That doesn't mean "paste anything you want and call it secure." It means an approved workspace is better than dozens of unmanaged personal accounts, mystery browser extensions, and free tools nobody has reviewed. It also means more breathing room in the event that something does go wrong.

Don't:

- push employees to use AI if they aren't already
- make them compete for a tiny number of seats
- require a mini grant proposal before they get access
- treat approved AI access like a reward for power users

Do:

- provide a clear place to request access
- connect the request flow to the internal AI forum
- make the rules easy to find
- check in later and ask whether the tool made work better

## Classify The Data Before The Prompt

The easiest AI policy to use is one employees can remember while they're working. I like risk lanes because they make people classify the data before they classify the tool. The [EU AI Act FAQ](https://ai-act-service-desk.ec.europa.eu/en/faq) uses risk-based thinking too, with categories such as unacceptable risk, high risk, transparency risk, and minimal to no risk. I wouldn't pretend the company policy below is the EU AI Act. It's just borrowing the practical idea that not every AI use deserves the same response.

### Green: Use Freely

Use approved AI tools for low-risk work when the input doesn't include confidential company information, customer data, employee data, source code, credentials, contracts, financial records, or regulated information.

Examples:

- brainstorming headlines
- summarizing public articles
- drafting generic internal announcements
- explaining public documentation
- creating first-pass outlines

### Yellow: Use With Judgment

Use approved AI tools with internal business information when the information isn't sensitive, regulated, or restricted, and when a human reviews the output before sharing or acting on it.

Examples:

- turning meeting notes into action items
- cleaning up internal documentation
- drafting a project plan
- rewording non-sensitive process notes

For yellow work, peer review helps. Have a colleague or supervisor scan the output for leaks, bad assumptions, or confident nonsense. A second set of eyes can often catch what you missed because you were too close to the work, too tired, or too happy that the AI finally stopped saying "in today's fast-paced world."

### Red: Get Approval First

Get approval before using AI with sensitive business information.

Examples:

- customer data
- employee data
- legal documents
- financial analysis
- production source code
- vendor contracts
- security incidents

If possible, provide a reviewed redaction helper for this lane. A tool that replaces names, account numbers, contract details, and customer identifiers with generic placeholders can make useful AI work possible without handing the model the whole family silverware drawer. That helper can be low cost, but it still needs security review. A redaction tool that leaks is just a leak with better branding.

### Black: Do Not Paste This

Don't enter prohibited data into AI systems unless the company has explicitly approved a secure workflow for that exact use.

Examples:

- passwords
- API keys
- private keys
- unreleased financials
- medical records
- government IDs
- raw customer exports
- privileged legal communications

## Coding Agents Need Their Own Rules

AI policy can't stop at chatbots anymore. Coding agents can read repositories, edit files, run commands, inspect logs, and open pull requests. That's powerful. It's also a weird thing to hand to a tool without writing down what it's allowed to do.

For engineering teams, I'd put a short guidance file in the repo. That could be `AGENTS.md`, `CLAUDE.md`, or an internal engineering handbook page. The name matters less than the behavior.

Starter guidance:

```md
# AI Coding Agent Rules

- Don't paste secrets, credentials, private customer data, or regulated data into AI tools.
- Don't run destructive commands without explicit human approval.
- Keep changes scoped to the requested task.
- Don't rewrite unrelated files.
- Add or update tests when changing behavior.
- Explain verification clearly before asking for review.
- Treat AI-generated code like junior developer code: useful, but not trusted until reviewed.
```

That last line matters. AI can move fast, but speed isn't accountability. A human still owns the merge. A human still owns the customer impact. A human still gets to explain why a credential ended up in a prompt if the policy was "eh, figure it out."

## Mitigation: Catch Problems While They're Small

Managers should check in with employees and ask how AI tools have helped them. They can share their own experience or pass along useful tips from other employees. This creates a safer place to talk about AI usage without making the employee feel audited.

As the employee talks, classify the usage from green to black in your head. If it sounds yellow or red, say something like, "That sounds like yellow usage to me. Does that feel right to you?" That's softer than a direct accusation. If they agree, ask what safeguards they're using.

If the usage sounds black, slow down. Bring up the concern as an open question. If the employee becomes defensive, it'll be harder to learn what happened and how far the data traveled. Once you're on the same page, make it clear that you're there to help with recovery, not to turn one mistake into a public hanging.

## Recovery: What To Do After A Bad Paste

> Oh no! An employee uploaded sensitive information to AI. Now what?

Don't improvise the incident process in the middle of the incident. This is one reason I'd rather have employees working inside an approved business workspace than a pile of personal accounts.

If the employee uploaded government IDs or regulated personal information:

- involve the Cyber Security Incident Response Team
- remove affected chats or shared links when possible
- check whether the tool has memory or similar persistence features
- document what was uploaded

If the employee uploaded secrets such as passwords or API keys:

- start the credential rotation plan immediately
- walk the employee through it collaboratively
- document the exposed systems
- look for related secrets that may have been copied with it

People share more when they feel supported than they do when they feel cornered, and in an incident the missing detail is often the one that matters.

## The Version I Would Want To Build

The policy I'd want is short, specific, and teachable. It would tell employees what they can do today, what requires approval, and what's off limits. It would give managers examples they can repeat. It would give security and legal enough control to sleep at night. It would give builders enough room to build.

I love helping companies move from scattered experiments to a system people can actually trust. This can be implemented with paper policies, approved workspaces, internal guidance files, lightweight review flows, or purpose-built tools depending on how the team uses AI. If your company is somewhere between "we banned it" and "everyone is quietly using it," that's the exact mess I like cleaning up.

<small>Sources: [Gallup workplace AI adoption research](https://www.gallup.com/workplace/704225/rising-adoption-spurs-workforce-changes.aspx), [OpenAI security and privacy](https://openai.com/security-and-privacy/), [ChatGPT Business data and privacy](https://help.openai.com/en/articles/8798634-managing-data-sharing-and-privacy-in-chatgpt-and-other-ai-chatbots), and [EU AI Act Service Desk FAQ](https://ai-act-service-desk.ec.europa.eu/en/faq).</small>
