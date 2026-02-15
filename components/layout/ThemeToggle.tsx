"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(value: "light" | "dark") {
  localStorage.setItem(STORAGE_KEY, value);
  if (value === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}

const ICON_BTN =
  "inline-flex h-10 w-10 min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl " +
  "border border-neutral-200 bg-white text-neutral-600 " +
  "transition hover:bg-neutral-50 hover:text-neutral-900 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 " +
  "dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400 " +
  "dark:hover:bg-neutral-800 dark:hover:text-neutral-100";

function SunIcon() {
  return (
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
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
      <path d="M12 3a7 7 0 1 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  if (!mounted) {
    return <span className={ICON_BTN} aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={ICON_BTN}
      aria-label="Переключить тему"
      title={isDark ? "Светлая тема" : "Тёмная тема"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
