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
        cleanText(item.title) + " " + cleanText(item.nameEn ?? "") + " " + item.contentSearch;
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
          item.nameEn ?? ""
        ),
      });
      if (matched.length >= MAX_RESULTS) break;
    }
    return matched;
  }, [index, q]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.length > 0 && query.trim().length >= 2;
  const showDropdown = open && (query.trim().length > 0 || hasResults);

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
        className="w-36 rounded border border-neutral-300 bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:placeholder:text-neutral-500 sm:w-44"
        aria-label="Поиск по сайту"
      />
      {showDropdown && (
        <div
          className="absolute right-0 top-full z-50 mt-1 max-h-80 w-80 overflow-auto rounded border border-neutral-200 bg-white py-1 shadow dark:border-neutral-700 dark:bg-neutral-900"
          role="listbox"
        >
          {!index ? (
            <p className="px-3 py-2 text-sm text-neutral-500">Загрузка...</p>
          ) : query.trim().length < 2 ? (
            <p className="px-3 py-2 text-sm text-neutral-500">Минимум 2 символа</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-neutral-500">Ничего не найдено</p>
          ) : (
            results.map((item) => (
              <Link
                key={`${item.category}-${item.path}`}
                href={item.path}
                className="flex gap-3 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                role="option"
                onClick={() => setOpen(false)}
              >
                {item.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded bg-neutral-200 dark:bg-neutral-700" />
                )}
                <div className="min-w-0 flex-1">
                  <span className="font-medium">{item.title}</span>
                  {item.nameEn && (
                    <span className="ml-1 text-neutral-500">{item.nameEn}</span>
                  )}
                  <p className="mt-0.5 text-xs text-blue-600 dark:text-blue-400">
                    {getCategoryName(item.category)}
                  </p>
                  {(item.snippet.before || item.snippet.match || item.snippet.after) && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
                      {item.snippet.before && `...${item.snippet.before} `}
                      <strong>{item.snippet.match}</strong>
                      {item.snippet.after && ` ${item.snippet.after}...`}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
