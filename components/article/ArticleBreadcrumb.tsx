import Link from "next/link";

type Props = {
  sectionHref: string;
  sectionLabel: string;
  currentTitle: string;
};

export function ArticleBreadcrumb({
  sectionHref,
  sectionLabel,
  currentTitle,
}: Props) {
  return (
    <p className="text-sm mb-2">
      <Link href={"/"} className="hover:underline">
        Главная
      </Link>
      <span className="mx-2">/</span>
      <Link href={sectionHref} className="hover:underline">
        {sectionLabel}
      </Link>
      <span className="mx-2">/</span>
      <span className="text-neutral-500 dark:text-neutral-400">
        {currentTitle}
      </span>
    </p>
  );
}
