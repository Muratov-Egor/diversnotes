import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ML_BASE = path.join(process.cwd(), "content/marine-life");

function getMarineLifeDir(locale: string = "ru"): string {
  return path.join(ML_BASE, locale);
}

export type MarineLifeMeta = {
  slug: string;
  title: string;
  nameEn: string;
  description: string;
  latinName?: string;
  depthRange?: string;
  locations?: string[];
  images?: string[];
  tags?: string[];
  draft?: boolean;
  size?: string;
  family?: string;
  category?: string;
  activity?: string;
  conservationStatus?: string;
};

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

export function getAllMarineLife(locale: string = "ru"): MarineLifeMeta[] {
  const dir = getMarineLifeDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const items: MarineLifeMeta[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    if (data.draft === true) continue;
    items.push({
      slug: data.slug ?? slug,
      title: data.title ?? "",
      nameEn: data.nameEn ?? "",
      description: data.description ?? "",
      latinName: data.latinName,
      depthRange: data.depthRange,
      locations: Array.isArray(data.locations) ? data.locations : undefined,
      images: Array.isArray(data.images) ? data.images : undefined,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      draft: data.draft,
      size: typeof data.size === "string" ? data.size : undefined,
      family: typeof data.family === "string" ? data.family : undefined,
      category: typeof data.category === "string" ? data.category : undefined,
      activity: typeof data.activity === "string" ? data.activity : undefined,
      conservationStatus:
        typeof data.conservationStatus === "string"
          ? data.conservationStatus
          : undefined,
    });
  }
  return items;
}

const MARINE_LIFE_PER_PAGE = 9;

export type MarineLifePageResult = {
  items: MarineLifeMeta[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

export function getMarineLifeForPage(
  page: number,
  locale: string = "ru",
): MarineLifePageResult {
  const all = getAllMarineLife(locale);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / MARINE_LIFE_PER_PAGE));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * MARINE_LIFE_PER_PAGE;
  const items = all.slice(start, start + MARINE_LIFE_PER_PAGE);

  return {
    items,
    total,
    totalPages,
    currentPage: safePage,
    perPage: items.length,
  };
}

export function getMarineLifeRaw(
  slug: string,
  locale: string = "ru",
): string | null {
  const dir = getMarineLifeDir(locale);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}

export function getRelatedMarineLife(
  currentSlug: string,
  currentTags: string[],
  limit: number = 6,
  locale: string = "ru",
): MarineLifeMeta[] {
  const all = getAllMarineLife(locale).filter((m) => m.slug !== currentSlug);
  if (all.length === 0) return [];

  const scored = all.map((item) => {
    const itemTags = item.tags ?? [];
    const commonTags = itemTags.filter((t) => currentTags.includes(t)).length;
    return { item, score: commonTags * 3 };
  });
  scored.sort((a, b) => b.score - a.score);

  const withScore = scored.filter((s) => s.score > 0);
  const toTake = withScore.length > 0 ? withScore : scored;
  return toTake.slice(0, limit).map((s) => s.item);
}

export function getMarineLifeByTag(
  tagRu: string,
  locale: string = "ru",
): MarineLifeMeta[] {
  return getAllMarineLife(locale).filter(
    (item) => item.tags && item.tags.includes(tagRu),
  );
}
