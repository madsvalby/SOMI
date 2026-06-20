// ─────────────────────────────────────────────────────────────
// Agent-skills — datastruktur + integrations-lag.
//
// MOCK_SKILLS er ren data (mock indtil backend kobles på). runSkill() er det
// integrations-klare punkt: når en skill får en webhookUrl (n8n trigger),
// poster runSkill til den. Mock-data og integration holdes bevidst adskilt.
// ─────────────────────────────────────────────────────────────

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

// [agentId, kategori-label, [skill-navne...]]
const RAW = [
  ["research", "Research", [
    "Court record finder", "SEC filing finder", "Timeline extractor",
    "Key number extractor", "Source credibility checker", "Missing evidence detector",
  ]],
  ["script", "Script", [
    "Documentary outline generator", "Cold open / hook writer", "Full narration writer",
    "Retention rewrite", "Cliffhanger generator", "Pacing improver", "Intro / outro generator",
  ]],
  ["seo", "SEO", [
    "YouTube title generator", "Facebook title generator", "Description generator",
    "Tag generator", "Hashtag generator", "Pinned comment generator", "Chapter generator",
  ]],
  ["thumbnail", "Thumbnail", [
    "Thumbnail concept generator", "Image prompt generator", "Text readability checker",
    "Brand consistency checker", "CTR prediction (placeholder)", "A/B variant generator",
  ]],
  ["shorts", "Shorts / Reels", [
    "Short clip detector", "Short hook writer", "Caption generator",
    "Vertical prompt generator", "Reels description generator", "Comment CTA generator",
  ]],
  ["upload", "Publishing", [
    "Metadata validator", "Asset checker", "Schedule checker",
    "Upload readiness checker", "Duplicate title checker", "Platform compliance checker",
  ]],
  ["analytics", "Analytics", [
    "Performance analyzer", "Winner detector", "Underperformance detector",
    "Repurpose recommendation", "Platform comparison", "Weekly report generator",
  ]],
  ["community", "Community", [
    "Pinned comment generator", "Reply suggestion generator", "High-value comment detector",
    "Negative comment detector", "Engagement opportunity finder",
  ]],
];

// En kort beskrivelse pr. skill (fald tilbage til et generisk mønster).
const DESC = {
  "Court record finder": "Finder relevante domme og retsdokumenter for sagen.",
  "SEC filing finder": "Henter SEC/tilsyns-filings knyttet til selskabet.",
  "Timeline extractor": "Bygger en kronologisk tidslinje fra kilderne.",
  "Key number extractor": "Trækker beløb, tab og nøgletal ud af materialet.",
  "Source credibility checker": "Vurderer kildernes troværdighed og dækning.",
  "Missing evidence detector": "Markerer påstande uden tilstrækkelig kilde.",
  "Cold open / hook writer": "Skriver en stærk åbning på klimaks-tallet.",
  "Full narration writer": "Genererer hele dokumentar-narrationen.",
  "Retention rewrite": "Omskriver for skarpere pacing og fastholdelse.",
  "Pinned comment generator": "Skriver kanalens egen top-kommentar til videoen.",
  "Weekly report generator": "Samler ugens signaler i én rapport.",
};

export const MOCK_SKILLS = RAW.flatMap(([agentId, category, names]) =>
  names.map((name) => ({
    id: `${agentId}.${slug(name)}`,
    agentId,
    name,
    category,
    description: DESC[name] || `${name} — kører som en del af ${category}-agenten.`,
    status: "idle",            // idle | running | ok | failed
    enabled: true,
    lastRun: null,
    successRate: null,
    connectedWorkflowId: null,
    webhookUrl: "",            // sæt en n8n-webhook her for at gøre skill'en kørbar
    config: {},
  }))
);

export function skillsForAgent(agentId, overrides = {}) {
  return MOCK_SKILLS.filter((s) => s.agentId === agentId).map((s) => ({ ...s, ...(overrides[s.id] || {}) }));
}

// ── Integrations-lag ──────────────────────────────────────────
// Trigger en skill via dens n8n-webhook. Returnerer et resultat-objekt frem for
// at kaste, så UI'et kan vise status. Ingen hemmeligheder i klienten — webhookUrl
// er en n8n production-webhook (ikke en API-nøgle).
export async function runSkill(skill, payload = {}) {
  if (!skill || !skill.webhookUrl) {
    return { ok: false, todo: true, message: "Ingen n8n-webhook koblet på endnu." };
  }
  try {
    const res = await fetch(skill.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: skill.id, agentId: skill.agentId, ...payload }),
    });
    let data = null;
    try { data = await res.json(); } catch (e) { /* tomt/ikke-JSON svar */ }
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }
}
