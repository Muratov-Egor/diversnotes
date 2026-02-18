"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function NavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navLinks = [
    { href: "/blog" as const, label: t("blog") },
    { href: "/marine-life" as const, label: t("marineLife") },
    { href: "/map" as const, label: t("map") },
  ];

  return (
    <>
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={
              isActive
                ? "font-medium text-neutral-900 dark:text-neutral-100"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            }
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
