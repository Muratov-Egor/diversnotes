type Props = {
  description?: string;
  nameEn?: string;
  latinName?: string;
  depthRange?: string;
  locations?: string[];
};

export function MarineLifeBriefInfo({
  description,
  nameEn,
  latinName,
  depthRange,
  locations,
}: Props) {
  const hasAny =
    description ||
    nameEn ||
    latinName ||
    depthRange ||
    (locations && locations.length > 0);
  if (!hasAny) return null;

  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-4 dark:border-neutral-700 dark:bg-neutral-900/40">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
        Краткая информация
      </h2>
      <dl className="space-y-2 text-sm">
        {description && (
          <div>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {description}
            </dd>
          </div>
        )}
        {(nameEn || latinName) && (
          <div>
            <dt className="sr-only">Название</dt>
            <dd className="text-neutral-600 dark:text-neutral-400">
              {nameEn}
              {latinName && (
                <span className="italic"> — {latinName}</span>
              )}
            </dd>
          </div>
        )}
        {depthRange && (
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              Глубина:
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {depthRange}
            </dd>
          </div>
        )}
        {locations && locations.length > 0 && (
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400 shrink-0">
              Место обитания:
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {locations.join(", ")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
