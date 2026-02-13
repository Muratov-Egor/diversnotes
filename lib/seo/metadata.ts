import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./config";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

/** Собирает metadata с canonical и OpenGraph */
export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: MetaInput): Metadata {
  const url = `${SITE_URL}${path || ""}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

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
      ...(image && { images: [{ url: image }] }),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
