import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseEntry = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: baseEntry.extend({
    category: z.enum(["Tech", "Faith", "Bible", "Business", "Projects", "Play"]),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: baseEntry.extend({
    status: z.enum(["Prototype", "Live", "Archived"]).default("Prototype"),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/portfolio" }),
  schema: baseEntry.extend({
    role: z.string(),
    outcome: z.string(),
    link: z.string().url().optional(),
  }),
});

const resume = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/resume" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    dateLabel: z.string().optional(),
    summary: z.string(),
    bullets: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    emphasis: z.enum(["promoted", "normal", "subdued"]).default("normal"),
    location: z.string().optional(),
  }),
});

export const collections = { writing, projects, portfolio, resume };
