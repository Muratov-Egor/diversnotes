export function formatDate(iso: string, locale: string = "ru"): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const loc = locale === "en" ? "en-US" : "ru-RU";
    return d.toLocaleDateString(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
