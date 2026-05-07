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
    category: z.enum(["Tech", "Faith", "Bible", "Business", "Projects"]),
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

export const collections = { writing, projects, portfolio };
