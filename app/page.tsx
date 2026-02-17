import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo/metadata";
import { getAllPosts } from "@/lib/content/blog";
import {
  getDiveSites,
  getDiveSitesGroupedByCountry,
  getDiveStats,
} from "@/lib/content/dive-sites";

export const metadata = buildMetadata({
  title: "Diver's Notes - блог о дайвинге",
  description:
    "Diver's Notes — личный архив погружений Егора, PADI Assistant Instructor и подводного фотографа. Заметки о дайвинге, описание дайв-сайтов, карта моих погружений и база морских обитателей.",
  path: "/",
});

function formatRuDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);
  const { totalDives, localsVisited } = getDiveStats();
  const regions = getDiveSites();
  const countries = getDiveSitesGroupedByCountry();
  const totalRegions = regions.length;
  const totalCountries = countries.length;

  return (
    <main className="mx-auto max-w-7xl">
      <section>
        <h1 className="text-center mb-8 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          Diver&apos;s Notes - блог о дайвинге
        </h1>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src="/mainPage/hero.png"
              alt="Привет, я Егор."
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <div className="p-6 sm:p-8">
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              Привет, я Егор — PADI Assistant Instructor и подводный фотограф. С
              2023 года фиксирую свой опыт: где нырял, что видел и чему научился
              под водой.
            </p>

            <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
              Это мой личный дневник погружений, заметки о дайвинге, описание
              дайв-сайтов и подводных обитателей и другие интересные вещи в
              области дайвинга.
            </p>

            {/* АРХИВ В ЦИФРАХ */}
            <section className="mt-16 text-center border-t border-neutral-200 pt-10 dark:border-neutral-800">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalDives}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Погружений
                  </p>
                </div>

                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {localsVisited}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Дайв-сайтов
                  </p>
                </div>

                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalCountries}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Стран
                  </p>
                </div>

                <div>
                  <p className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {totalRegions}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Регионов
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl text-center">Последние заметки</h2>
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
                  {formatRuDate(post.date)}
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
