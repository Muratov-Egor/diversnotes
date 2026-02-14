import Link from "next/link";
import type { MarineLifeMeta } from "@/lib/content/marine-life";
import { ImageWithRetry } from "@/components/ImageWithRetry";

const BACKBLAZE_HOSTS = [
  "f003.backblazeb2.com",
  "diversnotes-images.s3.eu-central-003.backblazeb2.com",
];

function isBackblazeUrl(src: string): boolean {
  try {
    const u = new URL(src);
    return BACKBLAZE_HOSTS.some((h) => u.hostname === h);
  } catch {
    return false;
  }
}

type Props = { item: MarineLifeMeta };

export function MarineLifeCard({ item }: Props) {
  const { slug, title, description, nameEn, latinName, images } = item;
  const href = `/marine-life/${slug}`;
  const cover = images?.[0];

  return (
    <Link
      href={href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
    >
      {cover && (
        <div className="relative aspect-[16/10] w-full flex-shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-800">
          {isBackblazeUrl(cover) ? (
            <ImageWithRetry
              src={cover}
              alt=""
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            />
          )}
        </div>
      )}
      <div className="flex min-h-[7rem] flex-1 flex-col p-4 sm:p-5">
        <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 line-clamp-2 flex-shrink-0 text-base text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
        {(nameEn || latinName) && (
          <p className="mt-auto pt-2 text-xs text-neutral-400 dark:text-neutral-500">
            {nameEn}
            {latinName && <span className="italic"> — {latinName}</span>}
          </p>
        )}
      </div>
    </Link>
  );
}
