import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostRaw } from "@/lib/content/blog";
import { YouTube } from "@/components/mdx/YouTube";
import { buildMetadata } from "@/lib/seo/metadata";
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

  const { content, frontmatter } = await compileMDX<{
    title: string;
    description: string;
    date: string;
    tags: string[];
  }>({
    source: raw,
    options: { parseFrontmatter: true },
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
          <p className="text-sm text-neutral-500">{frontmatter.date}</p>
        </header>
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </article>
    </main>
  );
}
