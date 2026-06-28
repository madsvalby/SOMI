"use client";
import React, { useState, useEffect } from "react";
import {
  ShieldCheck, UserRound, Globe, Filter, Image as ImageIcon, MessageSquare,
  FlaskConical, Coins, Activity, LayoutGrid, AlertTriangle, Save, Check,
  Plus, Trash2, Lock, ArrowRight, Milestone,
} from "lucide-react";
import { loadKey, saveKey } from "@/lib/dashboardState";

// ─────────────────────────────────────────────────────────────────────────────
// VIRTUAL CREATOR LAB — compliance-first AI virtual creator (separat brand).
// KV-backed (gemmer hele staten under "vcl_state" via /api/state — dynamisk-over-
// statisk som credits i Command.jsx). Tracking er PER PLATFORM (track-objektet):
// "Samlet" summerer på tværs, ellers vises/redigeres én platform — samme mønster
// som startsidens kanal/samlet-toggle. Rigtige virtual_creator_*-tabeller fyldes
// af n8n/scraping i Fase 2 og binder hertil senere.
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "overview", label: "Overblik", Icon: LayoutGrid },
  { id: "roadmap", label: "Roadmap", Icon: Milestone },
  { id: "persona", label: "Persona", Icon: UserRound },
  { id: "platforms", label: "Platforme", Icon: Globe },
  { id: "funnel", label: "Funnel", Icon: Filter },
  { id: "content", label: "Content", Icon: ImageIcon },
  { id: "chat", label: "Chat", Icon: MessageSquare },
  { id: "compliance", label: "Compliance", Icon: ShieldCheck },
  { id: "experiments", label: "Eksperimenter", Icon: FlaskConical },
  { id: "okonomi", label: "Økonomi", Icon: Coins },
  { id: "automation", label: "Automation", Icon: Activity },
];

// Trackbare enheder ("kanaler") for VCL = platforme. Tilføj persona-lag når #2 kommer.
const UNITS = [
  { key: "instagram", label: "Instagram" },
  { key: "fanvue", label: "Fanvue" },
  { key: "hub", label: "Hub" },
];
const ZERO_UNIT = {
  followers: 0, impressions: 0, reach: 0, profileVisits: 0, linkClicks: 0, postsPublished: 0,
  paidVisits: 0, subscribers: 0, interactions: 0,
  grossRevenue: 0, fees: 0, tips: 0, ppvChat: 0, expenses: 0,
};
const OV_KPIS = [
  ["followers", "Followers"], ["postsPublished", "Opslag publ."], ["profileVisits", "Profil-visits"],
  ["linkClicks", "Link-klik"], ["paidVisits", "Paid-visits"], ["subscribers", "Subscribers"], ["interactions", "Interaktioner"],
];
const OV_EDIT = [
  ...OV_KPIS, ["impressions", "Impressions"], ["reach", "Reach"],
  ["grossRevenue", "Gross ($)"], ["fees", "Fees ($)"], ["tips", "Tips ($)"], ["ppvChat", "PPV/chat ($)"], ["expenses", "Udgifter ($)"],
];
const FUNNEL_STEPS = [
  ["impressions", "Impressions"], ["reach", "Reach"], ["profileVisits", "Profil-visits"],
  ["linkClicks", "Link-klik"], ["paidVisits", "Paid-platform visits"], ["subscribers", "Subscribers"],
];
const ECON_EDIT = [["grossRevenue", "Gross ($)"], ["fees", "Fees ($)"], ["tips", "Tips ($)"], ["ppvChat", "PPV/chat ($)"], ["expenses", "Udgifter ($)"]];

const STATUS_OPTS = ["not_setup", "setup", "active", "paused", "incompatible"];
const RISK_OPTS = ["unknown", "low", "medium", "high", "critical"];
const RISK_TONE = { unknown: "#8A95A1", low: "#6FB07F", medium: "#E6C877", high: "#E0795E", critical: "#E0795E" };
const STATUS_TONE = { not_setup: "#8A95A1", setup: "#E6C877", active: "#6FB07F", paused: "#9AA6B2", incompatible: "#E0795E" };

