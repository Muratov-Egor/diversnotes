import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const MARINE_LIFE_DIR = path.join(process.cwd(), "content/marine-life");

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
};

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

/** Список всех записей (только frontmatter), без draft */
export function getAllMarineLife(): MarineLifeMeta[] {
  if (!fs.existsSync(MARINE_LIFE_DIR)) return [];
  const files = fs
    .readdirSync(MARINE_LIFE_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const items: MarineLifeMeta[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const raw = fs.readFileSync(path.join(MARINE_LIFE_DIR, file), "utf-8");
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

/** Записи для страницы пагинации (1-based). По 9 карточек на странице. */
export function getMarineLifeForPage(page: number): MarineLifePageResult {
  const all = getAllMarineLife();
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

/** Сырой контент записи по slug. null если не найден */
export function getMarineLifeRaw(slug: string): string | null {
  const mdxPath = path.join(MARINE_LIFE_DIR, `${slug}.mdx`);
  const mdPath = path.join(MARINE_LIFE_DIR, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}

/**
 * Похожие записи по тегам, без текущей. Если есть совпадения по тегам — до limit штук; иначе — любые последние.
 */
export function getRelatedMarineLife(
  currentSlug: string,
  currentTags: string[],
  limit: number = 6
): MarineLifeMeta[] {
  const all = getAllMarineLife().filter((m) => m.slug !== currentSlug);
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
