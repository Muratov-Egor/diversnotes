"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cleanText } from "@/utils/textUtils";
import { findSearchSnippet } from "@/utils/searchUtils";

type IndexEntry = {
  title: string;
  path: string;
  category: "blog" | "marine-life";
  image?: string;
  nameEn?: string;
  contentSearch: string;
};

type SearchIndex = { all: IndexEntry[] };

type SearchResult = {
  title: string;
  path: string;
  category: "blog" | "marine-life";
  image?: string;
  nameEn?: string;
  snippet: { before: string; match: string; after: string };
};

function getCategoryName(category: string): string {
  return category === "blog" ? "Блог" : "Подводный мир";
}

const MAX_RESULTS = 12;

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchIndex) => setIndex(data))
      .catch(() => setIndex({ all: [] }));
  }, []);

  const q = query.trim();
  const results: SearchResult[] = useMemo(() => {
    if (!index || q.length < 2) return [];
    const cleanedQuery = cleanText(q);
    const matched: SearchResult[] = [];
    for (const item of index.all) {
      const searchText =
        cleanText(item.title) +
        " " +
        cleanText(item.nameEn ?? "") +
        " " +
        item.contentSearch;
      if (!searchText.includes(cleanedQuery)) continue;
      matched.push({
        title: item.title,
        path: item.path,
        category: item.category,
        image: item.image,
        nameEn: item.nameEn,
        snippet: findSearchSnippet(
          item.contentSearch,
          cleanedQuery,
          item.title,
          item.nameEn ?? "",
        ),
      });
      if (matched.length >= MAX_RESULTS) break;
    }
    return matched;
  }, [index, q]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown =
    open && query.trim().length >= 2;

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="search"
        placeholder="Поиск..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-40 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900/50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 sm:w-52"
        aria-label="Поиск по сайту"
      />
      {showDropdown && (
        <div
          className="absolute right-0 top-full z-50 mt-2 max-h-[32rem] w-[28rem] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/95 dark:shadow-neutral-950/20"
          role="listbox"
        >
          <div className="max-h-[32rem] overflow-auto py-2">
            {!index ? (
              <p className="px-4 py-3 text-base text-neutral-500 dark:text-neutral-400">
                Загрузка...
              </p>
            ) : results.length === 0 ? (
              <p className="px-4 py-3 text-base text-neutral-500 dark:text-neutral-400">
                Ничего не найдено
              </p>
            ) : (
              results.map((item) => (
                <Link
                  key={`${item.category}-${item.path}`}
                  href={item.path}
                  className="flex gap-3 px-4 py-3 text-base transition hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
                  role="option"
                  onClick={() => setOpen(false)}
                >
                  {item.image ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {item.title}
                    </span>
                    {item.nameEn && (
                      <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                        {item.nameEn}
                      </span>
                    )}
                    <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                      {getCategoryName(item.category)}
                    </p>
                    {(item.snippet.before ||
                      item.snippet.match ||
                      item.snippet.after) && (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                        {item.snippet.before && `...${item.snippet.before} `}
                        <strong className="font-medium text-neutral-700 dark:text-neutral-300">
                          {item.snippet.match}
                        </strong>
                        {item.snippet.after && ` ${item.snippet.after}...`}
                      </p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
