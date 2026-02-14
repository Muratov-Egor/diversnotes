import type { TocItem } from "@/lib/article-toc";

type Props = { items: TocItem[] };

export function TableOfContents({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      className="sticky top-6 hidden lg:block w-52 shrink-0"
      aria-label="Оглавление"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
        Оглавление
      </p>
      <ul className="space-y-1.5 border-l border-neutral-200 dark:border-neutral-700 pl-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-3" : ""}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
