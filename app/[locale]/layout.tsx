import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getTranslations,
  setRequestLocale,
  getMessages,
} from "next-intl/server";
import { SITE_URL, SITE_NAME } from "@/lib/seo/config";
import { SearchBox } from "@/components/search/SearchBox";
import { NavLinks } from "@/components/layout/NavLinks";
import { Footer } from "@/components/layout/Footer";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Analytics } from "@vercel/analytics/react";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const themeScript = `
(function(){
  var t = localStorage.getItem('theme');
  if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (t === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: "Diver's Notes",
    description: t("siteDescription"),
    metadataBase: new URL(SITE_URL),
    openGraph: {
      siteName: "Diver's Notes",
      type: "website",
      locale: locale === "en" ? "en_US" : "ru_RU",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "metadata" });
  const messages = await getMessages();

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: t("siteDescription"),
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdWebSite),
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="mx-auto flex min-h-screen max-w-7xl w-full flex-col px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-8 border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
              <nav className="flex flex-col gap-3 text-base md:flex-row md:items-center md:justify-between md:gap-x-6">
                <div className="flex items-center justify-between gap-4 md:contents">
                  <div className="flex items-center gap-4 md:gap-6">
                    <Link
                      href="/"
                      className="flex items-center gap-2.5 font-semibold text-neutral-900 dark:text-neutral-100"
                    >
                      <Image
                        src="/logo.png"
                        alt={t("logoAlt")}
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                      <span className="text-lg">Diver&apos;s Notes</span>
                    </Link>
                    <div className="hidden items-center gap-x-6 md:flex">
                      <NavLinks />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SearchBox />
                    <ThemeToggle />
                    <LanguageSwitcher />
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:hidden">
                  <NavLinks />
                </div>
              </nav>
            </header>
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </div>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
