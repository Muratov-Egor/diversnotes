import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import {
  getAllMarineLife,
  getMarineLifeRaw,
  getRelatedMarineLife,
} from "@/lib/content/marine-life";
import { ArticleBreadcrumb } from "@/components/article/ArticleBreadcrumb";
import { ArticleCover } from "@/components/article/ArticleCover";
import { ArticlePageLayout } from "@/components/article/ArticlePageLayout";
import { ArticleProse } from "@/components/article/ArticleProse";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
import { TagList } from "@/components/article/TagList";
import { RelatedMarineLife } from "@/components/marine-life/RelatedMarineLife";
import { MdxImage } from "@/components/mdx/MdxImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = getAllMarineLife();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const items = getAllMarineLife();
  const item = items.find((m) => m.slug === slug);
  if (!item) return {};
  return buildMetadata({
    title: item.title,
    description: item.description,
    path: `/marine-life/${slug}`,
    image: item.images?.[0],
  });
}

export default async function MarineLifeItemPage({ params }: Props) {
  const { slug } = await params;
  const raw = getMarineLifeRaw(slug);
  if (!raw) notFound();

  const items = getAllMarineLife();
  const itemMeta = items.find((m) => m.slug === slug);

  const { content, frontmatter } = await compileMDX<{
    title: string;
    nameEn: string;
    description: string;
    latinName?: string;
    depthRange?: string;
    locations?: string[];
  }>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: { rehypePlugins: [rehypeSlug] },
    },
    components: { img: MdxImage },
  });

  const jsonLdArticle = itemMeta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: frontmatter.title,
        description: frontmatter.description,
        author: { "@type": "Person", name: "Егор Муратов" },
        publisher: { "@type": "Organization", name: SITE_NAME },
        url: `${SITE_URL}/marine-life/${slug}`,
        ...(itemMeta.images?.[0] && { image: itemMeta.images[0] }),
      }
    : null;

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Подводный мир",
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
  const tags = itemMeta?.tags ?? [];
  const relatedItems = getRelatedMarineLife(slug, tags, 6);

  const articleBlock = (
    <article className="min-w-0 max-w-[1200px]">
      <header className="mb-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl mb-4">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="text-lg text-center text-neutral-600 dark:text-neutral-400 mb-8">
            {frontmatter.description}
          </p>
        )}
        {(frontmatter.nameEn || frontmatter.latinName) && (
          <p className="text-center text-neutral-500 dark:text-neutral-400 mb-4">
            {frontmatter.nameEn}
            {frontmatter.latinName && (
              <span className="italic"> — {frontmatter.latinName}</span>
            )}
          </p>
        )}
        {cover && <ArticleCover src={cover} />}
        <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
        <ArticleBreadcrumb
          sectionHref="/marine-life"
          sectionLabel="Подводный мир"
          currentTitle={frontmatter.title}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          {frontmatter.depthRange && (
            <span>Глубина: {frontmatter.depthRange}</span>
          )}
          <CopyLinkButton />
        </div>
        <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
      </header>

      <ArticleProse>{content}</ArticleProse>

      <RelatedMarineLife items={relatedItems} />
      <TagList tags={tags} className="mt-8" />
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