const DEFAULT_VCL = {
  project: {
    name: "Sera", brand: "Sera", status: "planning", launchReadiness: 20, complianceScore: 65, riskAlerts: 0,
    nextAction: "Opret IG (SFW) + Fanvue (KYC + W-8BEN) · byg landing · sæt persona-assets (seed/reference). Policy + persona-/prompt-bible klar — se docs/virtual-creator-lab/.",
  },
  track: { instagram: { ...ZERO_UNIT }, fanvue: { ...ZERO_UNIT }, hub: { ...ZERO_UNIT } },
  persona: {
    name: "Seraphine «Sera»", ageLabel: "27 (25+)",
    disclosure: "AI-discloseret (synlig i bio + on-image watermark + C2PA)",
    visualIdentity: "defineret — persona-bible.md (seed/reference for konsistens)", brandStyle: "celestial-luxe / neon-noir", voiceTone: "varm, legende, selvsikker, gådefuld",
    forbiddenResemblance: "Ingen lighed med rigtige personer, celebs, influencers eller ekskærester. Tydeligt syntetiske kendetegn (krom-sheen/halo). Minimum 25+, ingen teen-/school-look.",
    assetLibrary: "", promptBible: "docs/virtual-creator-lab/prompt-bible.md",
    disclosureText: "AI-generated virtual creator · not a real person · 18+",
    lastUpdated: "2026-06-28",
  },
  platforms: [
    { key: "instagram", label: "Instagram", role: "SFW discovery-funnel", status: "not_setup", policyScore: 80, risk: "medium", revenue: false, automation: false, url: "", manualAction: "Opret professionel konto · bio + link-hub · synlig AI-disclosure · KUN SFW (AI-nøgenhed fjernes som ægte; suggestivt demotes i Explore/Reels).", checklist: "" },
    { key: "fanvue", label: "Fanvue", role: "Primær monetization", status: "not_setup", policyScore: 95, risk: "low", revenue: false, automation: false, url: "", manualAction: "Opret konto · KYC med dit eget foto-ID + selfie · W-8BEN · konsekvent AI-disclosure · human-approval på ALT paid/spicy i 30 dage.", checklist: "" },
    { key: "fansly", label: "Fansly", role: "Betinget — photoreal ikke tilladt", status: "incompatible", policyScore: 25, risk: "high", revenue: false, automation: false, url: "", manualAction: "Fansly forbyder photorealistisk AI → incompatible for vores persona. Kun en klart ikke-fotorealistisk variant (under dit eget verificerede ID) er en mulighed.", checklist: "" },
    { key: "landing", label: "Hub (AllMyLinks)", role: "Offentlig link-hub · 18+ · AI-disclosure", status: "active", policyScore: 90, risk: "low", revenue: false, automation: false, url: "https://allmylinks.com/seraphine-sera", manualAction: "LIVE på allmylinks.com/seraphine-sera (adskilt fra SOMI-domænet). Hold profil/baggrund SFW; bio m. AI-disclosure + 18+; sensitive-content = ON. /sera beholdt som fallback.", checklist: "" },
  ],
  content: { ideas: 0, promptQueue: 0, generated: 0, complianceReview: 0, humanApproval: 0, scheduled: 0, published: 0, remixCandidates: 0 },
  chat: { igDmStatus: "manuel", paidChatStatus: "manuel", botEnabled: false, humanApprovalRequired: true, lastReviewed: "", riskFlags: "" },
  compliance: {
    aiDisclosure: true, platformAllowed: true, sfwClassification: "SFW på Instagram · suggestivt (ikke-eksplicit) kun på paid",
    noRealPerson: true, noMinorRisk: true, noCelebrity: true, humanApproval: true,
    policySource: "verificeret 2026-06-28 — docs/virtual-creator-lab/compliance.md",
    notes: "Fansly = incompatible (photoreal). EU AI Act art. 50 fra 2026-08-02: maskinlæsbar AI-mærkning + disclosure på selve indholdet.",
  },
  automation: { n8nStatus: "ikke sat op", scrapingStatus: "ikke sat op", lastRun: "", errors: "", manualAction: "Ingen automation før Fase 2/3 — alt manuelt + human approval nu.", deployStatus: "—", logsUrl: "" },
  experiments: [],
  roadmap: [
    { phase: "Fase 0", title: "Fundament", detail: "VCL-tab + Supabase-schema (12 tabeller) + docs", status: "done" },
    { phase: "Fase A", title: "Policy-research", detail: "Fanvue/IG/EU verificeret → compliance.md + matrix", status: "done" },
    { phase: "Fase B", title: "Landing / hub", detail: "AllMyLinks live (separat brand) + /sera fallback", status: "done" },
    { phase: "Fase C", title: "Content-system", detail: "Persona-/prompt-bible + asset-pack + batch 1 + DM-svar", status: "done" },
    { phase: "Fase D", title: "Growth + launch-prep", detail: "Growth-loop + 30-dages-plan + launch-checklist", status: "done" },
    { phase: "Live", title: "Konti + funnel", detail: "IG + Fanvue + AllMyLinks live, billeder oppe, funnel verificeret", status: "done" },
    { phase: "Nu", title: "Producér + post batch 1", detail: "9 posts + 3 reels, manuel godkendelse, start kadence", status: "active" },
    { phase: "30 dage", title: "Growth-test", detail: "Hook-tests, funnel-konvertering, 0 compliance-flags", status: "pending" },
    { phase: "Gate", title: "Kill/scale (dag 30)", detail: "≥1 hook-vinder + konvertering + ≥1 sub → skalér", status: "pending" },
    { phase: "Fase 2", title: "Assisteret automation", detail: "n8n auto-metrics/captions, schedule efter approval", status: "pending" },
    { phase: "Fase 3", title: "Kontrolleret autopilot", detail: "Auto-SFW-post + remix + disclosed chatbot (human-gated)", status: "pending" },
  ],
};

// Ét-niveau dyb merge; per-unit track-felter tilgås defensivt (unitVal) så manglende felter ikke crasher.
function mergeVcl(base, saved) {
  if (!saved || typeof saved !== "object") return base;
  const out = { ...base };
  for (const k of Object.keys(base)) {
    if (Array.isArray(base[k])) out[k] = Array.isArray(saved[k]) ? saved[k] : base[k];
    else if (base[k] && typeof base[k] === "object") out[k] = { ...base[k], ...(saved[k] || {}) };
    else out[k] = saved[k] !== undefined ? saved[k] : base[k];
  }
  return out;
}

const fmt = (n) => (n || n === 0 ? Number(n).toLocaleString("da-DK") : "—");
const money = (n) => "$" + (Number(n) || 0).toLocaleString("da-DK");

function Field({ label, children, wide }) {
  return (
    <label className={`vcl-field ${wide ? "vcl-field--wide" : ""}`}>
      <span className="vcl-field-l">{label}</span>
      {children}
    </label>
  );
}
function Kpi({ value, label, tone }) {
  return (
    <div className="vcl-kpi">
      <div className="vcl-kpi-v" style={tone ? { color: tone } : undefined}>{value}</div>
      <div className="vcl-kpi-l">{label}</div>
    </div>
  );
}

