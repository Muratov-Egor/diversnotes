import Link from "next/link";

type Props = { tags: string[]; className?: string };

export function TagList({ tags, className = "" }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`.trim()}>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        🏷️ Tags:
      </span>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="hover:underline text-sm"
            >
              {tag}
            </Link>

            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              ,{" "}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
