import { VENTURES } from "../_data/ventures";

// JSON-LD for hub-siden (/imperium): Organization + ItemList over de 6 ventures.
// Spejler VentureJsonLd-mønstret (samme BASE, samme @id på Organization → én konsistent
// entitet på tværs af hub + sub-sider). ItemList giver Google/AI-engines portefølje-
// strukturen direkte. On-brand for Beacon (GEO/AI-search-visibility).
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app").replace(/\/$/, "");

export default function HubJsonLd() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${BASE}/imperium#org`,
      name: "Paper Empires",
      url: `${BASE}/imperium`,
    },
    {
      "@type": "ItemList",
      name: "The Paper Empires Group — ventures",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: VENTURES.length,
      itemListElement: VENTURES.map((v) => ({
        "@type": "ListItem",
        position: v.rank,
        name: v.name,
        description: v.oneLine,
        url: `${BASE}/imperium/${v.slug}`,
      })),
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
