import Link from "next/link";

const CONTAINER = "mx-auto max-w-6xl px-5 sm:px-6";
const FOOTER_WRAP = "mt-16 border-t border-neutral-200 py-8 dark:border-neutral-800/80";

const TEXT_MUTED = "text-neutral-500 dark:text-neutral-400";
const TEXT_MAIN = "text-neutral-900 dark:text-neutral-100";

const ICON_BTN =
  "inline-flex h-10 w-10 min-h-[40px] min-w-[40px] items-center justify-center rounded-lg " +
  "border border-neutral-200 bg-neutral-50 text-neutral-600 " +
  "transition hover:bg-neutral-100 hover:text-neutral-900 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 " +
  "dark:border-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-400 " +
  "dark:hover:bg-neutral-700 dark:hover:text-neutral-100";

const LINKS = [
  {
    href: "https://instagram.com/diver_egor",
    label: "Instagram DiversNotes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    external: true,
  },
  {
    href: "https://www.youtube.com/@diversnotes",
    label: "YouTube DiversNotes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    external: true,
  },
  {
    href: "https://t.me/diversnotes",
    label: "Telegram DiversNotes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    external: true,
  },
  {
    href: "/rss.xml",
    label: "RSS-лента",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    ),
    external: false,
  },
  {
    href: "mailto:egor_muratov@hotmail.com",
    label: "Контакты",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    external: true,
  },
] as const;

function IconLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  const common = {
    className: ICON_BTN,
    "aria-label": label,
    title: label,
    children: icon,
  } as const;

  if (href.startsWith("mailto:")) return <a href={href} {...common} />;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" {...common} />;
  return <Link href={href} {...common} />;
}

export function Footer() {
  return (
    <footer className={FOOTER_WRAP}>
      <div className={CONTAINER}>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="max-w-[44ch] text-center md:text-left">
            <p className={`text-sm leading-5 ${TEXT_MAIN}`}>© 2023–2026 Егор Муратов</p>
            <p className={`mt-1.5 text-sm leading-5 ${TEXT_MUTED}`}>
              DiversNotes — личный блог о дайвинге: заметки, описание дайв-сайтов, фотографии подводных обитателей.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {LINKS.map((it) => (
              <IconLink key={it.href} href={it.href} label={it.label} icon={it.icon} external={it.external} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
