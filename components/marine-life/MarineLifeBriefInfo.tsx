"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const EMPTY = "—";

type Props = {
  description?: string;
  title?: string;
  nameEn?: string;
  latinName?: string;
  size?: string;
  depthRange?: string;
  locations?: string[];
  family?: string;
  category?: string;
  activity?: string;
  conservationStatus?: string;
};

export function MarineLifeBriefInfo({
  description,
  title,
  nameEn,
  latinName,
  size,
  depthRange,
  locations,
  family,
  category,
  activity,
  conservationStatus,
}: Props) {
  const t = useTranslations("marineLifeInfo");
  const [open, setOpen] = useState(true);
  const hasNames = title || nameEn || latinName;
  const locationsStr =
    locations && locations.length > 0 ? locations.join(", ") : EMPTY;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-colors"
        aria-expanded={open}
        aria-controls="marine-life-brief-content"
        id="marine-life-brief-trigger"
      >
        <span className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t("briefInfo")}
        </span>
        <span
          className="shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-200"
          aria-hidden
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        id="marine-life-brief-content"
        role="region"
        aria-labelledby="marine-life-brief-trigger"
        className={
          open
            ? "border-t border-neutral-200 dark:border-neutral-700"
            : "hidden"
        }
      >
        <dl className="space-y-2 text-sm px-4 py-3 pt-3">
          <div>
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0 mb-0.5">
              {t("names")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {hasNames ? (
                <>
                  {title && <span>{title}</span>}
                  {title && (nameEn || latinName) && " — "}
                  {nameEn && <span>{nameEn}</span>}
                  {nameEn && latinName && " — "}
                  {latinName && <span className="italic">{latinName}</span>}
                </>
              ) : (
                EMPTY
              )}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0 mb-0.5">
              {t("description")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {description?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("size")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {size?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("depth")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {depthRange?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("habitat")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {locationsStr}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("family")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {family?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("type")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {category?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("activity")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {activity?.trim() || EMPTY}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              {t("conservationStatus")}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {conservationStatus?.trim() || EMPTY}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
