import Link from "next/link";
import { getAllTags } from "@/lib/content/tags";
import { getPostsByTag } from "@/lib/content/blog";
import { getMarineLifeByTag } from "@/lib/content/marine-life";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Теги",
  description: "Все теги статей и записей о подводном мире.",
  path: "/tags",
});

export default function TagsPage() {
  const tags = getAllTags();

  // Подсчитываем количество контента для каждого тега
  const tagsWithCounts = tags.map((tag) => {
    const postsCount = getPostsByTag(tag.ru).length;
    const marineLifeCount = getMarineLifeByTag(tag.ru).length;
    const totalCount = postsCount + marineLifeCount;
    return {
      ...tag,
      postsCount,
      marineLifeCount,
      totalCount,
    };
  });

  // Сортируем по количеству контента (больше сначала), затем по названию
  tagsWithCounts.sort((a, b) => {
    if (b.totalCount !== a.totalCount) {
      return b.totalCount - a.totalCount;
    }
    return a.ru.localeCompare(b.ru, "ru");
  });

  return (
    <main className="mx-auto max-w-7xl px-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        Теги
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        Все теги статей и записей о подводном мире.
      </p>

      {tagsWithCounts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          Пока нет тегов.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tagsWithCounts.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/tags/${tag.slug}`}
                className="block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
              >
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {tag.ru}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {tag.totalCount === 0
                    ? "Нет материалов"
                    : `${tag.totalCount} ${tag.totalCount === 1 ? "материал" : "материалов"}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
