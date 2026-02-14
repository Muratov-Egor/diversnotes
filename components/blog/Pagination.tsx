import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath?: string; // e.g. "/blog"
  pageParam?: string; // default "page"
};

function pageHref(basePath: string, page: number, pageParam: string): string {
  if (page <= 1) return basePath;
  const joiner = basePath.includes("?") ? "&" : "?";
  return `${basePath}${joiner}${pageParam}=${page}`;
}

type Item = number | "dots";

function getItems(current: number, total: number): Item[] {
  // boundaryCount=1, siblingCount=1 (редакционный минимализм)
  const sibling = 1;

  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const first = 1;
  const last = total;

  const start = Math.max(2, current - sibling);
  const end = Math.min(total - 1, current + sibling);

  const items: Item[] = [first];

  if (start > 2) items.push("dots");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("dots");

  items.push(last);

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "/blog",
  pageParam = "page",
}: Props) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const items = getItems(currentPage, totalPages);

  const arrowBase =
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-600 dark:text-neutral-400";
  const arrowHover =
    "sm:transition sm:hover:-translate-y-px sm:hover:text-neutral-900 sm:dark:hover:text-neutral-100";
  const arrowDisabled = "text-neutral-300 dark:text-neutral-700";

  const pageBase =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm";
  const pageHover =
    "sm:transition sm:hover:-translate-y-px sm:hover:text-neutral-900 sm:dark:hover:text-neutral-100";
  const pageText = "text-neutral-600 dark:text-neutral-400";
  const pageActive =
    "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-medium";

  return (
    <nav
      className="mt-10 border-t border-neutral-200 pt-6 dark:border-neutral-800"
      aria-label="Пагинация"
    >
      {/* MOBILE: ← 2 / 10 → */}
      <div className="flex items-center justify-center gap-3 sm:hidden">
        {prevPage ? (
          <Link
            href={pageHref(basePath, prevPage, pageParam)}
            aria-label="Предыдущая страница"
            className={`${arrowBase} ${arrowHover}`}
          >
            ←
          </Link>
        ) : (
          <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
            ←
          </span>
        )}

        <div className="select-none text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            {currentPage}
          </span>{" "}
          / {totalPages}
        </div>

        {nextPage ? (
          <Link
            href={pageHref(basePath, nextPage, pageParam)}
            aria-label="Следующая страница"
            className={`${arrowBase} ${arrowHover}`}
          >
            →
          </Link>
        ) : (
          <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
            →
          </span>
        )}
      </div>

      {/* DESKTOP: ← 1 … 5 6 [7] 8 9 … 20 → */}
      <div className="hidden items-center justify-center gap-3 sm:flex">
        {prevPage ? (
          <Link
            href={pageHref(basePath, prevPage, pageParam)}
            aria-label="Предыдущая страница"
            className={`${arrowBase} ${arrowHover}`}
          >
            ←
          </Link>
        ) : (
          <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
            ←
          </span>
        )}

        <ul className="flex items-center gap-2" aria-label="Номера страниц">
          {items.map((it, idx) => {
            if (it === "dots") {
              return (
                <li
                  key={`dots-${idx}`}
                  className="select-none px-2 text-neutral-400 dark:text-neutral-600"
                  aria-hidden
                >
                  …
                </li>
              );
            }

            const page = it;
            const isActive = page === currentPage;

            return (
              <li key={page}>
                {isActive ? (
                  <span
                    aria-current="page"
                    className={`${pageBase} ${pageActive}`}
                  >
                    {page}
                  </span>
                ) : (
                  <Link
                    href={pageHref(basePath, page, pageParam)}
                    aria-label={`Страница ${page}`}
                    className={`${pageBase} ${pageText} ${pageHover}`}
                  >
                    {page}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {nextPage ? (
          <Link
            href={pageHref(basePath, nextPage, pageParam)}
            aria-label="Следующая страница"
            className={`${arrowBase} ${arrowHover}`}
          >
            →
          </Link>
        ) : (
          <span aria-hidden className={`${arrowBase} ${arrowDisabled}`}>
            →
          </span>
        )}
      </div>

      {/* SR-only: всегда доступно скринридеру */}
      <p className="sr-only hidden">
        Страница {currentPage} из {totalPages}
      </p>
    </nav>
  );
}
