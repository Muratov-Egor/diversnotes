import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllMarineLife, getMarineLifeRaw } from "@/lib/content/marine-life";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = getAllMarineLife();
  return items.map((item) => ({ slug: item.slug }));
}

export default async function MarineLifeItemPage({ params }: Props) {
  const { slug } = await params;
  const raw = getMarineLifeRaw(slug);
  if (!raw) notFound();

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

  return (
    <main className="p-4 max-w-[75ch] mx-auto">
      <article>
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">{frontmatter.title}</h1>
          <p className="text-lg text-neutral-500">{frontmatter.nameEn}</p>
          {frontmatter.latinName && (
            <p className="text-base italic text-neutral-400">{frontmatter.latinName}</p>
          )}
          {frontmatter.depthRange && (
            <p className="text-sm text-neutral-500">Глубина: {frontmatter.depthRange}</p>
          )}
        </header>
        <div className="prose prose-neutral dark:prose-invert">{content}</div>
      </article>
    </main>
  );
}
