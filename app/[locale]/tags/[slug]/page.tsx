import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getTagBySlug, getTagLabel } from "@/lib/content/tags";
import { getPostsByTag, type BlogPostMeta } from "@/lib/content/blog";
import {
  getMarineLifeByTag,
  type MarineLifeMeta,
} from "@/lib/content/marine-life";
import { BlogCard } from "@/components/blog/BlogCard";
import { MarineLifeCard } from "@/components/marine-life/MarineLifeCard";
import { Pagination } from "@/components/blog/Pagination";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

type ContentItem =
  | { type: "blog"; data: BlogPostMeta }
  | { type: "marine-life"; data: MarineLifeMeta };

const ITEMS_PER_PAGE = 9;

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};
  const t = await getTranslations({ locale, namespace: "tags" });
  const name = getTagLabel(tag, locale);

  return buildMetadata({
    title: t("tagTitle", { name }),
    description: t("tagDescription", { name }),
    path: `/tags/${slug}`,
    locale,
  });
}

export default async function TagPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tags");

  const { page: pageParam } = await searchParams;
  const tag = getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(tag.ru, locale);
  const marineLife = getMarineLifeByTag(tag.ru, locale);

  const allItems: ContentItem[] = [
    ...posts.map((post) => ({ type: "blog" as const, data: post })),
    ...marineLife.map((item) => ({
      type: "marine-life" as const,
      data: item,
    })),
  ];

  const totalCount = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const page = Math.max(
    1,
    Math.min(parseInt(String(pageParam ?? "1"), 10) || 1, totalPages),
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = allItems.slice(start, end);

  const tagName = getTagLabel(tag, locale);

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {t("tagTitle", { name: tagName })}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {t("foundMaterials", { count: totalCount })}
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {t("noMaterialsWithTag")}
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <li
                key={`${item.type}-${item.data.slug}`}
                className="flex h-full"
              >
                {item.type === "blog" ? (
                  <BlogCard post={item.data} />
                ) : (
                  <MarineLifeCard item={item.data} />
                )}
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/tags/${slug}`}
          />
        </>
      )}
    </main>
  );
}
