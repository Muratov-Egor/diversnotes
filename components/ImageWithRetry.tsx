"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import type { ComponentProps } from "react";

const MAX_RETRIES = 3;

type Props = ComponentProps<typeof Image>;

export function ImageWithRetry(props: Props) {
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback(() => {
    setRetryCount((prev) => (prev < MAX_RETRIES - 1 ? prev + 1 : prev));
  }, []);

  return (
    <Image
      {...props}
      key={retryCount}
      onError={retryCount < MAX_RETRIES - 1 ? handleError : undefined}
    />
  );
}
