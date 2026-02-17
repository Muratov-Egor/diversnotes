import { notFound } from "next/navigation";
import { getTagBySlug } from "@/lib/content/tags";
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
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

type ContentItem =
  | { type: "blog"; data: BlogPostMeta }
  | { type: "marine-life"; data: MarineLifeMeta };

const ITEMS_PER_PAGE = 9;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};

  return buildMetadata({
    title: `Тег: ${tag.ru}`,
    description: `Все статьи и записи о подводном мире с тегом "${tag.ru}"`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const tag = getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(tag.ru);
  const marineLife = getMarineLifeByTag(tag.ru);

  // Объединяем все материалы в один список
  const allItems: ContentItem[] = [
    ...posts.map((post) => ({ type: "blog" as const, data: post })),
    ...marineLife.map((item) => ({
      type: "marine-life" as const,
      data: item,
    })),
  ];

  const totalCount = allItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const page = Math.max(1, Math.min(parseInt(String(pageParam ?? "1"), 10) || 1, totalPages));

  // Получаем элементы для текущей страницы
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = allItems.slice(start, end);

  return (
    <main className="mx-auto max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Тег: {tag.ru}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Найдено материалов: {totalCount}
        </p>
      </div>

      {totalCount === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          Пока нет материалов с этим тегом.
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map((item) => (
              <li key={`${item.type}-${item.data.slug}`} className="flex h-full">
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
