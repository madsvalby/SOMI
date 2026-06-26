"use client";
import React from "react";
import { Rocket, Wallet, Gauge, AlertTriangle, ArrowRight, FlaskConical } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// LABS / AI BUSINESSES — porteføljen af nye AI-virksomheds-kandidater.
// Researchet + adversarielt pressure-testet 2026-06-26 (18-agent CTO-recon).
// VIGTIGT: status afspejler PRESSURE-TEST-virkeligheden, ikke optimisme — ingen
// er bygget; revenue-tal er nedjusteret til realistiske intervaller; tomme
// liveUrl/repoUrl/n8n = findes ikke endnu (hardkod ikke falske links).
// v2 (TODO): gør felterne redigerbare via KV (K_LABS gennem /api/state), flettet
// over denne konstant — samme dynamisk-over-statisk mønster som credits i Command.jsx.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_TONE = {
  "idé": "#9AA6B2",
  "spike": "#E6C877",
  "frarådet": "#E0795E",
};
const statusTone = (s) => {
  const k = Object.keys(STATUS_TONE).find((t) => s.toLowerCase().startsWith(t));
  return STATUS_TONE[k] || "#9AA6B2";
};

const BUSINESSES = [
  {
    name: "AuditReel",
    priority: 1,
    status: "idé — byg POC først",
    desc: "White-label motor: website-audit → kort narreret video-rapport i klonet stemme, til bureau cold-outreach (produktet er sin egen demo).",
    niche: "B2B sales-enablement / agency video-prospektering",
    audience: "SEO/CRO/web-bureauer, freelance-konsulenter, SDR-teams",
    monetization: "SaaS pr. sæde + video-credits (Stripe) · $39/$79/$99/mo + $20 white-label",
    revenue: "$0 — realistisk 3-6 mdr: 5-12 sæder ≈ $300-700/mo MRR (pressure-test nedjusteret fra $825-1650)",
    traffic: "0",
    leads: "0",
    automation: 0,
    nextAction: "POC: single-URL audit (PageSpeed API + screenshot + Claude-manus) som GRATIS lead-magnet for Faceless/ListingReel. Validér reply-løft FØR billing/multi-tenant.",
    risk: "Kerne-VP uvalideret (audit-video > ansigts-video ubevist); render-VPS har INGEN headless browser; EU §10 + GDPR databehandler-ansvar; 'foundry_orders som job-kø' er falsk.",
    verdict: "GO-MED-ÆNDRINGER · MVP ~21 dage",
    updated: "2026-06-26",
  },
  {
    name: "NordicAudio",
    priority: 2,
    status: "spike — TTS-kvalitet ubekræftet",
    desc: "RSS-pipeline + embed-player: hver artikel → menneskelig dansk/nordisk lydversion i brand-stemme (WCAG-tilgængelighed).",
    niche: "B2B audio-narration for nordiske udgivere/offentlige org'er",
    audience: "Danske/nordiske medier, B2B-blogs, kommuner/NGO'er",
    monetization: "Abonnement pr. site (Stripe) · €19/€49/€99/mo + €99 stemme-setup",
    revenue: "$0 — realistisk 3-6 mdr: €150-500/mo recurring (offentlig salgscyklus 3-9 mdr; nedjusteret fra €525-1400)",
    traffic: "0",
    leads: "0",
    automation: 0,
    nextAction: "GATE: 3-dages dansk-TTS spike — installer chatterbox-multilingual, klon 1 stemme, QC 5 danske artikler, blindtest vs ElevenLabs. Bestå før noget bygges.",
    risk: "Dansk cloned-TTS findes IKKE på stacken i dag (kun engelsk base); VPS CPU-only + mættet (load 4.4/8); produktion betaler STADIG ElevenLabs $1.79/voiceover; 'WCAG kræver lydversion' er faktuelt forkert salgs-claim.",
    verdict: "GO-MED-ÆNDRINGER (gated på spike) · MVP ~25 dage",
    updated: "2026-06-26",
  },
  {
    name: "TradeQuote",
    priority: 3,
    status: "frarådet — PARKÉR",
    desc: "Programmatisk håndværker-pris-estimator pr. trade×by med forklarings-video + '3 gratis tilbud'-form; leads videresælges til lokale håndværkere.",
    niche: "Prog-SEO lead-gen for home-improvement/trades (UK/US)",
    audience: "Lead-købere: lokale håndværkere. Trafik: husejere der googler 'cost of X'.",
    monetization: "Lead-resale + AdSense · GBP 40-80/lead (men gratis-form-leads reelt GBP 10-30)",
    revenue: "$0 — realistisk år 1: GBP 0-400/mo gennemsnit (nedjusteret fra GBP 1.2-4k)",
    traffic: "0",
    leads: "0",
    automation: 0,
    nextAction: "PARKÉR. Moat (video/side) skalerer ikke på CPU-VPS (~80 min/video, delt med Paper Empires); foundry_orders-genbrug + 85%-automation faktuelt forkert; GDPR/PECR + ICO-reg mangler by design.",
    risk: "Dødsstød: video-på-hver-side sulter Paper Empires-pipelinen; nyt domæne rangerer ikke på 'cost of X' år 1; chicken-and-egg (sælg til håndværkere FØR trafik findes).",
    verdict: "DROP",
    updated: "2026-06-26",
  },
];

