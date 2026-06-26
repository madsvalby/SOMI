import { VENTURES } from "./imperium/_data/ventures";

// XML-sitemap for de offentlige imperium-ruter (hub + 6 ventures + privacy).
// Dashboardet er auth-gated og bevidst udeladt. metadataBase håndteres af Next;
// vi bruger absolutte URLs så crawlere (Google + GPTBot/ClaudeBot/PerplexityBot) finder alt.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app").replace(/\/$/, "");

export default function sitemap() {
  const now = new Date().toISOString();
  const routes = [
    { url: `${BASE}/imperium`, priority: 1.0 },
    ...VENTURES.map((v) => ({ url: `${BASE}/imperium/${v.slug}`, priority: 0.8 })),
    { url: `${BASE}/imperium/privacy`, priority: 0.3 },
  ];
  return routes.map((r) => ({
    url: r.url,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
