import fs from "node:fs";
import path from "node:path";

const TAGS_PATH = path.join(process.cwd(), "content/tags.json");

export type Tag = { slug: string; ru: string; en: string };

let cached: Tag[] | null = null;

function loadTags(): Tag[] {
  if (cached) return cached;
  if (!fs.existsSync(TAGS_PATH)) {
    cached = [];
    return [];
  }
  const raw = fs.readFileSync(TAGS_PATH, "utf-8");
  const data = JSON.parse(raw) as Tag[];
  cached = data;
  return data;
}

export function getAllTags(): Tag[] {
  return loadTags();
}

export function getTagBySlug(slug: string): Tag | undefined {
  return loadTags().find((t) => t.slug === slug);
}

export function getTagSlugByRu(ruLabel: string): string | undefined {
  return loadTags().find((t) => t.ru === ruLabel)?.slug;
}

export function isAllowedTag(ruLabel: string): boolean {
  return loadTags().some((t) => t.ru === ruLabel);
}

export function getTagLabel(tag: Tag, locale: string): string {
  return locale === "en" ? tag.en : tag.ru;
}
