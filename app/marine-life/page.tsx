import Link from "next/link";
import { getAllMarineLife } from "@/lib/content/marine-life";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Подводный мир",
  description:
    "База морских обитателей: авторские фото и описания существ, встреченных во время погружений.",
  path: "/marine-life",
});

export default function MarineLifePage() {
  const items = getAllMarineLife();
  return (
    <main className="p-4 max-w-[75ch] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Подводный мир</h1>
      {items.length === 0 ? (
        <p>Пока нет записей.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/marine-life/${item.slug}`}
                className="hover:underline"
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-neutral-500 ml-2">{item.nameEn}</span>
                {item.latinName && (
                  <span className="text-neutral-400 italic ml-2">
                    {item.latinName}
                  </span>
                )}
              </Link>
              <p className="text-sm text-neutral-500 mt-1">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
