"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
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

type SearchIndex = { all: IndexEntry[]; ru?: IndexEntry[]; en?: IndexEntry[] };

type SearchResult = {
  title: string;
  path: string;
  category: "blog" | "marine-life";
  image?: string;
  nameEn?: string;
  snippet: { before: string; match: string; after: string };
};

const MAX_RESULTS = 12;

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

function getVisualViewportRect() {
  if (typeof window === "undefined") return null;
  const vv = window.visualViewport;
  if (vv) {
    return {
      top: vv.offsetTop,
      left: vv.offsetLeft,
      width: vv.width,
      height: vv.height,
    };
  }
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export function SearchBox() {
  const t = useTranslations("search");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewportRect, setViewportRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchIndex) => setIndex(data))
      .catch(() => setIndex({ all: [] }));
  }, []);

  const q = query.trim();
  const entries = useMemo(() => {
    if (!index) return [];
    const localeEntries = locale === "en" ? index.en : index.ru;
    return localeEntries ?? index.all ?? [];
  }, [index, locale]);

  const results: SearchResult[] = useMemo(() => {
    if (!index || q.length < 2) return [];
    const cleanedQuery = cleanText(q);
    const matched: SearchResult[] = [];
    for (const item of entries) {
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
  }, [index, q, entries]);

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

  useEffect(() => {
    if (mobileOpen) {
      mobileInputRef.current?.focus();
      setViewportRect(getVisualViewportRect());
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      setViewportRect(null);
      const scrollY = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setViewportRect(getVisualViewportRect());
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [mobileOpen]);

  function getCategoryName(category: string): string {
    return category === "blog" ? t("categoryBlog") : t("categoryMarineLife");
  }

  const showDropdown = open && query.trim().length >= 2;

  const resultsContent = (
    <>
      {!index ? (
        <p className="px-4 py-3 text-base text-neutral-500 dark:text-neutral-400">
          {t("loading")}
        </p>
      ) : results.length === 0 ? (
        <p className="px-4 py-3 text-base text-neutral-500 dark:text-neutral-400">
          {t("noResults")}
        </p>
      ) : (
        results.map((item) => (
          <Link
            key={`${item.category}-${item.path}`}
            href={item.path as "/"}
            className="flex gap-3 px-4 py-3 text-base transition hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
            role="option"
            onClick={() => {
              setOpen(false);
              setMobileOpen(false);
            }}
          >
            {item.image ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
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
    </>
  );

  const resultsContentMobile = (
    <>
      {!index ? (
        <p className="px-4 py-4 text-base text-neutral-500 dark:text-neutral-400">
          {t("loading")}
        </p>
      ) : results.length === 0 ? (
        <p className="px-4 py-4 text-base text-neutral-500 dark:text-neutral-400">
          {t("noResults")}
        </p>
      ) : (
        results.map((item) => (
          <Link
            key={`${item.category}-${item.path}`}
            href={item.path as "/"}
            className="flex w-full gap-3 px-4 py-3 text-left text-base transition active:bg-neutral-100 dark:active:bg-neutral-800/80"
            role="option"
            onClick={() => setMobileOpen(false)}
          >
            {item.image ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            )}
            <div className="min-w-0 flex-1">
              <span className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
                {item.title}
              </span>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                {getCategoryName(item.category)}
              </p>
              {(item.snippet.before ||
                item.snippet.match ||
                item.snippet.after) && (
                <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
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
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 md:hidden"
        aria-label={t("openSearch")}
      >
        <SearchIcon />
      </button>

      <div ref={wrapperRef} className="relative hidden md:block">
        <input
          type="search"
          placeholder={t("placeholder")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-40 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base placeholder:text-neutral-400 transition focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900/50 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 sm:w-52"
          aria-label={t("searchSite")}
        />
        {showDropdown && (
          <div
            className="absolute right-0 top-full z-50 mt-2 max-h-[32rem] w-[28rem] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md dark:border-neutral-800 dark:bg-neutral-900/95 dark:shadow-neutral-950/20"
            role="listbox"
          >
            <div className="max-h-[32rem] overflow-auto py-2">
              {resultsContent}
            </div>
          </div>
        )}
      </div>

      {mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="flex flex-col overflow-hidden bg-white dark:bg-neutral-900 h-full"
            style={{
              position: "fixed",
              ...(viewportRect
                ? {
                    top: viewportRect.top,
                    left: viewportRect.left,
                    width: viewportRect.width,
                    height: viewportRect.height,
                  }
                : {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    minHeight: "100dvh",
                  }),
              zIndex: 9999,
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              paddingRight: "env(safe-area-inset-right)",
              boxSizing: "border-box",
            }}
            role="dialog"
            aria-label={t("searchSite")}
          >
            <div className="flex w-full shrink-0 items-center gap-2 px-4 py-3">
              <div className="relative min-w-0 flex-1">
                <input
                  ref={mobileInputRef}
                  type="search"
                  placeholder={t("placeholder")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={`h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-4 pr-4 text-base placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:ring-neutral-700 ${query.length > 0 ? "pr-11" : ""}`}
                  aria-label={t("searchSite")}
                  autoComplete="off"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-500 active:bg-neutral-200 dark:active:bg-neutral-700"
                    aria-label={t("clearField")}
                  >
                    <ClearIcon />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-500 active:bg-neutral-100 dark:text-neutral-400 dark:active:bg-neutral-800"
                aria-label={t("closeSearch")}
              >
                <CloseIcon />
              </button>
            </div>
            <div
              className={
                query.trim().length >= 2 && results.length > 0
                  ? "min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
                  : "min-h-0 flex-1 overflow-hidden"
              }
            >
              {query.trim().length < 2 ? (
                <p className="px-4 py-6 text-center text-sm text-neutral-400 dark:text-neutral-500">
                  {t("minChars")}
                </p>
              ) : (
                resultsContentMobile
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
