"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";

const MAX_RETRIES = 4;
const RETRY_DELAYS = [1000, 2000, 3000];

type Props = ComponentProps<typeof Image>;

export function ImageWithRetry(props: Props) {
  const t = useTranslations("image");
  const [retryCount, setRetryCount] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleError = useCallback(() => {
    if (retryCount >= MAX_RETRIES - 1) {
      setIsFailed(true);
      return;
    }
    setIsFailed(true);
    const delay = RETRY_DELAYS[retryCount] ?? 3000;
    timeoutRef.current = setTimeout(() => {
      setIsFailed(false);
      setRetryCount((prev) => prev + 1);
      timeoutRef.current = null;
    }, delay);
  }, [retryCount]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (isFailed && retryCount < MAX_RETRIES - 1) {
    return (
      <div
        className="animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-3xl min-h-[200px] w-full flex items-center justify-center"
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-neutral-500 dark:text-neutral-400 text-sm">
          {t("loading")}
        </span>
      </div>
    );
  }

  if (isFailed && retryCount >= MAX_RETRIES - 1) {
    return (
      <div
        className="bg-neutral-100 dark:bg-neutral-800 rounded-3xl min-h-[200px] w-full flex flex-col items-center justify-center gap-2 p-4"
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="text-neutral-500 dark:text-neutral-400 text-sm text-center">
          {t("loadFailed")}
        </span>
        <button
          type="button"
          onClick={() => {
            setIsFailed(false);
            setRetryCount(0);
          }}
          className="text-sm underline text-neutral-600 dark:text-neutral-300 hover:no-underline"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return <Image {...props} key={retryCount} onError={handleError} />;
}
