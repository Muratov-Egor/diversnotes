import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageWithRetry } from "@/components/ImageWithRetry";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getAllMarineLife, getMarineLifeRaw } from "@/lib/content/marine-life";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
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
        {cover && (
          <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-800">
              <ImageWithRetry
                src={cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        )}
        <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
        <p className="text-sm mb-2">
          <Link href="/marine-life" className="hover:underline">
            Подводный мир
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {frontmatter.title}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          {frontmatter.depthRange && (
            <span>Глубина: {frontmatter.depthRange}</span>
          )}
          <CopyLinkButton />
        </div>
        <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
      </header>

      <div className="min-w-0 prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24">
        {content}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
          <span className="text-neutral-500 dark:text-neutral-400">
            🏷️ Tags:
          </span>
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="hover:underline"
                >
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );

  return (
    <main className="py-6 sm:py-8">
      {jsonLdArticle && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">{articleBlock}</div>
      </div>
    </main>
  );
}
