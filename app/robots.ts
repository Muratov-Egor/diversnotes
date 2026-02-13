import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        ...(isProd ? {} : { disallow: "/" }),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
