import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo/config";
import { SearchBox } from "@/components/search/SearchBox";
import { NavLinks } from "@/components/layout/NavLinks";
import "./globals.css";

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
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <div className="mx-auto min-h-screen max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 border-b border-neutral-200/80 pb-4 dark:border-neutral-800/80">
            <nav className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-base">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
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
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <NavLinks />
                </div>
              </div>
              <SearchBox />
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
