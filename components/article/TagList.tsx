import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getTagBySlug, getTagLabel, getTagSlugByRu } from "@/lib/content/tags";

type Props = { tags: string[]; className?: string; locale: string };

export async function TagList({ tags, className = "", locale }: Props) {
  if (tags.length === 0) return null;
  const t = await getTranslations({ locale, namespace: "article" });

  return (
    <div
      className={`flex flex-wrap items-center gap-x-1 gap-y-0.5 ${className}`.trim()}
    >
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        🏷️ {t("tagsLabel")}
      </span>
      {tags.map((tag, i) => {
        const slugFromRu = getTagSlugByRu(tag);
        const slug = slugFromRu ?? encodeURIComponent(tag);
        const tagObj =
          slugFromRu != null ? getTagBySlug(slugFromRu) : undefined;
        const label = tagObj ? getTagLabel(tagObj, locale) : tag;
        const isLast = i === tags.length - 1;
        return (
          <span key={tag} className="text-sm">
            <Link href={`/tags/${slug}`} className="hover:underline">
              {label}
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
