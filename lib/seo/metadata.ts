import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./config";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

/** Картинка по умолчанию для OG (файл в public/og-default.png) */
const DEFAULT_OG_IMAGE = "/og-default.png";

/** Собирает metadata с canonical и OpenGraph */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: MetaInput): Metadata {
  const url = `${SITE_URL}${path || ""}`;
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const ogImage = image ?? `${SITE_URL}${DEFAULT_OG_IMAGE}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: ogImage }],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
