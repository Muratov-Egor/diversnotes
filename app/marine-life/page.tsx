import { getMarineLifeForPage } from "@/lib/content/marine-life";
import { buildMetadata } from "@/lib/seo/metadata";
import { MarineLifeCard } from "@/components/marine-life/MarineLifeCard";
import { Pagination } from "@/components/blog/Pagination";

export const metadata = buildMetadata({
  title: "Морские обитатели, которых я встретил под водой",
  description:
    "Фото и описания морских обитателей, встреченных во время погружений. Особенности поведения, места наблюдений и интересные факты о каждом виде.",
  path: "/marine-life",
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function MarineLifePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const { items, totalPages, currentPage } = getMarineLifeForPage(page);

  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
        Морские обитатели, которых я встретил под водой
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-center">
        Фото и описания морских обитателей, встреченных во время погружений.
        Особенности поведения, места наблюдений и интересные факты.
      </p>
      {items.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          Пока нет записей.
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug} className="flex h-full">
                <MarineLifeCard item={item} />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/marine-life"
          />
        </>
      )}
    </main>
  );
}
