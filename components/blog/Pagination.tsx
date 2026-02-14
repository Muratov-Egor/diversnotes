import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath?: string;
};

function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}?page=${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/blog",
}: Props) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800"
      aria-label="Пагинация"
    >
      {prevPage !== null ? (
        <Link
          href={pageHref(basePath, prevPage)}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          ← Предыдущая
        </Link>
      ) : (
        <span
          className="cursor-not-allowed rounded-lg border border-neutral-100 px-4 py-2 text-sm text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"
          aria-hidden
        >
          ← Предыдущая
        </span>
      )}

      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Страница {currentPage} из {totalPages}
      </span>

      {nextPage !== null ? (
        <Link
          href={pageHref(basePath, nextPage)}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Следующая →
        </Link>
      ) : (
        <span
          className="cursor-not-allowed rounded-lg border border-neutral-100 px-4 py-2 text-sm text-neutral-400 dark:border-neutral-800 dark:text-neutral-500"
          aria-hidden
        >
          Следующая →
        </span>
      )}
    </nav>
  );
}