function Field({ label, children }) {
  return (
    <div className="lab-field">
      <div className="lab-field-l">{label}</div>
      <div className="lab-field-v">{children}</div>
    </div>
  );
}

export default function LabsTab() {
  return (
    <div className="lab-wrap">
      <div className="lab-head">
        <div className="lab-head-title">
          <FlaskConical size={18} strokeWidth={2} style={{ color: "var(--gold, #C9A14E)" }} />
          <h2>Labs · AI Businesses</h2>
        </div>
        <p className="lab-head-sub">
          3 nye AI-virksomheds-kandidater — researchet + adversarielt pressure-testet (18-agent CTO-recon, 26/6).
          Status er ærlig: <b>ingen er bygget endnu</b>, og revenue-tal er nedjusteret til realistiske intervaller.
        </p>
      </div>

      <div className="lab-note">
        <AlertTriangle size={14} strokeWidth={2} style={{ color: "var(--rust, #E0795E)", flexShrink: 0, marginTop: 2 }} />
        <span>
          <b>Rod-blokering før skalering:</b> render-VPS'en er CPU-only, mættet (load 4.4/8, ~80 min TTS/video) og deler kapacitet med Paper Empires.
          Byg ikke multi-tenant SaaS før kapacitet (GPU/dedikeret) + dansk-TTS-kvalitet er afklaret. Næste reelle skridt = AuditReel-POC som lead-magnet.
        </span>
      </div>

      <div className="lab-grid">
        {BUSINESSES.map((b) => (
          <div key={b.name} className="lab-card">
            <div className="lab-card-top">
              <span className="lab-rank">#{b.priority}</span>
              <span className="lab-name">{b.name}</span>
              <span className="lab-status" style={{ color: statusTone(b.status), borderColor: statusTone(b.status) }}>
                {b.status}
              </span>
            </div>
            <p className="lab-desc">{b.desc}</p>

            <div className="lab-meta">
              <Field label="Niche">{b.niche}</Field>
              <Field label="Målgruppe">{b.audience}</Field>
              <Field label="Monetization"><span className="lab-mono"><Wallet size={11} strokeWidth={2} /> {b.monetization}</span></Field>
              <Field label="Revenue (realistisk)">{b.revenue}</Field>
            </div>

            <div className="lab-stats">
              <div className="lab-stat"><span className="lab-stat-v">{b.traffic}</span><span className="lab-stat-l">trafik</span></div>
              <div className="lab-stat"><span className="lab-stat-v">{b.leads}</span><span className="lab-stat-l">leads</span></div>
              <div className="lab-stat lab-stat--auto">
                <div className="lab-auto-head"><Gauge size={11} strokeWidth={2} /> automation <b>{b.automation}%</b></div>
                <div className="lab-auto-track"><div className="lab-auto-fill" style={{ width: b.automation + "%" }} /></div>
              </div>
            </div>

            <div className="lab-next">
              <ArrowRight size={13} strokeWidth={2.4} style={{ color: "var(--gold, #C9A14E)", flexShrink: 0, marginTop: 2 }} />
              <span><b>Næste:</b> {b.nextAction}</span>
            </div>

            <div className="lab-risk"><b>Risiko:</b> {b.risk}</div>

            <div className="lab-foot">
              <span className="lab-verdict">{b.verdict}</span>
              <span className="lab-updated">opdateret {b.updated}</span>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .lab-wrap { display:flex; flex-direction:column; gap:18px; }
        .lab-head-title { display:flex; align-items:center; gap:9px; }
        .lab-head-title h2 { font-family:var(--serif,'Fraunces',serif); font-size:22px; font-weight:600; margin:0; color:var(--bone,#F2F2EA); }
        .lab-head-sub { color:var(--bone-dim,#9AA6B2); font-size:13.5px; line-height:1.6; margin:8px 0 0; max-width:760px; }
        .lab-head-sub b { color:var(--bone,#F2F2EA); }
        .lab-note { display:flex; gap:10px; align-items:flex-start; background:rgba(224,121,94,0.07); border:1px solid color-mix(in srgb, var(--rust,#E0795E) 35%, var(--line,#1E2730)); border-radius:12px; padding:13px 15px; font-size:13px; line-height:1.55; color:var(--bone-dim,#9AA6B2); }
        .lab-note b { color:var(--bone,#F2F2EA); }
        .lab-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(330px, 1fr)); gap:16px; }
        .lab-card { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:13px; }
        .lab-card-top { display:flex; align-items:center; gap:9px; }
        .lab-rank { font-family:var(--mono,monospace); font-size:11px; font-weight:700; color:var(--ink,#0B0F14); background:var(--gold,#C9A14E); border-radius:6px; padding:2px 7px; }
        .lab-name { font-family:var(--serif,'Fraunces',serif); font-size:18px; font-weight:600; color:var(--bone,#F2F2EA); flex:1; }
        .lab-status { font-family:var(--mono,monospace); font-size:10.5px; letter-spacing:0.03em; text-transform:uppercase; border:1px solid; border-radius:999px; padding:3px 9px; white-space:nowrap; }
        .lab-desc { color:var(--bone-dim,#9AA6B2); font-size:13.5px; line-height:1.55; margin:0; }
        .lab-meta { display:grid; grid-template-columns:1fr 1fr; gap:11px; border-top:1px solid var(--line-soft,#172029); padding-top:13px; }
        .lab-field-l { font-family:var(--mono,monospace); font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--faint,#8A95A1); margin-bottom:3px; }
        .lab-field-v { font-size:12.5px; line-height:1.45; color:var(--bone,#F2F2EA); }
        .lab-mono { display:inline-flex; align-items:flex-start; gap:5px; }
        .lab-stats { display:flex; align-items:center; gap:18px; background:var(--panel-2,#0E141B); border-radius:10px; padding:11px 14px; }
        .lab-stat { display:flex; flex-direction:column; }
        .lab-stat-v { font-family:var(--serif,'Fraunces',serif); font-size:18px; font-weight:600; color:var(--bone,#F2F2EA); line-height:1; }
        .lab-stat-l { font-size:10.5px; color:var(--faint,#8A95A1); margin-top:3px; }
        .lab-stat--auto { flex:1; }
        .lab-auto-head { font-size:11px; color:var(--bone-dim,#9AA6B2); display:flex; align-items:center; gap:5px; margin-bottom:5px; }
        .lab-auto-head b { color:var(--bone,#F2F2EA); }
        .lab-auto-track { height:5px; background:var(--line,#1E2730); border-radius:3px; overflow:hidden; }
        .lab-auto-fill { height:100%; background:var(--gold,#C9A14E); border-radius:3px; }
        .lab-next { display:flex; gap:8px; align-items:flex-start; font-size:12.5px; line-height:1.5; color:var(--bone,#F2F2EA); }
        .lab-next b { color:var(--gold,#C9A14E); }
        .lab-risk { font-size:11.5px; line-height:1.5; color:var(--faint,#8A95A1); }
        .lab-risk b { color:var(--bone-dim,#9AA6B2); }
        .lab-foot { display:flex; align-items:center; justify-content:space-between; gap:10px; border-top:1px solid var(--line-soft,#172029); padding-top:11px; }
        .lab-verdict { font-family:var(--mono,monospace); font-size:11px; color:var(--bone-dim,#9AA6B2); }
        .lab-updated { font-size:10.5px; color:var(--faint,#8A95A1); }
      `}} />
    </div>
  );
}
