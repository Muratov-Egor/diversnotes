import matter from "gray-matter";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getAllMarineLife,
  getMarineLifeRaw,
  getRelatedMarineLife,
} from "@/lib/content/marine-life";
import { getReadingTimeMinutes } from "@/lib/format/reading-time";
import { ArticleBreadcrumb } from "@/components/article/ArticleBreadcrumb";
import { ArticleCover } from "@/components/article/ArticleCover";
import { ArticlePageLayout } from "@/components/article/ArticlePageLayout";
import { ArticleProse } from "@/components/article/ArticleProse";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
import { TagList } from "@/components/article/TagList";
import { MarineLifeBriefInfo } from "@/components/marine-life/MarineLifeBriefInfo";
import { RelatedMarineLife } from "@/components/marine-life/RelatedMarineLife";
import { MdxImage } from "@/components/mdx/MdxImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const items = getAllMarineLife(locale);
    return items.map((item) => ({ locale, slug: item.slug }));
  });
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const items = getAllMarineLife(locale);
  const item = items.find((m) => m.slug === slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.description,
    path: `/marine-life/${slug}`,
    image: item.images?.[0],
    locale,
  });
}

export default async function MarineLifeItemPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tMarineLife = await getTranslations({
    locale,
    namespace: "marineLife",
  });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tBreadcrumb = await getTranslations({
    locale,
    namespace: "breadcrumb",
  });
  const tArticle = await getTranslations({ locale, namespace: "article" });

  const raw = getMarineLifeRaw(slug, locale);
  if (!raw) notFound();

  const items = getAllMarineLife(locale);
  const itemMeta = items.find((m) => m.slug === slug);
  const { content: body } = matter(raw);
  const readingTimeMin = getReadingTimeMinutes(body);

  const { content, frontmatter } = await compileMDX<{
    title: string;
    nameEn: string;
    description: string;
    latinName?: string;
    depthRange?: string;
    locations?: string[];
    size?: string;
    family?: string;
    category?: string;
    activity?: string;
    conservationStatus?: string;
  }>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: { rehypePlugins: [rehypeSlug] },
    },
    components: { img: MdxImage },
  });

  const tags = itemMeta?.tags ?? [];

  const jsonLdArticle = itemMeta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: frontmatter.title,
        description: frontmatter.description,
        author: { "@type": "Person", name: tArticle("author") },
        publisher: { "@type": "Organization", name: SITE_NAME },
        url: `${SITE_URL}/marine-life/${slug}`,
        ...(itemMeta.images?.[0] && { image: itemMeta.images[0] }),
        ...(tags.length > 0 && { keywords: tags }),
      }
    : null;

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tBreadcrumb("home"),
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("marineLife"),
        item: `${SITE_URL}/marine-life`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: `${SITE_URL}/marine-life/${slug}`,
      },
    ],
  };

  const cover = itemMeta?.images?.[0];
  const relatedItems = getRelatedMarineLife(slug, tags, 6, locale);

  const articleBlock = (
    <article className="min-w-0">
      <header className="mb-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl mb-10">
          {frontmatter.title}
        </h1>
        {cover && <ArticleCover src={cover} />}
        <ArticleBreadcrumb
          sectionHref="/marine-life"
          sectionLabel={tNav("marineLife")}
          currentTitle={frontmatter.title}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          <span>{tMarineLife("readingTime", { minutes: readingTimeMin })}</span>
          <CopyLinkButton />
        </div>
      </header>

      <div className="mb-6">
        <MarineLifeBriefInfo
          description={frontmatter.description ?? itemMeta?.description}
          title={frontmatter.title ?? itemMeta?.title}
          nameEn={frontmatter.nameEn ?? itemMeta?.nameEn}
          latinName={frontmatter.latinName ?? itemMeta?.latinName}
          size={frontmatter.size ?? itemMeta?.size}
          depthRange={frontmatter.depthRange ?? itemMeta?.depthRange}
          locations={frontmatter.locations ?? itemMeta?.locations}
          family={frontmatter.family ?? itemMeta?.family}
          category={frontmatter.category ?? itemMeta?.category}
          activity={frontmatter.activity ?? itemMeta?.activity}
          conservationStatus={
            frontmatter.conservationStatus ?? itemMeta?.conservationStatus
          }
        />
      </div>

      <ArticleProse>{content}</ArticleProse>

      <RelatedMarineLife items={relatedItems} />
      <TagList tags={tags} className="mt-8" locale={locale} />
    </article>
  );

  return (
    <ArticlePageLayout
      jsonLdArticle={jsonLdArticle}
      jsonLdBreadcrumb={jsonLdBreadcrumb}
    >
      <div className="mx-auto">{articleBlock}</div>
    </ArticlePageLayout>
  );
}
