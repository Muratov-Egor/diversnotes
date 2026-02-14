"use client";

import { useState } from "react";
import type { TocItem } from "@/lib/article-toc";
import { TableOfContents } from "./TableOfContents";

const TOC_WIDTH_EXPANDED = "13rem"; // w-52, как в TableOfContents
const TOC_WIDTH_COLLAPSED = "2.5rem"; // только вкладка для разворота

type Props = {
  tocItems: TocItem[];
  children: React.ReactNode;
};

export function ArticleWithTocLayout({ tocItems, children }: Props) {
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <div className="flex gap-8 lg:gap-12">
      {/* Колонка TOC: плавное изменение ширины */}
      <div
        className="hidden lg:block shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
        style={{
          width: isTocOpen ? TOC_WIDTH_EXPANDED : TOC_WIDTH_COLLAPSED,
        }}
      >
        <div className="top-6 z-10 w-[13rem]">
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
              aria-label="Показать оглавление"
            >
              <span
                className="text-xs font-medium uppercase tracking-wider [writing-mode:vertical] [text-orientation:mixed] rotate-180 select-none"
                style={{ writingMode: "vertical-rl" }}
              >
                Оглавление
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Контент статьи: занимает оставшееся место */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
