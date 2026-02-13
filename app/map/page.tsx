import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Карта погружений",
  description: "Карта дайв-сайтов и мест погружений.",
  path: "/map",
});

export default function MapPage() {
  return (
    <main className="p-4">
      <h1>Карта погружений</h1>
      <p>Карта — скоро.</p>
    </main>
  );
}
