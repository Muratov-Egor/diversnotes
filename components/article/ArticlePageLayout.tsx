import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  jsonLdArticle?: object | null;
  jsonLdBreadcrumb: object;
};

export function ArticlePageLayout({
  children,
  jsonLdArticle,
  jsonLdBreadcrumb,
}: Props) {
  return (
    <main className="py-6 sm:py-8">
      {jsonLdArticle != null && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
