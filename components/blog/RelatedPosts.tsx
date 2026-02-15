import type { BlogPostMeta } from "@/lib/content/blog";
import { BlogCard } from "./BlogCard";

type Props = { posts: BlogPostMeta[] };

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-700">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Похожие статьи
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}
