import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_BASE = path.join(process.cwd(), "content/blog");

function getBlogDir(locale: string = "ru"): string {
  return path.join(BLOG_BASE, locale);
}

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft?: boolean;
  updatedAt?: string;
  cover?: string;
  series?: string;
};

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

export function getAllPosts(locale: string = "ru"): BlogPostMeta[] {
  const dir = getBlogDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts: BlogPostMeta[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    if (data.draft === true) continue;
    posts.push({
      slug: data.slug ?? slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: toDateString(data.date) || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      draft: data.draft,
      updatedAt: toDateString(data.updatedAt) || undefined,
      cover: data.cover,
      series: data.series,
    });
  }
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

const FIRST_PAGE_SIZE = 7;
const OTHER_PAGES_SIZE = 6;

export type BlogPageResult = {
  posts: BlogPostMeta[];
  total: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
};

function getTotalPages(total: number): number {
  if (total <= FIRST_PAGE_SIZE) return 1;
  return 1 + Math.ceil((total - FIRST_PAGE_SIZE) / OTHER_PAGES_SIZE);
}

export function getPostsForPage(
  page: number,
  locale: string = "ru",
): BlogPageResult {
  const all = getAllPosts(locale);
  const total = all.length;
  const totalPages = getTotalPages(total);
  const safePage = Math.max(1, Math.min(page, totalPages));

  const start =
    safePage === 1 ? 0 : FIRST_PAGE_SIZE + (safePage - 2) * OTHER_PAGES_SIZE;
  const count =
    safePage === 1
      ? Math.min(FIRST_PAGE_SIZE, total)
      : Math.min(OTHER_PAGES_SIZE, total - start);
  const posts = all.slice(start, start + count);

  return {
    posts,
    total,
    totalPages,
    currentPage: safePage,
    perPage: count,
  };
}

export function getPostRaw(slug: string, locale: string = "ru"): string | null {
  const dir = getBlogDir(locale);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}

export function getRelatedPosts(
  currentSlug: string,
  currentTags: string[],
  currentSeries?: string | null,
  limit: number = 6,
  locale: string = "ru",
): BlogPostMeta[] {
  const all = getAllPosts(locale).filter((p) => p.slug !== currentSlug);
  if (all.length === 0) return [];

  const scored = all.map((post) => {
    let score = 0;
    if (currentSeries && post.series === currentSeries) score += 10;
    const commonTags = post.tags.filter((t) => currentTags.includes(t)).length;
    score += commonTags * 3;
    return { post, score };
  });
  scored.sort(
    (a, b) => b.score - a.score || (b.post.date > a.post.date ? 1 : -1),
  );

  const withScore = scored.filter((s) => s.score > 0);
  const toTake = withScore.length > 0 ? withScore : scored;
  return toTake.slice(0, limit).map((s) => s.post);
}

export function getPostsByTag(
  tagRu: string,
  locale: string = "ru",
): BlogPostMeta[] {
  return getAllPosts(locale).filter((post) => post.tags.includes(tagRu));
}
