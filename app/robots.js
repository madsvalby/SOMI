// robots.txt — tillad alle crawlere inkl. AI-engines (on-brand for Beacon/GEO).
// Dashboardet + API er auth-gated; vi disallow'er dem eksplicit for god ordens skyld.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app").replace(/\/$/, "");

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/", "/login"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
