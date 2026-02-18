"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export function CopyLinkButton() {
  const t = useTranslations("copyLink");
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md "
      aria-label={copied ? t("copiedAriaLabel") : t("copyAriaLabel")}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
