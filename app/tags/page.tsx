import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Теги",
  description: "Все теги статей и записей о подводном мире.",
  path: "/tags",
});

export default function TagsPage() {
  return (
    <main className="p-4">
      <h1>Теги</h1>
      <p>Список тегов — скоро.</p>
    </main>
  );
}
