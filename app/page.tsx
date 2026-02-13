import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Diver's Notes",
  description:
    "Заметки о дайвинге, обзоры дайв-сайтов и база морских обитателей. Автор — Егор, PADI Assistant Instructor и подводный фотограф.",
  path: "/",
});

export default function HomePage() {
  return (
    <main className="max-w-[75ch]">
      <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Привет
      </h1>
      <p className="mt-4 text-neutral-600 dark:text-neutral-400">
        Я Егор — сертифицированный PADI Assistant Instructor и подводный фотограф.
        Здесь заметки о дайвинге, обзоры дайв-сайтов и база морских обитателей,
        которых я встретил под водой.
      </p>
      <nav className="mt-10 flex flex-col gap-6 sm:flex-row sm:gap-10">
        <Link
          href="/blog"
          className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          Блог
        </Link>
        <Link
          href="/marine-life"
          className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          Подводный мир
        </Link>
      </nav>
    </main>
  );
}
