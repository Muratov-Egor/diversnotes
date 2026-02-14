import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllMarineLife, getMarineLifeRaw } from "@/lib/content/marine-life";
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
    options: { parseFrontmatter: true },
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

  return (
    <main className="p-4 max-w-[75ch] mx-auto">
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
      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">{frontmatter.title}</h1>
          <p className="text-lg text-neutral-500">{frontmatter.nameEn}</p>
          {frontmatter.latinName && (
            <p className="text-base italic text-neutral-400">
              {frontmatter.latinName}
            </p>
          )}
          {frontmatter.depthRange && (
            <p className="text-sm text-neutral-500">
              Глубина: {frontmatter.depthRange}
            </p>
          )}
        </header>
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </article>
    </main>
  );
}
