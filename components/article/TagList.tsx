import Link from "next/link";
import { getTagSlugByRu } from "@/lib/content/tags";

type Props = { tags: string[]; className?: string };

export function TagList({ tags, className = "" }: Props) {
  if (tags.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-1 gap-y-0.5 ${className}`.trim()}
    >
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        🏷️ Tags:
      </span>
      {tags.map((tag, i) => {
        const slug = getTagSlugByRu(tag) ?? encodeURIComponent(tag);
        const isLast = i === tags.length - 1;
        return (
          <span key={tag} className="text-sm">
            <Link href={`/tags/${slug}`} className="hover:underline">
              {tag}
            </Link>
            {!isLast && (
              <span className="text-neutral-400 dark:text-neutral-500">,</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
