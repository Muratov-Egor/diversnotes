import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "О проекте",
  description:
    "О проекте Diver's Notes и авторе — Егор Муратов, PADI Assistant Instructor, подводный фотограф.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="p-4">
      <h1>О проекте</h1>
      <p>О проекте — скоро.</p>
    </main>
  );
}
