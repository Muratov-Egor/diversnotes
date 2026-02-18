import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllPosts } from "@/lib/content/blog";
import { getAllMarineLife } from "@/lib/content/marine-life";

function withAlternates(path: string) {
  return {
    languages: {
      ru: `${SITE_URL}${path}`,
      en: `${SITE_URL}/en${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const marineLife = getAllMarineLife();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: withAlternates("/"),
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: withAlternates("/blog"),
    },
    {
      url: `${SITE_URL}/marine-life`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: withAlternates("/marine-life"),
    },
    {
      url: `${SITE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: withAlternates("/map"),
    },
    {
      url: `${SITE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: withAlternates("/tags"),
    },
  ];

  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: withAlternates(`/blog/${p.slug}`),
  }));

  const marineUrls: MetadataRoute.Sitemap = marineLife.map((m) => ({
    url: `${SITE_URL}/marine-life/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: withAlternates(`/marine-life/${m.slug}`),
  }));

  return [...staticPages, ...blogUrls, ...marineUrls];
}
