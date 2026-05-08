import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseEntry = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/entries" }),
  schema: z.discriminatedUnion("type", [
    baseEntry.extend({
      type: z.literal("writing"),
      category: z.enum(["Tech", "Faith", "Bible", "Business", "Play"]),
    }),
    baseEntry.extend({
      type: z.literal("portfolio"),
      role: z.string(),
      outcome: z.string(),
      caseStudyUrl: z.string().optional(),
      gallery: z
        .array(
          z.object({
            src: z.string(),
            alt: z.string(),
          }),
        )
        .default([]),
    }),
    baseEntry.extend({
      type: z.literal("game"),
      status: z.enum(["Prototype", "Live", "Archived"]).default("Prototype"),
      playUrl: z.string(),
    }),
  ]),
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

export const collections = { entries, resume };
