---
type: writing
title: Videos That Helped Me Get Hired
description: The changes I made so recruiters could find me, screening calls became useful practice, and interviews felt more like working sessions.
pubDate: 2026-07-23
image:
  src: /writing/questions-that-get-you-hired.png
  alt: A recruiter and hiring manager choose between an impressive candidate and one who is easier to work with.
category: Career
tags:
  - job search
  - LinkedIn
  - interviews
featured: false
hidden: false
---

<div class="video-guide-layout" aria-hidden="true"></div>

<style>
  .article-prose:has(.video-guide-layout) {
    .video-guide-layout {
      display: none;
    }

    .video-thumbnail-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      width: min(100%, 760px);
      margin: 1.8em auto 2.2em;

      .video-thumbnail,
      .video-thumbnail-card {
        min-width: 0;
        border: 1px solid rgba(34, 32, 28, 0.18);
        border-radius: 2px;
        aspect-ratio: 16 / 9;
        overflow: hidden;
      }

      .video-thumbnail {
        position: relative;
        display: block;
        background: #181714;
        box-shadow: 0 5px 14px rgba(56, 46, 30, 0.12);

        &:focus-visible {
          outline: 3px solid var(--rust);
          outline-offset: 2px;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          margin: 0;
          border-radius: 0;
          object-fit: cover;
        }
      }

      .video-thumbnail-card {
        display: grid;
        place-items: center;
        padding: 12px;
        background: var(--rust);
        color: #fff8ed;
        font-family: var(--mono);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        line-height: 1.25;
        text-align: center;
        text-transform: uppercase;
      }
    }

    .answer-reframes {
      display: grid;
      gap: 14px;
      margin: 1.6em 0 0;

      .answer-reframe {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 20px;
        border: 1px solid rgba(199, 186, 165, 0.82);
        border-radius: 4px;
        padding: 18px 20px;
        background: rgba(247, 243, 234, 0.58);
      }

      dt,
      dd {
        margin: 0;
        color: #2b251f;
        font-size: 0.98rem;
        line-height: 1.5;
      }

      .answer-reframe__label {
        display: block;
        margin-bottom: 4px;
        color: var(--rust);
        font-family: var(--mono);
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .answer-reframe__arrow {
        color: var(--rust);
        font-size: 1.2rem;
      }
    }

    .video-embed {
      position: relative;
      width: 100%;
      margin: 1.35em 0 1.7em;
      border: 1px solid rgba(34, 32, 28, 0.18);
      border-radius: 4px;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #181714;
      box-shadow: 0 12px 32px rgba(56, 46, 30, 0.12);

      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    }

    .video-entry-divider {
      clear: both;
      height: 1px;
      margin: 2.75em 0 2em;
      border: 0;
      background: linear-gradient(
        90deg,
        var(--rust) 0 72px,
        rgba(199, 186, 165, 0.82) 72px 100%
      );
    }
  }

  @media (max-width: 640px) {
    .article-prose:has(.video-guide-layout) {
      .video-thumbnail-grid {
        gap: 6px;

        .video-thumbnail::after {
          width: 16px;
          height: 16px;
          font-size: 0.5rem;
        }

        .video-thumbnail-card {
          padding: 4px;
          font-size: 0.5rem;
        }
      }

      .answer-reframes {
        .answer-reframe {
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .answer-reframe__arrow {
          transform: rotate(90deg);
          justify-self: start;
        }
      }
    }
  }

  @media (min-width: 900px) {
    .article-prose:has(.video-guide-layout) {
      max-width: 1100px;

      &::after {
        display: block;
        clear: both;
        content: "";
      }

      h2,
      h3 {
        clear: both;
      }

      .video-embed {
        width: 49%;
        margin-top: 0.35em;
        margin-bottom: 1.2em;

        &.video-embed--left {
          float: left;
          margin-right: 32px;
        }

        &.video-embed--right {
          float: right;
          margin-left: 32px;
        }
      }
    }
  }
</style>

I recently got a good job offer. I didn't get it by carpet-bombing every job
board with the same résumé and hoping somebody eventually developed poor
judgment. I got it by changing how people found me, how I handled the first
call, and how I behaved once I was in the interview.

<nav class="video-thumbnail-grid" aria-label="Videos referenced in this article">
  <a class="video-thumbnail" href="#video-linkedin" aria-label="Jump to 6 LinkedIn Mistakes Keeping You In Your Old Job">
    <img src="https://i.ytimg.com/vi/RDjwaXnToes/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <a class="video-thumbnail" href="#video-introduction" aria-label="Jump to How to Introduce Yourself—and Get Hired">
    <img src="https://i.ytimg.com/vi/f_N3PGvnVKg/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <a class="video-thumbnail" href="#video-chronology" aria-label="Jump to Tell Me About Yourself">
    <img src="https://i.ytimg.com/vi/TQHW7gGjrCQ/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <span class="video-thumbnail-card">Don't drive to your job</span>
  <a class="video-thumbnail" href="#video-recruiter" aria-label="Jump to Psychology Says You Can Land Any Job">
    <img src="https://i.ytimg.com/vi/m4U4iDuZaDk/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <a class="video-thumbnail" href="#video-hiring-manager" aria-label="Jump to The Interview Secret to Getting Hired">
    <img src="https://i.ytimg.com/vi/JY4rnwYv51A/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <a class="video-thumbnail" href="#video-consulting" aria-label="Jump to Stop Answering Interview Questions">
    <img src="https://i.ytimg.com/vi/vNlUz9XvqJ0/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <a class="video-thumbnail" href="#video-framing" aria-label="Jump to Why Lying Gets You Hired">
    <img src="https://i.ytimg.com/vi/T__1QViXUxk/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" />
  </a>
  <span class="video-thumbnail-card">Drive your job to you</span>
</nav>

## The process that got me hired

### 1. I stopped applying for jobs

I stopped applying for jobs entirely. I never submitted another application
after making this change. Every opportunity came through a recruiter, and it
worked really well for me.

The process was taking all of my time. Filter the listings. Figure out whether
one is still real. Adjust the résumé. Fill out a form that asks for everything
already on the résumé. Wait for the automated rejection. Repeat until bedtime.

Only half the companies I applied to responded, and none of them would explain
why they turned me down. This is where recruiters have a massive advantage. A
company who hires a recruiter is incentivized to tell the recruiter what they
liked and didn't like in a candidate. And recruiters have an incentive to share
that information with me. 

So I moved that effort to the other side of the process. I made myself easier
for recruiters to find, then used the calls I received as feedback. [↓ Farah
Sharghi's LinkedIn video](#video-linkedin) helped me understand what recruiters
were actually searching for: a role, location, skills, tools, industries, and
employers. I rewrote my profile around the words they would use, without
turning it into a sack of keywords wearing a headshot.

Once the calls started, I paid attention to the jobs they brought me. If the
roles were close but wrong, I changed a few words in my headline, About
section, or skills. Then I waited to see what changed. That gave me something
applications never had: a feedback loop.

Other people have had good results applying directly. I'm not claiming
applications don't work. But for me, the no-apply method was clutch: recruiters
brought me steady opportunities, every call gave me practice, and one
eventually became the offer.

### 2. I made it easy to check me out

LinkedIn got me into a search result. It still had to give the recruiter a
reason to stop.

I rewrote my About and Experience sections around results instead of duties.
The goal wasn't to recite every technology I've touched. It was to make three
things obvious: what kind of problems I solve, who I solve them for, and what
changed because I was there.

I also turned on **Open to → Finding a new job**, filled in the roles and
locations I wanted, and set **Visibility → Recruiters only**. I wanted to drive
recruiters to me while keeping a business-as-usual look to my LinkedIn page.

Then I gave people somewhere else to go. For me, that was a personal website.
It didn't need to be a grand monument to my career. It needed to be a reliable
place where someone could learn what I do, see a little evidence, and find my
résumé, phone number, and email.

That landing page could be a website, a YouTube or Instagram channel, or a
Linktree. The format matters less than the job it does. Someone who is already
interested shouldn't have to go digging for the next reason to call you.

### 3. I learned how to talk to recruiters

Recruiter calls and employer interviews require two different frames of mind.
With an employer, I drive the conversation toward the problems they need to
solve. With a recruiter, I play tennis (batting back their questions with
straight answers). I stay compliant with their process, helpful, and to the
point.

The employer is deciding whether to let you into the company. The recruiter is
trying to get a viable candidate through the process. By the time a recruiter
calls, they have already seen something they like. They would prefer for you to
be the answer because that lets them finish the job they were hired to do.

[↓ Lucy's video about the psychology of hiring](#video-recruiter) helped that
click for me. By the time a recruiter calls you, they're already making a bet on
you, and they want you to win. They aren't waiting for a dazzling performance.
They need clear answers, steady energy, and enough evidence to feel good about
putting you in front of the employer.

Each recruiter also has filter questions, and here it's important not to ramble.
A classic example is that I use about five different AIs: Codex, Cursor, Claude,
Gemini, Perplexity. When a recruiter asks for my favorite AI I learned they're
only asking if I use Claude, so telling them about the others was confusing
them. It took me a few calls to learn to detect these questions, but I got the
hang of it.

### 4. I prepared a useful answer to “Tell me about yourself”

About one recruiter in five asked this, and nearly every employer did. I
stopped improvising it.

I begin with the 20-word business-card idea from [↓ Rebecca Okamoto's
talk](#video-introduction):

> I help small teams solve complex problems without compromising their personal
> goals.

That sentence isn't my entire history. It tells the listener how to understand
the history that comes next.

Then I use the chronology I learned from [↓ Bill's interview
advice](#video-chronology). I walk through the parts
of my résumé that matter to this role. I don't explain every job I've had. I
show how one relevant choice led to the next.

I also answer the question they are going to ask later: why am I leaving, or
why did I leave? I end the chronology with what I want to grow into, such as
working with larger teams, learning a new industry, or doing more with AI. Then
I use Bill's simple landing: “And that's what brings me here today.”

The recruiter version is shorter because they usually don't know the
company's business problems in much detail. With an employer, I connect the
same history to the work they need done. Same person, same facts, different
listener.

### 5. I learned to drive the meeting

I don't go into an interview as if I'm competing with the other candidates for
a job. That frame puts all of my attention on saying the right things and
getting picked. Based on [↓ Lucy's advice to act like a
consultant](#video-consulting), I imagine I'm a consultant or an employee who
is already responsible for helping solve a problem.

With that frame in mind, I drive the conversation. I tell them what I want us
to accomplish in the meeting and how I'd like to structure it, while keeping
the focus on what they need and how I can help.

When they ask me to tell them about myself, I give them the introduction and
chronology above. I ask what problem they're trying to solve and what they've
already done to solve it. Once they describe the problem, I start strategizing
with them right there in the interview. 

This helps answer other questions: _What's the job about? Why are they hiring
now? Is this a new initiative, or are they backfilling a role?_ It
also gives me a better idea of what I'm getting into: How do they respond to
questions? Are they collaborative, combative, progressive, or scattered? What if
the role isn't right for me? As a bonus, it lets the employer see how I think
and gives them confidence that I'm ready to start helping with the problem.

It's also important to know what not to say. In [↓ Sharghi's
video](#video-framing), she explains that being too honest can confuse
employers. Why don't you have a lot on your resume, why did you leave your last
job, etc. When I answer, I try to always frame the positive.

<dl class="answer-reframes">
  <div class="answer-reframe">
    <dt>
      <span class="answer-reframe__label">Instead of</span>
      “My job is boring.”
    </dt>
    <span class="answer-reframe__arrow" aria-hidden="true">→</span>
    <dd>
      <span class="answer-reframe__label">Frame it as</span>
      “I'm looking for a challenging opportunity.”
    </dd>
  </div>

  <div class="answer-reframe">
    <dt>
      <span class="answer-reframe__label">Instead of</span>
      “My boss was awful.”
    </dt>
    <span class="answer-reframe__arrow" aria-hidden="true">→</span>
    <dd>
      <span class="answer-reframe__label">Frame it as</span>
      “I'm looking for a collaborative environment.”
    </dd>
  </div>
</dl>

## The videos

These are the videos I would start with. You don't need to memorize them all at
once. Watch for one useful change, put it into practice, and come back for
another when you need it.

<hr class="video-entry-divider" />
<a id="video-linkedin"></a>

### [6 LinkedIn Mistakes Keeping You In Your Old Job](https://youtu.be/RDjwaXnToes)

**Farah Sharghi · 6 minutes**

<div class="video-embed video-embed--left">
  <iframe
    src="https://www.youtube-nocookie.com/embed/RDjwaXnToes"
    title="Ex-Google Recruiter Explains: 6 LinkedIn Mistakes Keeping You In Your Old Job"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

Sharghi shows what recruiters see and how they search. Use the terms recruiters
search for, then describe results that give them a reason to keep reading.

- Put the role, tools, skills, and industries you want in the sections
  recruiters actually search.
- Describe outcomes instead of copying a job description into your Experience
  section.

<hr class="video-entry-divider" />
<a id="video-introduction"></a>

### [How to Introduce Yourself—and Get Hired](https://youtu.be/f_N3PGvnVKg)

**Rebecca Okamoto at TEDxNorthwesternU · 10 minutes**

<div class="video-embed video-embed--right">
  <iframe
    src="https://www.youtube-nocookie.com/embed/f_N3PGvnVKg"
    title="How to introduce yourself and get hired by Rebecca Okamoto"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

Okamoto gives a simple formula for explaining what you do: “I help [people]
achieve [a result].” It gives the listener a clear starting point and earns the
next question.

- Write a short version that earns the next question.
- Adjust it for the listener without changing the facts underneath it.

<hr class="video-entry-divider" />
<a id="video-chronology"></a>

### [Tell Me About Yourself | Best Answer (from former CEO)](https://youtu.be/TQHW7gGjrCQ)

**The Companies Expert · 5 minutes**

<div class="video-embed video-embed--left">
  <iframe
    src="https://www.youtube-nocookie.com/embed/TQHW7gGjrCQ"
    title="Tell Me About Yourself | Best Answer (from former CEO)"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

Bill gives the chronology I use after my short introduction. Walk through the
parts of your history that matter to this role, explain what you want to grow
into next, and land on why that path brought you into this meeting.

- Leave out jobs and details that don't help the listener understand the fit.
- Answer why you're leaving before it becomes a loose end later in the call.

<hr class="video-entry-divider" />
<a id="video-recruiter"></a>

### [Psychology Says You Can Land Any Job Once You Understand These 6 Principles](https://youtu.be/m4U4iDuZaDk)

**Career Growth With Lucy · 12 minutes**

<div class="video-embed video-embed--right">
  <iframe
    src="https://www.youtube-nocookie.com/embed/m4U4iDuZaDk"
    title="Psychology says you can land any job once you understand these 6 principles"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

By the time a recruiter calls, they have already found a reason to bet on you.
Lucy's six principles helped me make that bet easier: answer clearly, bring
steady energy, and give them evidence they can confidently take to the
employer.

- Give clear answers with steady, positive energy.
- Use specific evidence so the recruiter can confidently present you to the
  employer.

<hr class="video-entry-divider" />
<a id="video-hiring-manager"></a>

### [The Interview Secret to Getting Hired](https://youtu.be/JY4rnwYv51A)

**Farah Sharghi · 6 minutes**

<div class="video-embed video-embed--left">
  <iframe
    src="https://www.youtube-nocookie.com/embed/JY4rnwYv51A"
    title="Ex-Google Recruiter Explains: The Interview Secret to Getting Hired"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

This reframes the interview around why the role exists. The company has a
problem or goal, and the hiring manager is trying to decide whether you can
help without creating a new problem along the way.

- Research the reason behind the opening, not just the company About page.
- Ask how success will be measured and connect it to outcomes you've produced
  before.

<hr class="video-entry-divider" />
<a id="video-consulting"></a>

### [Stop Answering Interview Questions (Do This Instead)](https://youtu.be/vNlUz9XvqJ0)

**Career Growth With Lucy · 13 minutes**

<div class="video-embed video-embed--right">
  <iframe
    src="https://www.youtube-nocookie.com/embed/vNlUz9XvqJ0"
    title="Stop Answering Interview Questions and Do This Instead"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

Lucy explains the consultant frame directly. Answer what the interviewer asks,
then learn enough about the business to understand why the role exists and
which parts of your experience matter.

- Ask what they need solved and what they have already tried.
- Work through the problem with them instead of waiting for the next question.

<hr class="video-entry-divider" />
<a id="video-framing"></a>

### [Why “Lying” Gets You Hired](https://youtu.be/T__1QViXUxk)

**Farah Sharghi · 12 minutes**

<div class="video-embed video-embed--left">
  <iframe
    src="https://www.youtube-nocookie.com/embed/T__1QViXUxk"
    title="Ex-Google Recruiter Explains Why Lying Gets You Hired"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

Sharghi shows how to frame honest answers around what matters to the role.
Focus on what you're moving toward, leave irrelevant baggage out of the answer,
and claim the work you actually did—even when your official title undersold it.

- Explain what you're moving toward instead of unloading what you're escaping.
- Claim the work you actually did, even when your official title undersold it.