export default function VirtualCreatorLab() {
  const [vcl, setVcl] = useState(DEFAULT_VCL);
  const [section, setSection] = useState("overview");
  const [scope, setScope] = useState("samlet");
  const [saved, setSaved] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    loadKey("vcl_state", null).then((v) => {
      if (alive && v) setVcl(mergeVcl(DEFAULT_VCL, v));
      if (alive) setReady(true);
    });
    return () => { alive = false; };
  }, []);

  const setField = (sec, key, val) => { setVcl((p) => ({ ...p, [sec]: { ...p[sec], [key]: val } })); setSaved(false); };
  const setPlatform = (idx, key, val) => { setVcl((p) => ({ ...p, platforms: p.platforms.map((x, i) => (i === idx ? { ...x, [key]: val } : x)) })); setSaved(false); };
  const addRow = (sec, row) => { setVcl((p) => ({ ...p, [sec]: [...p[sec], row] })); setSaved(false); };
  const setRow = (sec, idx, key, val) => { setVcl((p) => ({ ...p, [sec]: p[sec].map((x, i) => (i === idx ? { ...x, [key]: val } : x)) })); setSaved(false); };
  const delRow = (sec, idx) => { setVcl((p) => ({ ...p, [sec]: p[sec].filter((_, i) => i !== idx) })); setSaved(false); };

  // ── per-platform tracking-helpers (Samlet = sum, ellers én enhed) ──
  const unitVal = (u, f) => Number((vcl.track[u] || {})[f]) || 0;
  const agg = (f) => (scope === "samlet" ? UNITS.reduce((s, u) => s + unitVal(u.key, f), 0) : unitVal(scope, f));
  const setTrack = (u, f, val) => { setVcl((p) => ({ ...p, track: { ...p.track, [u]: { ...(p.track[u] || {}), [f]: val } } })); setSaved(false); };
  const editable = scope !== "samlet";
  const scopeLabel = scope === "samlet" ? "Samlet" : ((UNITS.find((u) => u.key === scope) || {}).label || scope);

  const cycleStatus = (i) => {
    const order = ["pending", "active", "done"];
    setVcl((p) => ({ ...p, roadmap: p.roadmap.map((x, j) => (j === i ? { ...x, status: order[(order.indexOf(x.status) + 1) % 3] } : x)) }));
    setSaved(false);
  };

  const save = async () => { const ok = await saveKey("vcl_state", vcl); setSaved(ok); };
  const roadDone = (vcl.roadmap || []).filter((m) => m.status === "done").length;

  const pr = vcl.project;
  const gross = agg("grossRevenue"), fees = agg("fees"), tips = agg("tips"), ppv = agg("ppvChat"), exp = agg("expenses");
  const netRev = gross + tips + ppv - fees;
  const profit = netRev - exp;
  const impressions = agg("impressions"), subs = agg("subscribers");
  const convRate = impressions > 0 ? ((subs / impressions) * 100).toFixed(2) : "0.00";
  const rpm = impressions > 0 ? ((gross + tips + ppv) / (impressions / 1000)).toFixed(2) : "0.00";

  return (
    <div className="vcl-wrap">
      {/* Header */}
      <div className="vcl-head">
        <div className="vcl-head-title">
          <ShieldCheck size={18} strokeWidth={2} style={{ color: "var(--gold, #C9A14E)" }} />
          <h2>Virtual Creator Lab</h2>
          <span className="vcl-brandtag">{pr.brand || pr.name || "unavngivet brand"}</span>
        </div>
        <div className="vcl-save">
          <span className={`vcl-save-dot ${saved ? "ok" : "dirty"}`} />
          <span className="vcl-save-txt">{saved ? "gemt" : "ikke gemt"}</span>
          <button className="vcl-save-btn" onClick={save} disabled={saved}>
            <Save size={12} strokeWidth={2.2} /> Gem
          </button>
        </div>
      </div>
      <p className="vcl-head-sub">
        Compliance-first AI virtual creator — separat brand fra Paper Empires. Instagram = SFW funnel; monetization på
        AI-tolerante platforme (Fanvue primær). Tracking pr. platform: skift mellem <b>Samlet</b> og den enkelte platform.
      </p>

      {/* Compliance-bjælke — altid synlig */}
      <div className="vcl-rules">
        <Lock size={13} strokeWidth={2} style={{ color: "var(--gold,#C9A14E)", flexShrink: 0, marginTop: 1 }} />
        <span>
          <b>Ufravigeligt:</b> ingen real-person deepfakes · ingen face-swap/celebrity-lookalikes · ingen rigtige personers
          ansigt/krop/stemme · 25+, ingen teen-look/tvetydig alder · synlig AI-disclosure · Instagram altid SFW ·
          paid/spicy content kræver <b>human approval</b> i testfasen.
        </span>
      </div>

      {/* Sub-nav */}
      <nav className="vcl-subnav" aria-label="VCL-sektioner">
        {SECTIONS.map((s) => {
          const Ic = s.Icon;
          return (
            <button key={s.id} className={`vcl-subtab ${section === s.id ? "active" : ""}`} onClick={() => setSection(s.id)}>
              <Ic size={13} strokeWidth={2} />{s.label}
            </button>
          );
        })}
      </nav>

      {!ready && <div className="vcl-loading">Henter gemt state…</div>}

      {/* ───────── OVERVIEW ───────── */}
      {section === "overview" && (
        <div className="vcl-sec">
          <div className="vcl-readiness">
            <div className="vcl-readiness-row">
              <Field label="Brand-navn"><input className="vcl-in" value={pr.brand} onChange={(e) => setField("project", "brand", e.target.value)} placeholder="fx Sera" /></Field>
              <Field label="Projekt-status">
                <select className="vcl-sel" value={pr.status} onChange={(e) => setField("project", "status", e.target.value)}>
                  {["planning", "building", "live", "paused"].map((x) => <option key={x} value={x}>{x}</option>)}
                </select>
              </Field>
              <Field label="Launch-readiness %"><input className="vcl-in" type="number" min="0" max="100" value={pr.launchReadiness} onChange={(e) => setField("project", "launchReadiness", +e.target.value)} /></Field>
              <Field label="Compliance-score %"><input className="vcl-in" type="number" min="0" max="100" value={pr.complianceScore} onChange={(e) => setField("project", "complianceScore", +e.target.value)} /></Field>
            </div>
            <div className="vcl-bars">
              <Bar label="Launch-readiness" pct={pr.launchReadiness} />
              <Bar label="Compliance-score" pct={pr.complianceScore} tone="#6FB07F" />
            </div>
          </div>

          <ScopeBar scope={scope} setScope={setScope} />
          <div className="vcl-kpis">
            {OV_KPIS.map(([k, l]) => <Kpi key={k} value={fmt(agg(k))} label={l} />)}
            <Kpi value={money(netRev)} label="Netto-indtjening" />
            <Kpi value={money(exp)} label="Udgifter" tone={exp > 0 ? "#E6C877" : undefined} />
            <Kpi value={money(profit)} label="Profit" tone={profit >= 0 ? "#6FB07F" : "#E0795E"} />
          </div>
          <UnitEdit editable={editable} scope={scope} scopeLabel={scopeLabel} fields={OV_EDIT} unitVal={unitVal} setTrack={setTrack} />
          <EditNote editable={editable} />

          <div className="vcl-next">
            <ArrowRight size={13} strokeWidth={2.4} style={{ color: "var(--gold,#C9A14E)", flexShrink: 0, marginTop: 2 }} />
            <span><b>Næste handling:</b> <input className="vcl-in vcl-in--ghost" value={pr.nextAction} onChange={(e) => setField("project", "nextAction", e.target.value)} /></span>
          </div>
        </div>
      )}

      {/* ───────── ROADMAP ───────── */}
      {section === "roadmap" && (
        <div className="vcl-sec">
          <SecHead Icon={Milestone} title="Roadmap">
            {roadDone}/{vcl.roadmap.length} milepæle done. Klik en milepæl for at skifte status (pending → active → done). Fuld historik: <code>docs/virtual-creator-lab/CHANGELOG.md</code>.
          </SecHead>
          <div className="vcl-road">
            {vcl.roadmap.map((m, i) => (
              <button key={i} className={`vcl-road-item ${m.status}`} onClick={() => cycleStatus(i)}>
                <span className="vcl-road-dot" />
                <span className="vcl-road-phase">{m.phase}</span>
                <span className="vcl-road-body"><b>{m.title}</b><span>{m.detail}</span></span>
                <span className="vcl-road-status">{m.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ───────── PERSONA ───────── */}
      {section === "persona" && (
        <div className="vcl-sec">
          <SecHead Icon={UserRound} title="Persona — bible-overflade">
            AI-discloseret · 25+ · ligner ingen rigtig person. Fuld bible: <code>docs/virtual-creator-lab/persona-bible.md</code>.
          </SecHead>
          <div className="vcl-grid2">
            <Field label="Persona-navn"><input className="vcl-in" value={vcl.persona.name} onChange={(e) => setField("persona", "name", e.target.value)} /></Field>
            <Field label="Alders-label"><input className="vcl-in" value={vcl.persona.ageLabel} onChange={(e) => setField("persona", "ageLabel", e.target.value)} /></Field>
            <Field label="AI/syntetisk disclosure-status" wide><input className="vcl-in" value={vcl.persona.disclosure} onChange={(e) => setField("persona", "disclosure", e.target.value)} /></Field>
            <Field label="Visuel identitet-status"><input className="vcl-in" value={vcl.persona.visualIdentity} onChange={(e) => setField("persona", "visualIdentity", e.target.value)} /></Field>
            <Field label="Brand-stil"><input className="vcl-in" value={vcl.persona.brandStyle} onChange={(e) => setField("persona", "brandStyle", e.target.value)} /></Field>
            <Field label="Voice / tone"><input className="vcl-in" value={vcl.persona.voiceTone} onChange={(e) => setField("persona", "voiceTone", e.target.value)} /></Field>
            <Field label="Disclosure-tekst (offentlig)"><input className="vcl-in" value={vcl.persona.disclosureText} onChange={(e) => setField("persona", "disclosureText", e.target.value)} /></Field>
            <Field label="Forbidden-resemblance noter" wide><textarea className="vcl-ta" rows={2} value={vcl.persona.forbiddenResemblance} onChange={(e) => setField("persona", "forbiddenResemblance", e.target.value)} /></Field>
            <Field label="Asset-bibliotek (URL)"><input className="vcl-in" value={vcl.persona.assetLibrary} onChange={(e) => setField("persona", "assetLibrary", e.target.value)} placeholder="Drive/Supabase storage-link" /></Field>
            <Field label="Prompt-bible (URL)"><input className="vcl-in" value={vcl.persona.promptBible} onChange={(e) => setField("persona", "promptBible", e.target.value)} /></Field>
            <Field label="Sidst opdateret"><input className="vcl-in" value={vcl.persona.lastUpdated} onChange={(e) => setField("persona", "lastUpdated", e.target.value)} placeholder="ÅÅÅÅ-MM-DD" /></Field>
          </div>
        </div>
      )}

      {/* ───────── PLATFORMS ───────── */}
      {section === "platforms" && (
        <div className="vcl-sec">
          <SecHead Icon={Globe} title="Platform-status">
            Policy-scores verificeret 2026-06-28. Fansly = <i>incompatible</i> (photoreal AI forbudt).
          </SecHead>
          <div className="vcl-pgrid">
            {vcl.platforms.map((p, i) => (
              <div key={p.key} className="vcl-pcard">
                <div className="vcl-pcard-top">
                  <span className="vcl-pname">{p.label}</span>
                  <span className="vcl-pstatus" style={{ color: STATUS_TONE[p.status], borderColor: STATUS_TONE[p.status] }}>{p.status}</span>
                </div>
                <div className="vcl-prole">{p.role}</div>
                <div className="vcl-pgrid2">
                  <Field label="Status">
                    <select className="vcl-sel" value={p.status} onChange={(e) => setPlatform(i, "status", e.target.value)}>
                      {STATUS_OPTS.map((x) => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </Field>
                  <Field label="Risiko">
                    <select className="vcl-sel" value={p.risk} onChange={(e) => setPlatform(i, "risk", e.target.value)} style={{ color: RISK_TONE[p.risk] }}>
                      {RISK_OPTS.map((x) => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </Field>
                  <Field label="Policy-score"><input className="vcl-in" type="number" min="0" max="100" value={p.policyScore} onChange={(e) => setPlatform(i, "policyScore", +e.target.value)} /></Field>
                  <div className="vcl-ptoggles">
                    <Toggle on={p.revenue} onClick={() => setPlatform(i, "revenue", !p.revenue)} label="Revenue" />
                    <Toggle on={p.automation} onClick={() => setPlatform(i, "automation", !p.automation)} label="Automation" />
                  </div>
                </div>
                <Field label="Profil-URL (vises i hub'en)" wide><input className="vcl-in" value={p.url || ""} onChange={(e) => setPlatform(i, "url", e.target.value)} placeholder="https://fanvue.com/sera" /></Field>
                <Field label="Manuel handling" wide><textarea className="vcl-ta" rows={2} value={p.manualAction} onChange={(e) => setPlatform(i, "manualAction", e.target.value)} /></Field>
                <Field label="Setup-checklist (én pr. linje)" wide><textarea className="vcl-ta" rows={2} value={p.checklist} onChange={(e) => setPlatform(i, "checklist", e.target.value)} /></Field>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────── FUNNEL ───────── */}
      {section === "funnel" && (
        <div className="vcl-sec">
          <SecHead Icon={Filter} title="Funnel-metrics">Impressions → reach → profil → klik → paid → subscribers. Pr. platform eller samlet.</SecHead>
          <ScopeBar scope={scope} setScope={setScope} />
          <div className="vcl-funnel">
            {FUNNEL_STEPS.map(([k, l]) => (
              <div key={k} className="vcl-funnel-step">
                <div className="vcl-funnel-l">{l}</div>
                {editable
                  ? <input className="vcl-in" type="number" value={unitVal(scope, k)} onChange={(e) => setTrack(scope, k, +e.target.value)} />
                  : <div className="vcl-funnel-v">{fmt(agg(k))}</div>}
              </div>
            ))}
          </div>
          <div className="vcl-kpis" style={{ marginTop: 14 }}>
            <Kpi value={convRate + "%"} label="Konvertering (sub/impr.)" />
            <Kpi value={"$" + rpm} label="Revenue / 1.000 impr." />
            <Kpi value={money(gross + tips + ppv)} label="Brutto-revenue" />
          </div>
          <EditNote editable={editable} />
        </div>
      )}

      {/* ───────── CONTENT ───────── */}
      {section === "content" && (
        <div className="vcl-sec">
          <SecHead Icon={ImageIcon} title="Content pipeline">
            Tæller pr. stadie. Fuld liste bindes til <code>virtual_creator_content</code> i Fase 2. Alt paid/spicy gennem <b>human approval</b>.
          </SecHead>
          <div className="vcl-stages">
            {[
              ["ideas", "Idéer"], ["promptQueue", "Prompt-kø"], ["generated", "Genereret"], ["complianceReview", "Compliance-review"],
              ["humanApproval", "Human approval"], ["scheduled", "Planlagt"], ["published", "Publiceret"], ["remixCandidates", "Remix-kandidater"],
            ].map(([k, l]) => (
              <div key={k} className="vcl-stage">
                <input className="vcl-stage-v" type="number" value={vcl.content[k]} onChange={(e) => setField("content", k, +e.target.value)} />
                <div className="vcl-stage-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────── CHAT ───────── */}
      {section === "chat" && (
        <div className="vcl-sec">
          <SecHead Icon={MessageSquare} title="Chat pipeline">
            Discloseret AI-assistent. Påstår aldrig at være rigtig person. Høj-risiko/eksplicit/betaling → human review. Kun summaries gemmes.
          </SecHead>
          <ScopeBar scope={scope} setScope={setScope} />
          <div className="vcl-kpis">
            <Kpi value={fmt(agg("interactions"))} label="Interaktioner (DM/chat)" />
            <Kpi value={money(agg("ppvChat"))} label="Chat/PPV-revenue" />
          </div>
          {editable && (
            <div className="vcl-grid4">
              <Field label="Interaktioner"><input className="vcl-in" type="number" value={unitVal(scope, "interactions")} onChange={(e) => setTrack(scope, "interactions", +e.target.value)} /></Field>
              <Field label="Chat/PPV-revenue ($)"><input className="vcl-in" type="number" value={unitVal(scope, "ppvChat")} onChange={(e) => setTrack(scope, "ppvChat", +e.target.value)} /></Field>
            </div>
          )}
          <EditNote editable={editable} />
          <div className="vcl-grid2" style={{ marginTop: 4 }}>
            <Field label="Instagram DM-status"><input className="vcl-in" value={vcl.chat.igDmStatus} onChange={(e) => setField("chat", "igDmStatus", e.target.value)} /></Field>
            <Field label="Paid-platform chat-status"><input className="vcl-in" value={vcl.chat.paidChatStatus} onChange={(e) => setField("chat", "paidChatStatus", e.target.value)} /></Field>
            <div className="vcl-ptoggles">
              <Toggle on={vcl.chat.botEnabled} onClick={() => setField("chat", "botEnabled", !vcl.chat.botEnabled)} label="Bot aktiveret" />
              <Toggle on={vcl.chat.humanApprovalRequired} onClick={() => setField("chat", "humanApprovalRequired", !vcl.chat.humanApprovalRequired)} label="Human approval krævet" />
            </div>
            <Field label="Sidst gennemgået"><input className="vcl-in" value={vcl.chat.lastReviewed} onChange={(e) => setField("chat", "lastReviewed", e.target.value)} placeholder="ÅÅÅÅ-MM-DD" /></Field>
            <Field label="Risk-flags (resumé)" wide><input className="vcl-in" value={vcl.chat.riskFlags} onChange={(e) => setField("chat", "riskFlags", e.target.value)} placeholder="fx 0 alderstvivl, 0 eksplicitte, 0 betaling" /></Field>
          </div>
        </div>
      )}

      {/* ───────── COMPLIANCE ───────── */}
      {section === "compliance" && (
        <div className="vcl-sec">
          <SecHead Icon={ShieldCheck} title="Compliance-log">Tjekliste pr. content/persona. Audit-spor i <code>virtual_creator_compliance_checks</code>.</SecHead>
          <div className="vcl-checks">
            {[
              ["aiDisclosure", "AI-disclosure til stede"], ["platformAllowed", "Platform tillader content-typen"],
              ["noRealPerson", "Ingen rigtig-person-lighed"], ["noMinorRisk", "Ingen minor/young-look-risiko"],
              ["noCelebrity", "Ingen celebrity-lighed"], ["humanApproval", "Human approval krævet (testfase)"],
            ].map(([k, l]) => (
              <button key={k} className={`vcl-check ${vcl.compliance[k] ? "on" : "off"}`} onClick={() => setField("compliance", k, !vcl.compliance[k])}>
                {vcl.compliance[k] ? <Check size={13} strokeWidth={3} /> : <AlertTriangle size={13} strokeWidth={2.4} />}{l}
              </button>
            ))}
          </div>
          <div className="vcl-grid2" style={{ marginTop: 14 }}>
            <Field label="SFW/NSFW-klassifikation"><input className="vcl-in" value={vcl.compliance.sfwClassification} onChange={(e) => setField("compliance", "sfwClassification", e.target.value)} /></Field>
            <Field label="Policy-kilde tjekket"><input className="vcl-in" value={vcl.compliance.policySource} onChange={(e) => setField("compliance", "policySource", e.target.value)} /></Field>
            <Field label="Noter" wide><textarea className="vcl-ta" rows={2} value={vcl.compliance.notes} onChange={(e) => setField("compliance", "notes", e.target.value)} /></Field>
          </div>
        </div>
      )}

      {/* ───────── EXPERIMENTS ───────── */}
      {section === "experiments" && (
        <div className="vcl-sec">
          <SecHead Icon={FlaskConical} title="Eksperimenter">
            <button className="vcl-add" onClick={() => addRow("experiments", { hook: "", visualStyle: "", cta: "", platform: "", postingTime: "", result: "", verdict: "running", nextTest: "" })}>
              <Plus size={12} strokeWidth={2.4} /> Tilføj test
            </button>
          </SecHead>
          {vcl.experiments.length === 0 && <div className="vcl-empty">Ingen eksperimenter endnu. Tilføj hook/visual/CTA-tests for at finde vindere.</div>}
          {vcl.experiments.map((x, i) => (
            <div key={i} className="vcl-exp">
              <div className="vcl-grid4">
                <Field label="Hook"><input className="vcl-in" value={x.hook} onChange={(e) => setRow("experiments", i, "hook", e.target.value)} /></Field>
                <Field label="Visual-stil"><input className="vcl-in" value={x.visualStyle} onChange={(e) => setRow("experiments", i, "visualStyle", e.target.value)} /></Field>
                <Field label="CTA"><input className="vcl-in" value={x.cta} onChange={(e) => setRow("experiments", i, "cta", e.target.value)} /></Field>
                <Field label="Platform"><input className="vcl-in" value={x.platform} onChange={(e) => setRow("experiments", i, "platform", e.target.value)} /></Field>
                <Field label="Posting-tid"><input className="vcl-in" value={x.postingTime} onChange={(e) => setRow("experiments", i, "postingTime", e.target.value)} /></Field>
                <Field label="Resultat"><input className="vcl-in" value={x.result} onChange={(e) => setRow("experiments", i, "result", e.target.value)} /></Field>
                <Field label="Verdict">
                  <select className="vcl-sel" value={x.verdict} onChange={(e) => setRow("experiments", i, "verdict", e.target.value)}>
                    {["running", "winner", "loser", "inconclusive"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Field>
                <Field label="Næste test"><input className="vcl-in" value={x.nextTest} onChange={(e) => setRow("experiments", i, "nextTest", e.target.value)} /></Field>
              </div>
              <button className="vcl-del" onClick={() => delRow("experiments", i)}><Trash2 size={12} strokeWidth={2.2} /></button>
            </div>
          ))}
        </div>
      )}

      {/* ───────── ØKONOMI ───────── */}
      {section === "okonomi" && (
        <div className="vcl-sec">
          <SecHead Icon={Coins} title="Økonomi — indtjening & udgifter">Netto = gross + tips + PPV/chat − fees. Profit = netto − udgifter. Pr. platform eller samlet.</SecHead>
          <ScopeBar scope={scope} setScope={setScope} />
          <div className="vcl-kpis">
            <Kpi value={money(gross)} label="Gross-revenue" />
            <Kpi value={money(tips + ppv)} label="Tips + PPV/chat" />
            <Kpi value={money(fees)} label="Fees" />
            <Kpi value={money(netRev)} label="Netto-indtjening" />
            <Kpi value={money(exp)} label="Udgifter" tone={exp > 0 ? "#E6C877" : undefined} />
            <Kpi value={money(profit)} label="Profit" tone={profit >= 0 ? "#6FB07F" : "#E0795E"} />
          </div>
          <UnitEdit editable={editable} scope={scope} scopeLabel={scopeLabel} fields={ECON_EDIT} unitVal={unitVal} setTrack={setTrack} />
          {scope === "samlet" && (
            <div className="vcl-rev-table">
              <div className="vcl-rev-h2"><span>Platform</span><span>Gross</span><span>Netto</span><span>Udgifter</span><span>Profit</span></div>
              {UNITS.map((u) => {
                const net = unitVal(u.key, "grossRevenue") + unitVal(u.key, "tips") + unitVal(u.key, "ppvChat") - unitVal(u.key, "fees");
                const e = unitVal(u.key, "expenses");
                return (
                  <div className="vcl-rev-r2" key={u.key}>
                    <span>{u.label}</span>
                    <span>{money(unitVal(u.key, "grossRevenue"))}</span>
                    <span>{money(net)}</span>
                    <span>{money(e)}</span>
                    <span style={{ color: net - e >= 0 ? "#6FB07F" : "#E0795E" }}>{money(net - e)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ───────── AUTOMATION ───────── */}
      {section === "automation" && (
        <div className="vcl-sec">
          <SecHead Icon={Activity} title="Automation health">n8n + scraping-status. Logges i <code>virtual_creator_automation_runs</code>.</SecHead>
          <div className="vcl-grid2">
            <Field label="n8n workflow-status"><input className="vcl-in" value={vcl.automation.n8nStatus} onChange={(e) => setField("automation", "n8nStatus", e.target.value)} /></Field>
            <Field label="MCP/browser-scraping-status"><input className="vcl-in" value={vcl.automation.scrapingStatus} onChange={(e) => setField("automation", "scrapingStatus", e.target.value)} /></Field>
            <Field label="Sidste kørsel"><input className="vcl-in" value={vcl.automation.lastRun} onChange={(e) => setField("automation", "lastRun", e.target.value)} /></Field>
            <Field label="Deploy-status"><input className="vcl-in" value={vcl.automation.deployStatus} onChange={(e) => setField("automation", "deployStatus", e.target.value)} /></Field>
            <Field label="Fejl" wide><textarea className="vcl-ta" rows={2} value={vcl.automation.errors} onChange={(e) => setField("automation", "errors", e.target.value)} /></Field>
            <Field label="Manuel handling krævet" wide><textarea className="vcl-ta" rows={2} value={vcl.automation.manualAction} onChange={(e) => setField("automation", "manualAction", e.target.value)} /></Field>
            <Field label="Logs (URL)" wide><input className="vcl-in" value={vcl.automation.logsUrl} onChange={(e) => setField("automation", "logsUrl", e.target.value)} /></Field>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: VCL_CSS }} />
    </div>
  );
}

function SecHead({ Icon, title, children }) {
  return (
    <div className="vcl-sechead">
      <div className="vcl-sechead-t"><Icon size={15} strokeWidth={2} style={{ color: "var(--gold,#C9A14E)" }} /><h3>{title}</h3></div>
      <div className="vcl-sechead-s">{children}</div>
    </div>
  );
}
function Bar({ label, pct, tone }) {
  const p = Math.max(0, Math.min(100, Number(pct) || 0));
  return (
    <div className="vcl-bar">
      <div className="vcl-bar-head"><span>{label}</span><b>{p}%</b></div>
      <div className="vcl-bar-track"><div className="vcl-bar-fill" style={{ width: p + "%", background: tone || "var(--gold,#C9A14E)" }} /></div>
    </div>
  );
}
function Toggle({ on, onClick, label }) {
  return (
    <button type="button" className={`vcl-toggle ${on ? "on" : ""}`} onClick={onClick}>
      <span className="vcl-toggle-track"><span className="vcl-toggle-knob" /></span>{label}
    </button>
  );
}
// Modul-niveau (stabil identitet) → redigerings-inputs mister ikke fokus ved re-render.
function ScopeBar({ scope, setScope }) {
  return (
    <div className="vcl-scope">
      <span className="vcl-scope-l">Vis:</span>
      <button className={`vcl-pill ${scope === "samlet" ? "on" : ""}`} onClick={() => setScope("samlet")}>Samlet</button>
      {UNITS.map((u) => (
        <button key={u.key} className={`vcl-pill ${scope === u.key ? "on" : ""}`} onClick={() => setScope(u.key)}>{u.label}</button>
      ))}
    </div>
  );
}
function EditNote({ editable }) {
  if (editable) return null;
  return <div className="vcl-empty">Viser <b>samlet</b> på tværs af platforme. Vælg en platform ovenfor for at redigere tal.</div>;
}
function UnitEdit({ editable, scope, scopeLabel, fields, unitVal, setTrack }) {
  if (!editable) return null;
  return (
    <details open className="vcl-edit">
      <summary>Redigér <b>{scopeLabel}</b> manuelt (Fase 1 — indtil scraping/cron fylder dem)</summary>
      <div className="vcl-grid4">
        {fields.map(([k, l]) => (
          <Field key={k} label={l}><input className="vcl-in" type="number" value={unitVal(scope, k)} onChange={(e) => setTrack(scope, k, +e.target.value)} /></Field>
        ))}
      </div>
    </details>
  );
}

const VCL_CSS = `
.vcl-wrap { display:flex; flex-direction:column; gap:16px; }
.vcl-head { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.vcl-head-title { display:flex; align-items:center; gap:9px; }
.vcl-head-title h2 { font-family:var(--serif,'Fraunces',serif); font-size:22px; font-weight:600; margin:0; color:var(--bone,#F2F2EA); }
.vcl-brandtag { font-family:var(--mono,monospace); font-size:10.5px; letter-spacing:.03em; text-transform:uppercase; color:var(--bone-dim,#9AA6B2); border:1px solid var(--line,#1E2730); border-radius:999px; padding:2px 9px; }
.vcl-head-sub { color:var(--bone-dim,#9AA6B2); font-size:13.5px; line-height:1.6; margin:0; max-width:820px; }
.vcl-head-sub b { color:var(--bone,#F2F2EA); }
.vcl-save { display:flex; align-items:center; gap:8px; }
.vcl-save-dot { width:7px; height:7px; border-radius:50%; }
.vcl-save-dot.ok { background:#6FB07F; }
.vcl-save-dot.dirty { background:var(--gold,#C9A14E); }
.vcl-save-txt { font-size:11px; color:var(--faint,#8A95A1); }
.vcl-save-btn { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:var(--ink,#0B0F14); background:var(--gold,#C9A14E); border:none; border-radius:8px; padding:6px 12px; cursor:pointer; }
.vcl-save-btn:disabled { opacity:.45; cursor:default; }
.vcl-rules { display:flex; gap:9px; align-items:flex-start; background:rgba(201,161,78,0.07); border:1px solid color-mix(in srgb, var(--gold,#C9A14E) 30%, var(--line,#1E2730)); border-radius:12px; padding:11px 14px; font-size:12.5px; line-height:1.55; color:var(--bone-dim,#9AA6B2); }
.vcl-rules b { color:var(--bone,#F2F2EA); }
.vcl-subnav { display:flex; flex-wrap:wrap; gap:5px; border-bottom:1px solid var(--line,#1E2730); padding-bottom:10px; }
.vcl-subtab { display:inline-flex; align-items:center; gap:6px; font-size:12.5px; color:var(--bone-dim,#9AA6B2); background:transparent; border:1px solid transparent; border-radius:8px; padding:6px 11px; cursor:pointer; }
.vcl-subtab:hover { color:var(--bone,#F2F2EA); background:var(--panel-2,#0E141B); }
.vcl-subtab.active { color:var(--ink,#0B0F14); background:var(--gold,#C9A14E); font-weight:600; }
.vcl-loading { color:var(--faint,#8A95A1); font-size:12.5px; }
.vcl-sec { display:flex; flex-direction:column; gap:14px; }
.vcl-scope { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
.vcl-scope-l { font-family:var(--mono,monospace); font-size:9.5px; letter-spacing:.09em; text-transform:uppercase; color:var(--faint,#8A95A1); margin-right:2px; }
.vcl-pill { font-size:12px; color:var(--bone-dim,#9AA6B2); background:var(--panel-2,#0E141B); border:1px solid var(--line,#1E2730); border-radius:999px; padding:5px 13px; cursor:pointer; }
.vcl-pill:hover { color:var(--bone,#F2F2EA); }
.vcl-pill.on { color:var(--ink,#0B0F14); background:var(--gold,#C9A14E); border-color:var(--gold,#C9A14E); font-weight:600; }
.vcl-sechead { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.vcl-sechead-t { display:flex; align-items:center; gap:8px; }
.vcl-sechead-t h3 { font-family:var(--serif,'Fraunces',serif); font-size:17px; font-weight:600; margin:0; color:var(--bone,#F2F2EA); }
.vcl-sechead-s { color:var(--bone-dim,#9AA6B2); font-size:12.5px; line-height:1.5; flex:1; min-width:240px; }
.vcl-sechead-s code, .vcl-empty code, .vcl-sec code { font-family:var(--mono,monospace); font-size:11.5px; color:var(--gold,#C9A14E); }
.vcl-field { display:flex; flex-direction:column; gap:4px; }
.vcl-field--wide { grid-column:1 / -1; }
.vcl-field-l { font-family:var(--mono,monospace); font-size:9.5px; letter-spacing:.09em; text-transform:uppercase; color:var(--faint,#8A95A1); }
.vcl-in, .vcl-sel, .vcl-ta { width:100%; background:var(--panel-2,#0E141B); border:1px solid var(--line,#1E2730); border-radius:8px; color:var(--bone,#F2F2EA); font-size:13px; padding:7px 10px; font-family:inherit; }
.vcl-ta { resize:vertical; line-height:1.45; }
.vcl-in:focus, .vcl-sel:focus, .vcl-ta:focus { outline:none; border-color:var(--gold,#C9A14E); }
.vcl-in--ghost { background:transparent; border:none; border-bottom:1px solid var(--line,#1E2730); border-radius:0; padding:3px 2px; }
.vcl-grid2 { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.vcl-grid4 { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.vcl-readiness { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:14px; }
.vcl-readiness-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:12px; }
.vcl-bars { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.vcl-bar-head { display:flex; justify-content:space-between; font-size:11.5px; color:var(--bone-dim,#9AA6B2); margin-bottom:5px; }
.vcl-bar-head b { color:var(--bone,#F2F2EA); }
.vcl-bar-track { height:6px; background:var(--line,#1E2730); border-radius:3px; overflow:hidden; }
.vcl-bar-fill { height:100%; border-radius:3px; }
.vcl-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:11px; }
.vcl-kpi { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:12px; padding:13px 14px; }
.vcl-kpi-v { font-family:var(--serif,'Fraunces',serif); font-size:21px; font-weight:600; color:var(--bone,#F2F2EA); line-height:1; }
.vcl-kpi-l { font-size:10.5px; color:var(--faint,#8A95A1); margin-top:6px; }
.vcl-edit { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:12px; padding:6px 14px; }
.vcl-edit summary { font-size:12px; color:var(--bone-dim,#9AA6B2); cursor:pointer; padding:8px 0; }
.vcl-edit summary b { color:var(--bone,#F2F2EA); }
.vcl-edit .vcl-grid4 { padding:8px 0 14px; }
.vcl-next { display:flex; gap:8px; align-items:center; font-size:13px; color:var(--bone,#F2F2EA); }
.vcl-next b { color:var(--gold,#C9A14E); }
.vcl-next span { display:flex; gap:8px; align-items:center; flex:1; }
.vcl-next .vcl-in { flex:1; }
.vcl-pgrid { display:grid; grid-template-columns:repeat(auto-fit,minmax(330px,1fr)); gap:14px; }
.vcl-pcard { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:14px; padding:16px; display:flex; flex-direction:column; gap:11px; }
.vcl-pcard-top { display:flex; align-items:center; justify-content:space-between; gap:9px; }
.vcl-pname { font-family:var(--serif,'Fraunces',serif); font-size:16px; font-weight:600; color:var(--bone,#F2F2EA); }
.vcl-pstatus { font-family:var(--mono,monospace); font-size:10px; letter-spacing:.03em; text-transform:uppercase; border:1px solid; border-radius:999px; padding:3px 9px; }
.vcl-prole { font-size:12px; color:var(--bone-dim,#9AA6B2); }
.vcl-pgrid2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.vcl-ptoggles { display:flex; flex-direction:column; gap:7px; justify-content:center; }
.vcl-toggle { display:inline-flex; align-items:center; gap:7px; background:transparent; border:none; color:var(--bone-dim,#9AA6B2); font-size:11.5px; cursor:pointer; padding:0; }
.vcl-toggle-track { width:30px; height:17px; border-radius:999px; background:var(--line,#1E2730); position:relative; transition:background .15s; }
.vcl-toggle-knob { position:absolute; top:2px; left:2px; width:13px; height:13px; border-radius:50%; background:var(--faint,#8A95A1); transition:transform .15s,background .15s; }
.vcl-toggle.on .vcl-toggle-track { background:color-mix(in srgb, var(--gold,#C9A14E) 55%, transparent); }
.vcl-toggle.on .vcl-toggle-knob { transform:translateX(13px); background:var(--gold,#C9A14E); }
.vcl-toggle.on { color:var(--bone,#F2F2EA); }
.vcl-funnel { display:flex; flex-direction:column; gap:7px; }
.vcl-funnel-step { display:flex; align-items:center; gap:12px; background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:10px; padding:9px 14px; }
.vcl-funnel-l { flex:1; font-size:13px; color:var(--bone-dim,#9AA6B2); }
.vcl-funnel-step .vcl-in { width:160px; }
.vcl-funnel-v { width:160px; text-align:right; font-family:var(--serif,'Fraunces',serif); font-size:17px; font-weight:600; color:var(--bone,#F2F2EA); }
.vcl-stages { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:11px; }
.vcl-stage { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:12px; padding:13px; text-align:center; }
.vcl-stage-v { width:100%; background:transparent; border:none; text-align:center; font-family:var(--serif,'Fraunces',serif); font-size:24px; font-weight:600; color:var(--bone,#F2F2EA); }
.vcl-stage-v:focus { outline:none; }
.vcl-stage-l { font-size:10.5px; color:var(--faint,#8A95A1); margin-top:4px; }
.vcl-empty { color:var(--faint,#8A95A1); font-size:12.5px; line-height:1.5; background:var(--panel-2,#0E141B); border:1px dashed var(--line,#1E2730); border-radius:10px; padding:13px 15px; }
.vcl-empty b { color:var(--bone-dim,#9AA6B2); }
.vcl-checks { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:9px; }
.vcl-check { display:flex; align-items:center; gap:9px; font-size:12.5px; border:1px solid var(--line,#1E2730); border-radius:10px; padding:11px 13px; cursor:pointer; background:var(--panel,#11171F); text-align:left; }
.vcl-check.on { color:var(--bone,#F2F2EA); border-color:color-mix(in srgb,#6FB07F 45%,var(--line,#1E2730)); }
.vcl-check.on svg { color:#6FB07F; }
.vcl-check.off { color:var(--bone-dim,#9AA6B2); }
.vcl-check.off svg { color:var(--gold,#C9A14E); }
.vcl-add { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:var(--gold,#C9A14E); background:transparent; border:1px solid color-mix(in srgb,var(--gold,#C9A14E) 40%,var(--line,#1E2730)); border-radius:8px; padding:5px 11px; cursor:pointer; }
.vcl-exp { position:relative; background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:12px; padding:14px; }
.vcl-del { position:absolute; top:10px; right:10px; color:var(--faint,#8A95A1); background:transparent; border:none; cursor:pointer; padding:4px; }
.vcl-del:hover { color:var(--rust,#E0795E); }
.vcl-rev-table { display:flex; flex-direction:column; gap:6px; }
.vcl-rev-h2, .vcl-rev-r2 { display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr 1fr; gap:8px; align-items:center; padding:9px 13px; }
.vcl-rev-h2 { font-family:var(--mono,monospace); font-size:9.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--faint,#8A95A1); padding-bottom:0; }
.vcl-rev-r2 { background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:10px; font-size:13px; color:var(--bone,#F2F2EA); }
.vcl-rev-r2 span:first-child { font-weight:600; }
.vcl-road { display:flex; flex-direction:column; gap:8px; }
.vcl-road-item { display:flex; align-items:center; gap:13px; text-align:left; background:var(--panel,#11171F); border:1px solid var(--line,#1E2730); border-radius:12px; padding:12px 14px; cursor:pointer; color:var(--bone,#F2F2EA); }
.vcl-road-item:hover { border-color:color-mix(in srgb,var(--gold,#C9A14E) 40%,var(--line,#1E2730)); }
.vcl-road-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; background:var(--faint,#8A95A1); }
.vcl-road-item.done .vcl-road-dot { background:#6FB07F; }
.vcl-road-item.active .vcl-road-dot { background:var(--gold,#C9A14E); box-shadow:0 0 9px var(--gold,#C9A14E); }
.vcl-road-phase { font-family:var(--mono,monospace); font-size:10px; letter-spacing:.05em; text-transform:uppercase; color:var(--faint,#8A95A1); width:62px; flex-shrink:0; }
.vcl-road-body { display:flex; flex-direction:column; gap:2px; flex:1; min-width:0; }
.vcl-road-body b { font-size:13.5px; color:var(--bone,#F2F2EA); }
.vcl-road-body span { font-size:11.5px; color:var(--bone-dim,#9AA6B2); }
.vcl-road-item.done .vcl-road-body b { color:var(--bone-dim,#9AA6B2); }
.vcl-road-status { font-family:var(--mono,monospace); font-size:9px; text-transform:uppercase; letter-spacing:.05em; color:var(--faint,#8A95A1); border:1px solid var(--line,#1E2730); border-radius:999px; padding:3px 8px; flex-shrink:0; }
.vcl-road-item.done .vcl-road-status { color:#6FB07F; border-color:color-mix(in srgb,#6FB07F 40%,var(--line,#1E2730)); }
.vcl-road-item.active .vcl-road-status { color:var(--gold,#C9A14E); border-color:var(--gold,#C9A14E); }
@media (max-width:880px){ .vcl-grid4,.vcl-grid2,.vcl-readiness-row,.vcl-bars,.vcl-pgrid2 { grid-template-columns:1fr 1fr; } }
@media (max-width:560px){ .vcl-grid4,.vcl-grid2,.vcl-readiness-row,.vcl-bars { grid-template-columns:1fr; } }
`;
