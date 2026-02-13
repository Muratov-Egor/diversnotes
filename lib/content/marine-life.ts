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

/** Сырой контент записи по slug. null если не найден */
export function getMarineLifeRaw(slug: string): string | null {
  const mdxPath = path.join(MARINE_LIFE_DIR, `${slug}.mdx`);
  const mdPath = path.join(MARINE_LIFE_DIR, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}
