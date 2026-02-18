import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllPosts } from "@/lib/content/blog";
import {
  getDiveSites,
  getDiveSitesGroupedByCountry,
  getDiveStats,
} from "@/lib/content/dive-sites";
import { formatDate } from "@/lib/format/date";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/",
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const latestPosts = getAllPosts(locale).slice(0, 3);
  const { totalDives, localsVisited } = getDiveStats();
  const regions = getDiveSites();
  const countries = getDiveSitesGroupedByCountry();
  const totalRegions = regions.length;
  const totalCountries = countries.length;

  return (
    <main className="mx-auto max-w-7xl">
      <section>
        <h1 className="text-center mb-8 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          {t("title")}
        </h1>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/mainPage/hero.png"
              alt={t("heroAlt")}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="p-6 sm:p-8">
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              {t("intro1")}
            </p>

            <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
              {t("intro2")}
            </p>

            <section className="mt-16 text-center border-t border-neutral-200 pt-10 dark:border-neutral-800">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalDives}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("totalDives")}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {localsVisited}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("diveSites")}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalCountries}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("countries")}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalRegions}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {t("regions")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl text-center">{t("latestPosts")}</h2>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
              aria-label={post.title}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-neutral-50 dark:bg-neutral-950">
                <Image
                  src={post.cover ?? "/placeholders/blog.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </div>

              <div className="p-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDate(post.date, locale)}
                </p>
                <h3 className="mt-2 font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
