import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getAllTags, getTagLabel } from "@/lib/content/tags";
import { getPostsByTag } from "@/lib/content/blog";
import { getMarineLifeByTag } from "@/lib/content/marine-life";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "tags" });
  return buildMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/tags",
    locale,
  });
}

export default async function TagsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tags");

  const tags = getAllTags();

  const tagsWithCounts = tags.map((tag) => {
    const postsCount = getPostsByTag(tag.ru, locale).length;
    const marineLifeCount = getMarineLifeByTag(tag.ru, locale).length;
    const totalCount = postsCount + marineLifeCount;
    return {
      ...tag,
      postsCount,
      marineLifeCount,
      totalCount,
    };
  });

  tagsWithCounts.sort((a, b) => {
    if (b.totalCount !== a.totalCount) {
      return b.totalCount - a.totalCount;
    }
    return a.ru.localeCompare(b.ru, "ru");
  });

  return (
    <main className="mx-auto max-w-7xl px-4">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {t("title")}
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">
        {t("subtitle")}
      </p>

      {tagsWithCounts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">{t("noTags")}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tagsWithCounts.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/tags/${tag.slug}`}
                className="block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
              >
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {getTagLabel(tag, locale)}
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {tag.totalCount === 0
                    ? t("noMaterials")
                    : t("materialsCount", { count: tag.totalCount })}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
