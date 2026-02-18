import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  sectionHref: string;
  sectionLabel: string;
  currentTitle: string;
};

export async function ArticleBreadcrumb({
  sectionHref,
  sectionLabel,
  currentTitle,
}: Props) {
  const t = await getTranslations("breadcrumb");

  return (
    <p className="text-sm mb-2">
      <Link href="/" className="hover:underline">
        {t("home")}
      </Link>
      <span className="mx-2">/</span>
      <Link href={sectionHref as "/"} className="hover:underline">
        {sectionLabel}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-neutral-500 dark:text-neutral-400">
        {currentTitle}
      </span>
    </p>
  );
}
