import Link from "next/link";
import type { BlogPostMeta } from "@/lib/content/blog";
import { formatDate } from "@/lib/format/date";
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

type Props = { post: BlogPostMeta; variant?: "default" | "featured" };

export function BlogCard({ post, variant = "default" }: Props) {
  const { slug, title, description, date, cover } = post;
  const href = `/blog/${slug}`;
  const isFeatured = variant === "featured";

  const imageAspect = isFeatured ? "aspect-[21/9]" : "aspect-[16/10]";
  const imageSizes = isFeatured
    ? "(max-width: 1024px) 100vw, 1024px"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <Link
      href={href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700"
    >
      {cover && (
        <div
          className={`relative w-full flex-shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-800 ${imageAspect}`}
        >
          {isBackblazeUrl(cover) ? (
            <ImageWithRetry
              src={cover}
              alt=""
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes={imageSizes}
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
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
        <h2
          className={
            isFeatured
              ? "line-clamp-1 font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 sm:text-xl"
              : "line-clamp-1 font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
          }
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-base text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
        <div className="mt-auto pt-2">
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            <time dateTime={date}>{formatDate(date)}</time>
          </p>
        </div>
      </div>
    </Link>
  );
}
