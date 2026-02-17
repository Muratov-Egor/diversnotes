import fs from "node:fs";
import path from "node:path";

const TAGS_PATH = path.join(process.cwd(), "content/tags.json");

export type Tag = { slug: string; ru: string };

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

/** Все теги из content/tags.json */
export function getAllTags(): Tag[] {
  return loadTags();
}

/** Тег по slug (для URL /tags/[slug]) */
export function getTagBySlug(slug: string): Tag | undefined {
  return loadTags().find((t) => t.slug === slug);
}

/** Получить slug тега по русскому названию */
export function getTagSlugByRu(ruLabel: string): string | undefined {
  return loadTags().find((t) => t.ru === ruLabel)?.slug;
}

/** Проверка: строка — разрешённый тег (по полю ru) */
export function isAllowedTag(ruLabel: string): boolean {
  return loadTags().some((t) => t.ru === ruLabel);
}
