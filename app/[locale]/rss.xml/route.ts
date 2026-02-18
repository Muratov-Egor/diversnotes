import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { getAllPosts } from "@/lib/content/blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const isEn = locale === "en";
  const pathPrefix = isEn ? "/en" : "";
  const description = isEn
    ? "Notes about diving and the underwater world"
    : "Заметки о дайвинге и подводном мире";
  const feedUrl = `${SITE_URL}${pathPrefix}/rss.xml`;
  const siteLink = `${SITE_URL}${pathPrefix}`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${siteLink}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}${pathPrefix}/blog/${p.slug}</link>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}${pathPrefix}/blog/${p.slug}</guid>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
