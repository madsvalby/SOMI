import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Ugentlig SOMI Edge-rapport via Managed Agents — to-faset (appens cron har kort
// timeout, agenten kører ~5 min):
//   Fase A: søndag (hvis ingen rapport sidste 6 dage) → opret session + send
//           kickoff m. friske kanaltal → gem 'pending'-række m. session_id.
//   Fase B: hver kørsel → er en pending-session idle? → hent rapport, gem 'done',
//           email den, arkivér session.
// Bruger appens ANTHROPIC_API_KEY + service_role + n8n email-webhook. Ingen nye creds.

const AGENT = "agent_01BvwdJ93BaQ6yrdpPinx8VC";
const ENVIRONMENT = "env_01PgejCzVCd2wpj8aeRGuh24";
const EMAIL_HOOK = process.env.N8N_REPORT_WEBHOOK_URL || "https://madsvalby.app.n8n.cloud/webhook/somi-rapport-email";

function aHeaders(key) {
  return { "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-beta": "managed-agents-2026-04-01", "content-type": "application/json" };
}
async function aGet(url, key) {
  const r = await fetch(url, { headers: aHeaders(key), cache: "no-store" });
  return r.ok ? r.json() : null;
}
function extractReport(events) {
  const msgs = ((events && events.data) || []).filter((e) => e.type === "agent.message");
  let best = "";
  for (const m of msgs) {
    const t = (m.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    if (t.length > best.length) best = t;
  }
  const h = best.indexOf("#");
  return h > 0 ? best.slice(h) : best;
}
function deriveTitle(md) {
  const line = (String(md).split("\n").find((l) => /^#\s/.test(l)) || "SOMI Edge").replace(/^#\s/, "");
  const clean = line.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").replace(/\s+/g, " ").trim();
  return (clean.length > 3 ? clean : "SOMI Edge").slice(0, 120);
}

async function buildSnapshot(admin) {
  const [{ data: ch }, { data: cost }, { data: vids }] = await Promise.all([
    admin.from("channel_daily").select("date,subs,views,cost_usd").order("date", { ascending: true }),
    admin.from("costlog").select("usd_cost,model,ts").gte("ts", new Date().toISOString().slice(0, 8) + "01"),
    admin.from("videos").select("status"),
  ]);
  const latest = (ch || []).filter((r) => r.subs != null).slice(-1)[0];
  const recentCost = (ch || []).slice(-6).map((r) => `${String(r.date).slice(8)}/${String(r.date).slice(5, 7)} $${Number(r.cost_usd || 0).toFixed(1)}`).join(" · ");
  let spend = 0; const byP = {};
  (cost || []).forEach((c) => {
    const u = Number(c.usd_cost) || 0; spend += u;
    const m = String(c.model || "").toLowerCase();
    const p = (m.includes("claude") || m.includes("sonnet") || m.includes("opus")) ? "Anthropic" : (m.includes("gemini") || m.includes("nano")) ? "Gemini" : m.includes("render") ? "Render" : "Andet";
    byP[p] = (byP[p] || 0) + u;
  });
  const prov = Object.entries(byP).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} $${v.toFixed(2)}`).join(", ");
  const st = {}; (vids || []).forEach((v) => { st[v.status] = (st[v.status] || 0) + 1; });
  const stStr = Object.entries(st).map(([k, v]) => `${v} ${k}`).join(", ");
  const published = st["published"] || 0;
  return [
    "DATA-SNAPSHOT FOR PAPER EMPIRES (" + new Date().toISOString().slice(0, 10) + "):",
    `- Offentlige kanaltal: ${latest ? latest.subs : "?"} abonnenter, ${latest ? latest.views : "?"} visninger.`,
    `- Produktions-status: ${stStr}. ${published === 0 ? "Endnu ingen offentligt publicerede videoer med views." : ""}`,
    `- Forbrug denne maaned: $${spend.toFixed(2)}. Pr. leverandoer: ${prov}.`,
    `- Daglig omkostning seneste dage: ${recentCost}.`,
    published === 0 ? "- Analytics (watch-time/RPM/indtjening) findes ikke endnu, da videoerne stadig er private/scheduled." : "",
  ].filter(Boolean).join("\n");
}

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ ok: true, reason: "ANTHROPIC_API_KEY eller service_role mangler" });
  }
  const admin = createAdminClient();
  const out = { ingested: 0, started: false };

  // Fase B — ingest pending sessions der er blevet idle
  const { data: pendings } = await admin.from("reports").select("id,session_id").eq("status", "pending");
  for (const p of pendings || []) {
    if (!p.session_id) continue;
    const s = await aGet(`https://api.anthropic.com/v1/sessions/${p.session_id}`, key);
    if (s && s.status === "idle") {
      const ev = await aGet(`https://api.anthropic.com/v1/sessions/${p.session_id}/events?limit=1000`, key);
      const report = extractReport(ev);
      if (report && report.length > 400) {
        const title = deriveTitle(report);
        await admin.from("reports").update({ body_md: report, title, status: "done" }).eq("id", p.id);
        out.ingested++;
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app";
        const reportUrl = `${siteUrl}/rapport/${p.id}`;
        const emailText = `Din ugentlige SOMI Edge-rapport er klar.\n\nLæs den med grafer og layout her:\n${reportUrl}\n\n———\n\n${report}`;
        try { await fetch(EMAIL_HOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ subject: title, text: emailText }) }); } catch (e) { /* email best-effort */ }
        try { await fetch(`https://api.anthropic.com/v1/sessions/${p.session_id}/archive`, { method: "POST", headers: aHeaders(key) }); } catch (e) { /* */ }
      }
    }
  }

  // Fase A — søndag: start en ny rapport hvis ingen er lavet de seneste 6 dage
  if (new Date().getUTCDay() === 0) {
    const weekAgo = new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString();
    const { data: recent } = await admin.from("reports").select("id").gte("created_at", weekAgo).limit(1);
    if (!recent || !recent.length) {
      const snapshot = await buildSnapshot(admin);
      const kickoff = "Skriv denne uges SOMI Edge-rapport paa dansk. Research nichen live og analyser vores tal.\n\n" + snapshot + "\n\nSkriv hele rapporten som din sidste besked.";
      const sess = await fetch("https://api.anthropic.com/v1/sessions", { method: "POST", headers: aHeaders(key), body: JSON.stringify({ agent: { type: "agent", id: AGENT }, environment_id: ENVIRONMENT, title: "SOMI Edge ugentlig" }) }).then((r) => r.json()).catch(() => null);
      if (sess && sess.id) {
        await fetch(`https://api.anthropic.com/v1/sessions/${sess.id}/events`, { method: "POST", headers: aHeaders(key), body: JSON.stringify({ events: [{ type: "user.message", content: [{ type: "text", text: kickoff }] }] }) });
        await admin.from("reports").insert({ kind: "somi_edge", title: "SOMI Edge — genereres…", status: "pending", session_id: sess.id });
        out.started = true;
      }
    }
  }

  return NextResponse.json({ ok: true, ...out });
}
