import fs from "node:fs";
import path from "node:path";

const DIVE_SITES_PATH = path.join(process.cwd(), "content/dive-sites.json");

export type DiveSiteType =
  | "reef"
  | "bay"
  | "wreck"
  | "pinnacle"
  | "coral_garden"
  | "lake"
  | "river"
  | "wall"
  | "default";

export interface DiveSiteItem {
  name: string;
  type?: DiveSiteType;
  coordinates?: { lat: number; lng: number };
  googleMapsUrl?: string;
  /** Количество погружений на этом дайв-сайте */
  dives?: number;
}

export interface DiveSiteRegion {
  region: {
    ru: string;
    en: string;
    links?: string[];
  };
  sites: DiveSiteItem[];
}

/** Список дайв-сайтов по регионам. Сейчас читается из content/dive-sites.json; при переходе на API достаточно заменить тело функции на fetch. Сайты внутри региона отсортированы по количеству погружений (по убыванию). */
export function getDiveSites(): DiveSiteRegion[] {
  if (!fs.existsSync(DIVE_SITES_PATH)) return [];
  const raw = fs.readFileSync(DIVE_SITES_PATH, "utf-8");
  const data = JSON.parse(raw) as DiveSiteRegion[];
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    ...item,
    sites: [...item.sites].sort(
      (a, b) => (b.dives ?? 0) - (a.dives ?? 0)
    ),
  }));
}

export function getDiveStats(): { localsVisited: number; totalDives: number } {
  const regions = getDiveSites();
  const localsVisited = regions.reduce((acc, r) => acc + r.sites.length, 0);
  const totalDives = regions.reduce(
    (acc, r) =>
      acc + r.sites.reduce((sum, s) => sum + (s.dives ?? 0), 0),
    0
  );
  return { localsVisited, totalDives };
}

/** Подписи типов дайв-сайтов на русском */
export const SITE_TYPE_LABELS_RU: Record<DiveSiteType, string> = {
  reef: "риф",
  bay: "бухта",
  wreck: "затонувший корабль",
  pinnacle: "пиннакл",
  coral_garden: "коралловый сад",
  lake: "озеро",
  river: "река",
  wall: "стенка",
  default: "прочее",
};

/** Из названия региона «Рача Яй, Таиланд 🇹🇭» извлекается «Таиланд 🇹🇭» */
function getCountryFromRegion(regionRu: string): string {
  const lastComma = regionRu.lastIndexOf(",");
  return lastComma === -1 ? regionRu : regionRu.slice(lastComma + 1).trim();
}

export interface DiveSitesByCountry {
  country: string;
  regions: DiveSiteRegion[];
}

/** Список дайв-сайтов, сгруппированный по странам (для вывода на странице карты). */
export function getDiveSitesGroupedByCountry(): DiveSitesByCountry[] {
  const regions = getDiveSites();
  const byCountry = new Map<string, DiveSiteRegion[]>();
  for (const region of regions) {
    const country = getCountryFromRegion(region.region.ru);
    const list = byCountry.get(country) ?? [];
    list.push(region);
    byCountry.set(country, list);
  }
  return Array.from(byCountry.entries())
    .map(([country, regionsList]) => ({
      country,
      regions: regionsList,
    }))
    .sort((a, b) => a.country.localeCompare(b.country, "ru"));
}
