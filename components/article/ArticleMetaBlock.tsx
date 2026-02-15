import type { ReactNode } from "react";

type Props = { children: ReactNode };

/** Отдельный блок для хлебных крошек и мета-информации (глубина, время чтения, копировать ссылку). */
export function ArticleMetaBlock({ children }: Props) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900/40">
      {children}
    </div>
  );
}
