"use strict";

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BLOG_BASE = path.join(process.cwd(), "content/blog");
const MARINE_LIFE_BASE = path.join(process.cwd(), "content/marine-life");
const OUT_PATH = path.join(process.cwd(), "public", "search-index.json");

const LOCALES = ["ru", "en"];

function cleanText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/https?:\/\/[^\s]*/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`\[\](){}<>|\\/="»«•·…—–.,:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function getEntries(dir, basePath, category) {
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const entries = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    if (data.draft === true) continue;
    const title = data.title ?? "";
    const nameEn = data.nameEn ?? "";
    const itemSlug = data.slug ?? slug;
    const contentSearch = cleanText(content ?? "");
    entries.push({
      title,
      path: `${basePath}/${itemSlug}`,
      category,
      image: data.cover ?? data.images?.[0],
      nameEn: category === "marine-life" ? nameEn : undefined,
      contentSearch,
    });
  }
  return entries;
}

const index = {};
for (const locale of LOCALES) {
  const blogDir = path.join(BLOG_BASE, locale);
  const mlDir = path.join(MARINE_LIFE_BASE, locale);
  const blog = getEntries(blogDir, "/blog", "blog");
  const marineLife = getEntries(mlDir, "/marine-life", "marine-life");
  index[locale] = [...blog, ...marineLife];
}

index.all = index.ru;

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(index), "utf-8");
console.log(
  "Search index built:",
  index.ru.length,
  "ru entries,",
  index.en.length,
  "en entries",
);
