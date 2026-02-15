import Link from "next/link";
import matter from "gray-matter";
import { ImageWithRetry } from "@/components/ImageWithRetry";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostRaw, getRelatedPosts } from "@/lib/content/blog";
import { getTableOfContents } from "@/lib/article-toc";
import { ArticleWithTocLayout } from "@/components/article/ArticleWithTocLayout";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { YouTube } from "@/components/mdx/YouTube";
import { MdxImage } from "@/components/mdx/MdxImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/format/date";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";

function getReadingTimeMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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
  const readingTimeMin = getReadingTimeMinutes(body);
  const showToc = toc.filter((i) => i.level === 2).length > 3;

  const { content, frontmatter } = await compileMDX<{
    title: string;
    description: string;
    date: string;
    tags: string[];
    cover?: string;
    series?: string;
  }>({
    source: raw,
    options: {
      parseFrontmatter: true,
      mdxOptions: { rehypePlugins: [rehypeSlug] },
    },
    components: { YouTube, img: MdxImage },
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
      {
        "@type": "ListItem",
        position: 2,
        name: "Блог",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  const cover = postMeta?.cover ?? frontmatter.cover;
  const tags = frontmatter.tags ?? postMeta?.tags ?? [];
  const relatedPosts = getRelatedPosts(
    slug,
    tags,
    postMeta?.series ?? frontmatter.series,
    6
  );

  const articleBlock = (
    <article className="min-w-0 max-w-[1200px]">
      {/* Заголовок и мета */}
      <header className="mb-8">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl mb-4">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="text-lg text-center text-neutral-600 dark:text-neutral-400 mb-8">
            {frontmatter.description}
          </p>
        )}
        {/* Обложка */}
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
        {/* Хлебная крошка */}
        <p className="text-sm mb-2">
          <Link href="/blog" className="hover:underline">
            Блог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {frontmatter.title}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
          <time dateTime={frontmatter.date}>
            {formatDate(frontmatter.date)}
          </time>
          <span>{readingTimeMin} мин чтения</span>
          <CopyLinkButton />
        </div>
        <hr className="w-full h-1 border-t border-neutral-200 dark:border-neutral-700 mb-2" />
      </header>

      {/* Текст статьи */}
      <div className="min-w-0 prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24">
        {content}
      </div>

      <RelatedPosts posts={relatedPosts} />
      {/* Теги */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
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
        {showToc ? (
          <ArticleWithTocLayout tocItems={toc}>
            {articleBlock}
          </ArticleWithTocLayout>
        ) : (
          <div className="mx-auto">{articleBlock}</div>
        )}
      </div>
    </main>
  );
}
