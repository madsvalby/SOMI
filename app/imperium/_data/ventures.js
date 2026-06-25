// ─────────────────────────────────────────────────────────────────────────────
// IMPERIUM — delt venture-datamodel (single source of truth for hub + nav + cross-links).
// Slugs er identiske med /public/imperium/<slug>/ og dashboardets ImperiumTab → nul lead-data-migration.
// VIGTIGT: `source` er den værdi der POSTes til foundry-order. To ventures afviger bevidst fra slug:
//   adforge → "ugc",  beacon → "geo"  (leads er allerede tagget sådan — må IKKE ændres).
// `accent` matcher dashboardets PRODUCTS-accentfarver. `glow` = blød rgba til hero-skær.
// ─────────────────────────────────────────────────────────────────────────────

export const LEAD_ENDPOINT =
  "https://ihmgmpuptlmxokdmdirm.supabase.co/functions/v1/foundry-order";

export const VENTURES = [
  {
    slug: "faceless",
    rank: 1,
    name: "Faceless Foundry",
    source: "faceless",
    accent: "#C9A14E",
    glow: "rgba(201,161,78,0.18)",
    flagship: true,
    eyebrow: "Privacy-first · self-hosted · cloned-voice narration",
    oneLine: "A complete automated documentary studio for your channel.",
    tagline: "AI content that posts itself.",
    price: "From €499/mo",
    category: "Faceless YouTube at scale",
  },
  {
    slug: "listingreel",
    rank: 2,
    name: "ListingReel",
    source: "listingreel",
    accent: "#1F9E8F",
    glow: "rgba(31,158,143,0.18)",
    eyebrow: "Photos in · narrated branded video out · auto-posted",
    oneLine: "Turn every property listing into a branded walkthrough video.",
    tagline: "Every listing becomes a video. Automatically.",
    price: "From $49/mo",
    category: "Real-estate listing video",
  },
  {
    slug: "adforge",
    rank: 3,
    name: "AdForge",
    source: "ugc",
    accent: "#E0794E",
    glow: "rgba(224,121,78,0.18)",
    eyebrow: "Unlimited variants · flat monthly · platform-compliant",
    oneLine: "Unlimited AI UGC video ads for one flat monthly price.",
    tagline: "Out-produce the fatigue.",
    price: "From €499/mo",
    category: "AI UGC ad-creative",
  },
  {
    slug: "automation",
    rank: 4,
    name: "Northgate Automation",
    source: "automation",
    accent: "#3B6FB0",
    glow: "rgba(59,111,176,0.20)",
    eyebrow: "Self-hosted · your data never leaves your servers",
    oneLine: "AI automations that run on your own infrastructure.",
    tagline: "Stop doing work a robot should do.",
    price: "Setup from €3,000",
    category: "Privacy-first AI automation",
  },
  {
    slug: "beacon",
    rank: 5,
    name: "Beacon",
    source: "geo",
    accent: "#7C5CCB",
    glow: "rgba(124,92,203,0.20)",
    eyebrow: "ChatGPT · Gemini · Perplexity · Google AI Overviews",
    oneLine: "Track — and grow — how often AI engines cite your brand.",
    tagline: "Your customers ask AI. Does it name you?",
    price: "From $199/mo",
    category: "AI-search visibility (GEO)",
  },
  {
    slug: "ringback",
    rank: 6,
    name: "Ringback AI",
    source: "voice",
    accent: "#3FA66A",
    glow: "rgba(63,166,106,0.18)",
    eyebrow: "Answers 24/7 · books jobs · captures every lead",
    oneLine: "An AI receptionist that answers every call and books the job.",
    tagline: "Never miss another customer call.",
    price: "From €399/mo",
    category: "AI receptionist for service businesses",
  },
];

export const bySlug = (slug) => VENTURES.find((v) => v.slug === slug);
