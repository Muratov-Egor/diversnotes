import matter from "gray-matter";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { getAllPosts, getPostRaw, getRelatedPosts } from "@/lib/content/blog";
import { getTableOfContents } from "@/lib/article-toc";
import { ArticleBreadcrumb } from "@/components/article/ArticleBreadcrumb";
import { ArticleCover } from "@/components/article/ArticleCover";
import { ArticlePageLayout } from "@/components/article/ArticlePageLayout";
import { ArticleProse } from "@/components/article/ArticleProse";
import { ArticleWithTocLayout } from "@/components/article/ArticleWithTocLayout";
import { CopyLinkButton } from "@/components/article/CopyLinkButton";
import { TagList } from "@/components/article/TagList";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { YouTube } from "@/components/mdx/YouTube";
import { MdxImage } from "@/components/mdx/MdxImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/format/date";
import { getReadingTimeMinutes } from "@/lib/format/reading-time";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";

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
    6,
  );

  // Добавляем теги в JSON-LD для SEO
  if (jsonLdArticle && tags.length > 0) {
    jsonLdArticle.keywords = tags;
  }

  const articleBlock = (
    <article className="min-w-0">
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
        {cover && <ArticleCover src={cover} />}
        <ArticleBreadcrumb
          sectionHref="/blog"
          sectionLabel="Блог"
          currentTitle={frontmatter.title}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400 mb-2">
          <time dateTime={frontmatter.date}>
            {formatDate(frontmatter.date)}
          </time>
          <span>{readingTimeMin} мин чтения</span>
          <CopyLinkButton />
        </div>
      </header>

      <ArticleProse>{content}</ArticleProse>

      <RelatedPosts posts={relatedPosts} />
      <TagList tags={tags} className="mt-3" />
    </article>
  );

  return (
    <ArticlePageLayout
      jsonLdArticle={jsonLdArticle}
      jsonLdBreadcrumb={jsonLdBreadcrumb}
    >
      {showToc ? (
        <ArticleWithTocLayout tocItems={toc}>
          {articleBlock}
        </ArticleWithTocLayout>
      ) : (
        <div className="mx-auto">{articleBlock}</div>
      )}
    </ArticlePageLayout>
  );
}
