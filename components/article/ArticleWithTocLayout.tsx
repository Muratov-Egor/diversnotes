"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { TocItem } from "@/lib/article-toc";
import { TableOfContents } from "./TableOfContents";

const TOC_WIDTH_EXPANDED = "13rem";
const TOC_WIDTH_COLLAPSED = "2.5rem";

type Props = {
  tocItems: TocItem[];
  children: React.ReactNode;
};

export function ArticleWithTocLayout({ tocItems, children }: Props) {
  const t = useTranslations("toc");
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <div className="flex gap-8 lg:gap-12">
      <div
        className="hidden lg:block shrink-0 transition-[width] duration-300 ease-out"
        style={{
          width: isTocOpen ? TOC_WIDTH_EXPANDED : TOC_WIDTH_COLLAPSED,
        }}
      >
        <div className="sticky top-6 z-10 w-[13rem] self-start overflow-hidden">
          {isTocOpen ? (
            <TableOfContents
              items={tocItems}
              onCollapse={() => setIsTocOpen(false)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsTocOpen(true)}
              className="cursor-pointer flex items-center justify-center w-10 h-24 rounded-r-md border border-neutral-200 dark:border-neutral-700 border-l-0 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={t("show")}
            >
              <span
                className="text-xs font-medium uppercase tracking-wider [writing-mode:vertical] [text-orientation:mixed] rotate-180 select-none"
                style={{ writingMode: "vertical-rl" }}
              >
                {t("title")}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
