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
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
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

/** Сырой контент поста по slug (frontmatter + body). null если не найден */
export function getPostRaw(slug: string): string | null {
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(mdxPath)) return fs.readFileSync(mdxPath, "utf-8");
  if (fs.existsSync(mdPath)) return fs.readFileSync(mdPath, "utf-8");
  return null;
}
