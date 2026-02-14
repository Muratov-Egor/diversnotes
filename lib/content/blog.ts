import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

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

/** Список всех постов (только frontmatter), без draft, по дате — новые первые */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts: BlogPostMeta[] = [];
  for (const file of files) {
    const slug = getSlugFromFilename(file);
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
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

/** Число страниц: первая — 7 постов, остальные — по 6. */
function getTotalPages(total: number): number {
  if (total <= FIRST_PAGE_SIZE) return 1;
  return 1 + Math.ceil((total - FIRST_PAGE_SIZE) / OTHER_PAGES_SIZE);
}

/** Посты для страницы пагинации (1-based). Первая страница — 7 постов, остальные — по 6. */
export function getPostsForPage(page: number): BlogPageResult {
  const all = getAllPosts();
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

/** Сырой контент поста по slug (frontmatter + body). null если не найден */
export function getPostRaw(slug: string): string | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}
