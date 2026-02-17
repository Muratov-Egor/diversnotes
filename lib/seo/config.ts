/** Базовый URL сайта для canonical, OpenGraph, sitemap */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.diversnotes.com");

export const SITE_NAME = "Diver's Notes";
