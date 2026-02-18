import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPostsForPage } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/blog",
    locale,
  });
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const { posts, totalPages, currentPage } = getPostsForPage(page, locale);

  return (
    <main className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
        {t("title")}
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-center">
        {t("subtitle")}
      </p>
      {posts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {t("noArticles")}
        </p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                className={
                  currentPage === 1 && index === 0
                    ? "sm:col-span-2 lg:col-span-3"
                    : "flex h-full"
                }
              >
                <BlogCard
                  post={post}
                  variant={
                    currentPage === 1 && index === 0 ? "featured" : "default"
                  }
                />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </>
      )}
    </main>
  );
}
