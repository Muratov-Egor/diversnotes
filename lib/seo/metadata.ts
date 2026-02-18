import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./config";

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  locale?: string;
  hasTranslation?: boolean;
};

const DEFAULT_OG_IMAGE = "/og-default.png";
const META_DESCRIPTION_MAX_LENGTH = 155;

export function buildMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  locale = "ru",
  hasTranslation,
}: MetaInput): Metadata {
  const url =
    locale === "en"
      ? `${SITE_URL}/en${path || ""}`
      : `${SITE_URL}${path || ""}`;

  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const ogImage = image ?? `${SITE_URL}${DEFAULT_OG_IMAGE}`;
  const shortDescription =
    description.length > META_DESCRIPTION_MAX_LENGTH
      ? description.slice(0, META_DESCRIPTION_MAX_LENGTH - 3).trim() + "…"
      : description;

  const alternateLanguages =
    hasTranslation !== false
      ? {
          ru: `${SITE_URL}${path || "/"}`,
          en: `${SITE_URL}/en${path || "/"}`,
          "x-default": `${SITE_URL}${path || "/"}`,
        }
      : undefined;

  return {
    title: fullTitle,
    description: shortDescription,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      title: fullTitle,
      description: shortDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "en" ? "en_US" : "ru_RU",
      images: [{ url: ogImage }],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
