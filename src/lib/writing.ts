import type { CollectionEntry } from "astro:content";

type Entry = CollectionEntry<"entries">;
export type WritingEntry = Entry & { data: Extract<Entry["data"], { type: "writing" }> };
export type Locale = "en" | "es";

export function isWritingEntry(entry: Entry): entry is WritingEntry {
  return entry.data.type === "writing";
}

export function writingLocale(entry: WritingEntry): Locale {
  return entry.data.locale ?? "en";
}

export function writingSlug(entry: WritingEntry): string {
  return entry.data.translationOf ?? entry.id.replace(/\.es$/, "");
}

export function writingHref(entry: WritingEntry): string {
  const slug = writingSlug(entry);
  return writingLocale(entry) === "es" ? `/es/writing/${slug}/` : `/writing/${slug}/`;
}

export function findTranslation(
  posts: WritingEntry[],
  post: WritingEntry,
  locale: Locale,
): WritingEntry | undefined {
  const slug = writingSlug(post);
  return posts.find((candidate) => writingLocale(candidate) === locale && writingSlug(candidate) === slug);
}
