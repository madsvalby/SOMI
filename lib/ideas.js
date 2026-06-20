// ─────────────────────────────────────────────────────────────
// Idé-loop helpers — delt mellem klient (InsightsPanel), /api/ideas og
// /api/cron/ideas. Holder prompt, robust JSON-parse, dedup og række-mapping
// ét sted, så auto-loop'en og den manuelle "Gem i kø" opfører sig identisk.
//
// Datamodel: ideas-tabellen (delt med n8n) = {id, case_id, title, hook, source,
// status, priority}. Winner-loop-forslag skrives med source='winner-loop' og
// status='proposed' — de auto-produceres IKKE; Mads godkender dem.
// ─────────────────────────────────────────────────────────────

export const WINNER_SOURCE = "winner-loop";
export const PROPOSED_STATUS = "proposed";

// Normaliser en titel til dedup (case/whitespace/tegn-uafhængig).
export function normTitle(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9æøå]+/gi, " ")
    .trim();
}

// Slug → case_id. SAMME logik som TREND's "Parse forslag" + SYNC's "Map ideas",
// så app, n8n og Supabase deler nøgle (Supabase ideas.id = case_id). Kritisk:
// uden fælles nøgle ville én idé blive til to rækker (app-skrevet + sync-skrevet).
export function slugifyCaseId(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

// Prompt til winner-baserede idéer. Samme ordlyd bruges af UI'et og cron'en.
export function buildWinnerPrompt({ titles = [], themes = [] } = {}) {
  const t = titles.filter(Boolean).join(", ") || "n/a";
  const th = themes.filter(Boolean).join(", ") || "n/a";
  return `You optimize a YouTube documentary channel about financial crime and corporate collapse.
These are the channel's BEST performing videos by views: ${t}.
Recurring themes in the winners: ${th}.
Suggest 5 NEW, real, well-documented cases that match what is already winning (same energy, audience and themes) and would make gripping 15-minute documentaries. For each give a short title and a one-line hook (max 12 words) plus a 1-line "why" tying it to the winning pattern. Return ONLY a JSON array, no markdown, shaped exactly like: [{"name":"...","hook":"...","why":"..."}]`;
}

// Robust udtræk af et JSON-array fra en Claude-tekstrespons (tåler ```-fences).
export function parseIdeasFromText(text) {
  let s = String(text || "").replace(/```json/g, "").replace(/```/g, "").trim();
  const a = s.indexOf("["), b = s.lastIndexOf("]");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  try {
    const arr = JSON.parse(s);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && (x.name || x.title))
      .map((x) => ({
        name: String(x.name || x.title).trim(),
        hook: x.hook ? String(x.hook).trim() : "",
        why: x.why ? String(x.why).trim() : "",
      }))
      .slice(0, 8);
  } catch (e) {
    return [];
  }
}

// Træk tekst ud af et Anthropic /v1/messages-svar.
export function anthropicText(data) {
  return ((data && data.content) || [])
    .filter((b) => b && b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

// Map et rå idé-objekt {name,hook,why} → en ideas-tabel-række.
// id = case_id = slug (fælles nøgle med n8n/SYNC). priority falder med rækkefølgen,
// så de bedste forslag ligger øverst; "why" bevares i hook-feltet.
export function toIdeaRow(raw, { source = WINNER_SOURCE, index = 0, basePriority = 50 } = {}) {
  const title = String((raw && (raw.name || raw.title)) || "").trim();
  if (!title) return null;
  const caseId = slugifyCaseId(raw.case_id || title);
  if (!caseId) return null;
  const hookParts = [];
  if (raw.hook) hookParts.push(String(raw.hook).trim());
  if (raw.why) hookParts.push("▸ " + String(raw.why).trim());
  return {
    id: caseId,
    case_id: caseId,
    title: title.slice(0, 120),
    hook: hookParts.join("  ").slice(0, 500) || null,
    source,
    status: PROPOSED_STATUS,
    priority: Math.max(1, basePriority - index),
  };
}

// Byg dedup'ede rækker fra rå idéer. Dedup på case_id-slug (samme nøgle som
// resten af systemet) mod eksisterende titler/case_ids. Returnerer {rows, skipped}.
export function buildIdeaRows(rawIdeas, existingTitles = [], opts = {}) {
  const seen = new Set();
  (existingTitles || []).forEach((t) => { seen.add(slugifyCaseId(t)); });
  const rows = [];
  let skipped = 0;
  (rawIdeas || []).forEach((raw, i) => {
    const row = toIdeaRow(raw, { ...opts, index: i });
    if (!row) return;
    if (seen.has(row.case_id)) { skipped++; return; }
    seen.add(row.case_id);
    rows.push(row);
  });
  return { rows, skipped };
}

// Form til n8n IDEAS INTAKE-webhook (de 6 Data Table-kolonner; intet id — n8n
// styrer selv række-id, og intaken tvinger status='proposed').
export function toN8nIdea(row) {
  return {
    case_id: row.case_id,
    title: row.title,
    hook: row.hook || "",
    source: row.source || WINNER_SOURCE,
    status: PROPOSED_STATUS,
    priority: row.priority == null ? 50 : row.priority,
  };
}

// Push forslag til n8n's produktions-kø via intake-webhook (hvis konfigureret).
// Graceful degrade: uden URL gøres intet — Supabase-skrivningen står alene, og
// dashboardet viser stadig forslagene. Kaster aldrig; returnerer en status.
export async function pushToN8n(rows) {
  const url = process.env.N8N_IDEAS_WEBHOOK_URL;
  if (!url) return { configured: false, ok: false };
  if (!rows || !rows.length) return { configured: true, ok: true, sent: 0 };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideas: rows.map(toN8nIdea) }),
    });
    return { configured: true, ok: res.ok, status: res.status, sent: rows.length };
  } catch (e) {
    return { configured: true, ok: false, error: String((e && e.message) || e) };
  }
}
