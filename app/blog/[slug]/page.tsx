import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllPosts, getPostRaw } from "@/lib/content/blog";
import { YouTube } from "@/components/mdx/YouTube";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const raw = getPostRaw(slug);
  if (!raw) notFound();

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

  return (
    <main className="p-4 max-w-[75ch] mx-auto">
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
