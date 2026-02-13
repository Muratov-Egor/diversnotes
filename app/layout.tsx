import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b px-4 py-3">
          <nav className="flex flex-wrap gap-4">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href} className="hover:underline">
                {label}
              </a>
            ))}
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
