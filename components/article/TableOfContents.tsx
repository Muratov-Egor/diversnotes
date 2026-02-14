import type { TocItem } from "@/lib/article-toc";

type Props = {
  items: TocItem[];
  onCollapse?: () => void;
};

export function TableOfContents({ items, onCollapse }: Props) {
  if (items.length === 0) return null;

  return (
    <nav
      className="hidden lg:block w-52 shrink-0"
      aria-label="Оглавление"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Оглавление
        </p>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="shrink-0 p-1 rounded text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Свернуть оглавление"
            title="Свернуть оглавление"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>
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
