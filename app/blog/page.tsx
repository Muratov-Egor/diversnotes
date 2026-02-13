import Link from "next/link";
import { getAllPosts } from "@/lib/content/blog";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <main className="p-4 max-w-[75ch] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Блог</h1>
      {posts.length === 0 ? (
        <p>Пока нет статей.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                <span className="font-medium">{post.title}</span>
              </Link>
              <p className="text-sm text-neutral-500 mt-1">{post.description}</p>
              <p className="text-xs text-neutral-400">{post.date}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
