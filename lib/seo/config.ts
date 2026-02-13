/** Базовый URL сайта для canonical, OpenGraph, sitemap */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://www.diversnotes.com";

export const SITE_NAME = "Diver's Notes";
