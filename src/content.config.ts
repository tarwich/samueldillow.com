import { defineCollection, z, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";

const baseEntry = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  locale: z.enum(["en", "es"]).default("en"),
  translationOf: z.string().optional(),
  image: z.object({
    src: z.string(),
    alt: z.string(),
  }),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

const writingEntry = baseEntry.extend({
  type: z.literal("writing"),
  category: z.string(),
});

const portfolioEntry = baseEntry.extend({
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
});

const gameEntry = baseEntry.extend({
  type: z.literal("game"),
  status: z.enum(["Prototype", "Live", "Archived"]).default("Prototype"),
  playUrl: z.string(),
});

const entries = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/entries" }),
  schema: z.discriminatedUnion("type", [writingEntry, portfolioEntry, gameEntry]),
});


export type Entry = CollectionEntry<"entries">;

export type WritingEntry = Omit<Entry, "data"> & { data: Extract<Entry["data"], { type: "writing" }> };
export const isWritingEntry = (entry: Entry): entry is WritingEntry =>
  entry.data.type === "writing";

export type PortfolioEntry = Omit<Entry, "data"> & { data: Extract<Entry["data"], { type: "portfolio" }> };
export const isPortfolioEntry = (entry: Entry): entry is PortfolioEntry =>
  entry.data.type === "portfolio";

export type GameEntry = Omit<Entry, "data"> & { data: Extract<Entry["data"], { type: "game" }> };
export const isGameEntry = (entry: Entry): entry is GameEntry =>
  entry.data.type === "game";

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

const bookChapters = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/books/why-be-happy" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    book: z.literal("why-be-happy"),
  }),
});

export const collections = { entries, resume, bookChapters };
