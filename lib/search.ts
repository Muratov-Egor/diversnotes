import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cleanText } from "@/utils/textUtils";

export type SearchResult = {
  title: string;
  path: string;
  category: "blog" | "marine-life";
  image?: string;
  nameEn?: string;
  snippet: { before: string; match: string; after: string };
};

function findSearchSnippet(
  text: string,
  query: string,
  title: string,
  titleEn: string
): { before: string; match: string; after: string } {
  const words = text.split(" ").filter(Boolean);
  const queryWords = query.split(" ").filter(Boolean);
  const queryJoined = queryWords.join(" ");

  if (title.toLowerCase().includes(query) || (titleEn && titleEn.toLowerCase().includes(query))) {
    return {
      before: "",
      match: title,
      after: "",
    };
  }

  for (let i = 0; i < words.length; i++) {
    const slice = words.slice(i, i + queryWords.length).join(" ");
    if (slice.includes(queryJoined)) {
      return {
        before: words.slice(Math.max(0, i - 5), i).join(" "),
        match: slice,
        after: words.slice(i + queryWords.length, i + queryWords.length + 5).join(" "),
      };
    }
  }

  return { before: "", match: query, after: "" };
}

export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const results: SearchResult[] = [];
  const cleanedQuery = cleanText(query.trim());
  const BLOG_DIR = path.join(process.cwd(), "content/blog");
  const MARINE_LIFE_DIR = path.join(process.cwd(), "content/marine-life");

  for (const [dir, category, basePath] of [
    [BLOG_DIR, "blog" as const, "/blog"],
    [MARINE_LIFE_DIR, "marine-life" as const, "/marine-life"],
  ]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      if (data.draft === true) continue;

      const title = data.title ?? "";
      const nameEn = data.nameEn ?? "";
      const cleanedContent = cleanText(content ?? "");
      const cleanedTitle = cleanText(title);
      const cleanedTitleEn = cleanText(nameEn);
      const searchableContent = `${cleanedTitle} ${cleanedTitleEn} ${cleanedContent}`;

      if (searchableContent.includes(cleanedQuery)) {
        const snippet = findSearchSnippet(cleanedContent, cleanedQuery, title, nameEn);
        const itemSlug = data.slug ?? slug;
        results.push({
          title,
          path: `${basePath}/${itemSlug}`,
          category,
          image: data.cover ?? data.images?.[0],
          nameEn: category === "marine-life" ? nameEn : undefined,
          snippet,
        });
      }
    }
  }

  return results.slice(0, 12);
}
