import type { ReactNode } from "react";

type Props = { children: ReactNode };

export function ArticleProse({ children }: Props) {
  return (
    <div className="min-w-0 prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24">
      {children}
    </div>
  );
}
