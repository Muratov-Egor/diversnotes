import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo/config";
import { SearchBox } from "@/components/search/SearchBox";
import { NavLinks } from "@/components/layout/NavLinks";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

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

export const metadata: Metadata = {
  title: "Diver's Notes",
  description: "Заметки о дайвинге и подводном мире",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "Diver's Notes",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <div className="mx-auto min-h-screen max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
            <nav className="flex flex-col gap-3 text-base md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:gap-y-3">
              <div className="flex flex-shrink-0 items-center justify-between gap-4 md:contents">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 font-semibold text-neutral-900 dark:text-neutral-100"
                >
                  <Image
                    src="/logo.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                  <span className="text-lg">Diver&apos;s Notes</span>
                </Link>
                <div className="hidden flex-wrap items-center justify-center gap-x-6 gap-y-1 md:flex">
                  <NavLinks />
                </div>
                <SearchBox />
                <ThemeToggle />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 md:hidden">
                <NavLinks />
              </div>
            </nav>
          </header>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
