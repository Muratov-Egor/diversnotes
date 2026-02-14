import { getPostsForPage } from "@/lib/content/blog";
import { buildMetadata } from "@/lib/seo/metadata";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/blog/Pagination";

export const metadata = buildMetadata({
  title: "Блог",
  description: "Заметки о дайвинге, обзоры дайв-сайтов и теория для дайверов.",
  path: "/blog",
});

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? "1"), 10) || 1);
  const { posts, totalPages, currentPage } = getPostsForPage(page);

  return (
    <main className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2 text-center">
        Блог
      </h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8 text-center">
        Статьи о дайвинге: теория, описание дайв-сайтов и личный опыт погружений.
      </p>
      {posts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">Пока нет статей.</p>
      ) : (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <li
                key={post.slug}
                className={
                  currentPage === 1 && index === 0 ? "sm:col-span-2 lg:col-span-3" : "flex"
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
