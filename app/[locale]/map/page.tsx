import { Link } from "@/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getDiveSites,
  getDiveSitesGroupedByCountry,
  getDiveStats,
  type DiveSiteItem,
  type DiveSiteType,
} from "@/lib/content/dive-sites";

const GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps/d/embed?mid=1McszZgxcej74QUEkhM8PcngGD-eVTn4&ehbc=2E312F";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return buildMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/map",
    locale,
  });
}

function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

type MapT = (key: string, values?: Record<string, string | number>) => string;

function SiteCard({
  site,
  tMap,
  tTypes,
}: {
  site: DiveSiteItem;
  tMap: MapT;
  tTypes: (key: string) => string;
}) {
  const url = site.googleMapsUrl;
  const coords =
    site.coordinates &&
    formatCoords(site.coordinates.lat, site.coordinates.lng);
  const typeLabel = site.type ? tTypes(site.type) : "";
  const dives = typeof site.dives === "number" ? site.dives : 0;

  return (
    <li>
      <div className="rounded-xl border border-neutral-200 bg-white/60 p-3.5 shadow-sm transition-colors hover:bg-white dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/55">
        <div className="min-w-0">
          {url ? (
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-[15px] font-semibold text-neutral-900 underline decoration-neutral-200 underline-offset-4 hover:decoration-neutral-400 dark:text-neutral-100 dark:decoration-neutral-700 dark:hover:decoration-neutral-500"
              title={tMap("openInMaps")}
            >
              {site.name}
            </Link>
          ) : (
            <div className="truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
              {site.name}
            </div>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            {typeLabel ? (
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 dark:border-neutral-800 dark:bg-neutral-900/50">
                {typeLabel}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 dark:border-neutral-800 dark:bg-neutral-900/50">
                {tMap("diveSite")}
              </span>
            )}

            {dives > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 dark:border-neutral-800 dark:bg-neutral-900/50">
                <span className="font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">
                  {dives}
                </span>
                <span>{tMap("diveCount", { count: dives })}</span>
              </span>
            )}
          </div>

          {coords && (
            <div className="mt-2 text-[12px] text-neutral-500 dark:text-neutral-500">
              <span className="mr-1.5">{tMap("coordinates")}</span>
              <span className="tabular-nums">{coords}</span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMap = await getTranslations("map");
  const tTypes = await getTranslations("diveSiteTypes");

  const regions = getDiveSites();
  const { totalDives, localsVisited } = getDiveStats();
  const totalRegions = regions.length;
  const totalCountries = getDiveSitesGroupedByCountry().length;
  const totalSites = localsVisited;

  const siteKey = (site: DiveSiteItem, regionLabel: string) => {
    const coords =
      site.coordinates &&
      `${site.coordinates.lat.toFixed(6)}_${site.coordinates.lng.toFixed(6)}`;
    return `${regionLabel}__${site.name}__${coords ?? "no-coords"}`;
  };

  return (
    <main className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h1 className="mb-6 text-center text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          {tMap("title")}
        </h1>

        {totalRegions > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400">
              {tMap("totalDives")}{" "}
              <span className="font-medium">{totalDives}</span>
            </span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400">
              {tMap("uniqueSites")}{" "}
              <span className="font-medium">{totalSites}</span>
            </span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400">
              {tMap("countriesVisited")}{" "}
              <span className="font-medium">{totalCountries}</span>
            </span>
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400">
              {tMap("regionsVisited")}{" "}
              <span className="font-medium">{totalRegions}</span>
            </span>
          </div>
        )}
      </header>

      <section
        className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
        aria-label={tMap("interactiveMap")}
      >
        <iframe
          src={GOOGLE_MAP_EMBED_URL}
          title={tMap("mapIframeTitle")}
          className="h-[460px] w-full border-0 sm:h-[620px]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section id="list" className="mt-10" aria-label={tMap("diveSitesList")}>
        {regions.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            {tMap("noData")}
          </p>
        ) : (
          <ul className="space-y-6">
            {regions.map(({ region, sites }) => {
              const regionLabel =
                locale === "en" ? (region.en ?? region.ru) : region.ru;
              return (
                <li
                  key={region.ru}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900/40"
                >
                  <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {regionLabel}
                    </h2>

                    {region.links && region.links.length > 0 && (
                      <>
                        <span className="text-neutral-400 dark:text-neutral-500">
                          |
                        </span>
                        <span className="inline-flex flex-wrap items-baseline gap-x-1.5 text-neutral-500 dark:text-neutral-400">
                          {region.links.map((href) => (
                            <Link
                              key={href}
                              href={href}
                              className="inline-flex items-baseline gap-1 text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-800 hover:decoration-neutral-500 dark:text-neutral-400 dark:decoration-neutral-600 dark:hover:text-neutral-200 dark:hover:decoration-neutral-400"
                              title={href.replace("/blog/", "")}
                              aria-label={`${tMap("openNote")}: ${href
                                .replace("/blog/", "")
                                .replace(/-/g, " ")}`}
                            >
                              <span aria-hidden>🔗</span>
                              <span className="sr-only">
                                {tMap("openNote")}
                              </span>
                            </Link>
                          ))}
                        </span>
                      </>
                    )}
                  </div>

                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {sites.map((site) => (
                      <SiteCard
                        key={siteKey(site, region.ru)}
                        site={site}
                        tMap={tMap}
                        tTypes={tTypes}
                      />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
