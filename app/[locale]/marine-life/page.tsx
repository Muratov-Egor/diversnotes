import { setRequestLocale, getTranslations } from "next-intl/server";
import { getMarineLifeForPage } from "@/lib/content/marine-life";
import { buildMetadata } from "@/lib/seo/metadata";
import { MarineLifeCard } from "@/components/marine-life/MarineLifeCard";
import { Pagination } from "@/components/blog/Pagination";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marineLife" });
  return buildMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/marine-life",
    locale,
  });
}

export default async function MarineLifePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("marineLife");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const { items, totalPages, currentPage } = getMarineLifeForPage(page, locale);

  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
        {t("title")}
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-center">
        {t("subtitle")}
      </p>
      {items.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {t("noEntries")}
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
