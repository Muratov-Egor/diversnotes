import Link from "next/link";
import Image from "next/image";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostRaw } from "@/lib/content/blog";
import { getTableOfContents } from "@/lib/article-toc";
import { TableOfContents } from "@/components/article/TableOfContents";
import { YouTube } from "@/components/mdx/YouTube";
import { buildMetadata } from "@/lib/seo/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";

function formatDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    image: post.cover,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const raw = getPostRaw(slug);
  if (!raw) notFound();

  const posts = getAllPosts();
  const postMeta = posts.find((p) => p.slug === slug);

  const { content: body } = matter(raw);
  const toc = getTableOfContents(body);

  const { content, frontmatter } = await compileMDX<{
    title: string;
    description: string;
    date: string;
    tags: string[];
  }>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: { rehypePlugins: [rehypeSlug] },
    },
    components: { YouTube },
  });

  const jsonLdArticle = postMeta
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: frontmatter.title,
        description: frontmatter.description,
        datePublished: frontmatter.date,
        dateModified: postMeta.updatedAt ?? frontmatter.date,
        author: { "@type": "Person", name: "Егор Муратов" },
        publisher: { "@type": "Organization", name: SITE_NAME },
        url: `${SITE_URL}/blog/${slug}`,
        ...(postMeta.cover && { image: postMeta.cover }),
      }
    : null;

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  const cover = postMeta?.cover ?? frontmatter.cover;
  const tags = frontmatter.tags ?? postMeta?.tags ?? [];

  const articleBlock = (
    <article className="min-w-0">
      {/* Хлебная крошка */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        <Link href="/blog" className="hover:underline">
          Блог
        </Link>
      </p>

      {/* Обложка */}
      {cover && (
        <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="relative aspect-[16/10] sm:aspect-[2/1] w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={cover}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              unoptimized
            />
          </div>
        </div>
      )}

      {/* Заголовок и мета */}
      <header className="mb-8 max-w-[75ch]">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
            {frontmatter.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <time dateTime={frontmatter.date}>
            {formatDate(frontmatter.date)}
          </time>
          {tags.length > 0 && (
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
          )}
        </div>
      </header>

      {/* Текст статьи */}
      <div className="prose prose-neutral dark:prose-invert max-w-[75ch] prose-headings:scroll-mt-24">
        {content}
      </div>
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
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {toc.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
            <TableOfContents items={toc} />
            {articleBlock}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">{articleBlock}</div>
        )}
      </div>
    </main>
  );
}
