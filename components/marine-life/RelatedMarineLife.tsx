import type { MarineLifeMeta } from "@/lib/content/marine-life";
import { MarineLifeCard } from "./MarineLifeCard";

type Props = { items: MarineLifeMeta[] };

export function RelatedMarineLife({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8 dark:border-neutral-700">
      <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        Читать также
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <MarineLifeCard item={item} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}
