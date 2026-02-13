import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo/config";
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

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/blog", label: "Блог" },
  { href: "/marine-life", label: "Подводный мир" },
  { href: "/map", label: "Карта" },
  { href: "/about", label: "О проекте" },
];

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
        <div className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6">
          <header className="mb-8 border-b border-neutral-200 pb-4 dark:border-neutral-800">
            <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
              <a
                href="/"
                className="font-medium text-neutral-900 dark:text-neutral-100"
              >
                Diver&apos;s Notes
              </a>
              {navLinks.filter((l) => l.href !== "/").map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  {label}
                </a>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
