"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  ru: "RU",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "ru" ? "en" : "ru";

  function handleSwitch() {
    router.replace(
      { pathname: pathname as "/" },
      { locale: otherLocale as (typeof routing.locales)[number] },
    );
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="cursor-pointer inline-flex h-10 min-w-[40px] shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      aria-label={`Switch to ${LABELS[otherLocale]}`}
    >
      {LABELS[otherLocale]}
    </button>
  );
}
