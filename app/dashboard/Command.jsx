"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Check, ChevronDown, RotateCcw, ArrowRight, ExternalLink, Plus, Wallet,
  AlertTriangle, Radio, Rocket, LayoutGrid, ListChecks, Flag, Server, Cpu,
  Mic, X, Trash2, Sparkles, Image as ImageIcon, Zap, CircleDot, Lock,
  Wand2, Download, Loader2, TrendingUp, Coins, Activity,
  Milestone, Shield, Database, Key, Eye, Pause, Banknote, GitBranch, Gauge,
  Megaphone, MessageSquare, Pin, Facebook, Bot
} from "lucide-react";
import AgentsTab from "./AgentsTab";
import PerformanceTab from "./PerformanceTab";
import IdeaQueueBoard from "./IdeaQueueBoard";
import CompetitorBenchmark from "./CompetitorBenchmark";
import TodaysMission from "./TodaysMission";

// ─────────────────────────────────────────────────────────────
// SOMI COMMAND · Kommandocentral
// Multi-kanal · kredit-cockpit · launchpad · byggeplan · kø · gate
// Fremgang gemmes automatisk (window.storage). Porteres til Next.js i Fase 3.
// ─────────────────────────────────────────────────────────────

const K_CHECK = "somi_checklist_v1";   // delt nøgle med byggeplan-skallen
const K_CHAN  = "somi_channels_v3";    // v3: per-kanal systems/dataTables/refs/qcMode
const K_CRED  = "somi_credits_v2";
const K_CAD   = "somi_cadence_v1";
const K_KPI   = "somi_kpis_v1";
const K_LOG   = "somi_log_v1";
const K_ACTIVE = "somi_active_v1";
const K_COSTS  = "somi_costs_v2";       // v2: kost har nu channelId
const K_EARN   = "somi_earnings_v1";    // indtjening pr. kanal/kilde

// ── Storage helpers (Supabase via /api/state) ──
async function loadKey(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const res = await fetch(`/api/state?key=${encodeURIComponent(key)}`);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data && data.value != null ? data.value : fallback;
  } catch (e) { return fallback; }
}
async function saveKey(key, value) {
  try {
    if (typeof window === "undefined") return false;
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    return res.ok;
  } catch (e) { return false; }
}

// ── Byggeplan (Fase 0–5) ──
const PHASES = [
  { id: "f0", sag: "SAG 00", title: "Fundament", week: "Uge 0", steps: [
    { id: "f0s1", title: "Vælg kanalnavn + identitet", desc: "Paper Empires er valgt og live.", guide: ["Tjek handle på YouTube, TikTok, Instagram, Facebook", "Logo + banner via billedmodel ud fra stilguiden (noir, guld)", "Gem navn, handle og filer under 'Brand'"] },
    { id: "f0s2", title: "Opret YouTube brand-kanal", desc: "Brand-konto, ikke personlig.", guide: ["Indstillinger → opret ny kanal (brand-konto)", "Upload logo + banner, beskrivelse på engelsk", "Aktivér avancerede funktioner (>15 min upload)"] },
    { id: "f0s3", title: "Opret TikTok, Instagram og Facebook-side", desc: "Samme handle overalt.", guide: ["IG som Professionel, FB som Side (Graph API)", "Bio: én sætning + link-hub URL"] },
    { id: "f0s4", title: "Google Cloud + YouTube Data API", desc: "Fundament for upload og stats.", guide: ["Nyt projekt 'somi-engine'", "Aktivér YouTube Data API v3 + Analytics API", "OAuth-credentials i n8n Credentials"] },
    { id: "f0s5", title: "ElevenLabs + lås stemmen", desc: "Én fast dokumentar-stemme.", guide: ["Test 3 kandidater på samme testscript", "Gem voice-ID som variabel", "Hold kreditter fyldt (se Kreditter)"] },
    { id: "f0s6", title: "Render-løsning", desc: "Selv-hostet renderer + captions.", guide: ["VPS med renderer + Whisper.cpp captions", "API-nøgle gemt i n8n Credentials"] },
    { id: "f0s7", title: "Posting-løsning", desc: "FB kører via Graph API (gratis).", guide: ["Direkte Graph API til Facebook — ingen abonnement", "Buffer reserveret til shorts-only projekt"] },
    { id: "f0s8", title: "Data-tabeller: ideas / videos / costlog", desc: "Drifts-overblik i n8n.", guide: ["ideas: case_id, title, hook, source, status, priority", "videos: status-pipeline", "costlog: video_id, step, usd_cost, ts"] },
    { id: "f0s9", title: "Tilmeld affiliate-programmer", desc: "Indtægtskilde nr. 2.", guide: ["PartnerStack først (SaaS/AI, recurring)", "Gem referral-links; link-hub i Fase 2", "Markér links som reklame"] },
  ]},
  { id: "f1", sag: "SAG 01", title: "Long-form pipeline", week: "Uge 1–3", steps: [
    { id: "f1s1", title: "Stilguide som system-prompt", desc: "Visuel stil + voice + struktur.", guide: ["Palette, motiver, 'aldrig rigtige personer', tone", "Prompt caching — prepend til alle kald"] },
    { id: "f1s2", title: "Workflow A: idé → script", desc: "Hele pakken i ét JSON-output.", guide: ["Cold open, 4 kapitler, billed-prompts, shorts-hooks, SEO", "Compliance: levende personer kun med kildetype", "Trigger: status 'klar til produktion'"] },
    { id: "f1s3", title: "Workflow B: voiceover", desc: "ElevenLabs, kapitel-opdelt.", guide: ["Kapitel-opdeling gør retries billige", "mp3 i cloud storage, URL'er retur"] },
    { id: "f1s4", title: "Workflow C: billeder", desc: "20–30 billeder i 16:9.", guide: ["Stilguide + billed-prompt pr. kald", "2–3 reserve-billeder"] },
    { id: "f1s5", title: "Render-template (16:9)", desc: "Ken Burns, captions, musik, kapitelkort.", guide: ["Dynamiske felter: billed-URL'er, VO, titler", "3–4 faste musiktracks = lyd-identitet"] },
    { id: "f1s6", title: "Workflow D: assembly + render", desc: "JSON → færdig mp4.", guide: ["Poll til render er færdig", "Gem mp4-URL, status → 'til godkendelse'"] },
    { id: "f1s7", title: "Review-step", desc: "Godkend/afvis de første 30 dage.", guide: ["Afvis-årsag = træningsdata til QC-agenten"] },
    { id: "f1s8", title: "Workflow E: upload til YouTube", desc: "Planlagt med SEO-pakken.", guide: ["Fast udgivelsestidspunkt (konsistens > timing)", "Markér AI-genereret hvor relevant"] },
    { id: "f1s9", title: "Kostlog pr. video", desc: "USD-forbrug pr. step.", guide: ["Felter: video_id, step, model, usd_cost, ts", "Dashboardets vigtigste datakilde"] },
    { id: "f1s10", title: "Første video live", desc: "Enron kørt end-to-end.", guide: ["Velkendt stof, nemt at fakta-tjekke", "Notér flaskehalse = backlog"] },
  ]},
  { id: "f2", sag: "SAG 02", title: "Shorts + distribution", week: "Uge 3–4", steps: [
    { id: "f2s1", title: "Shorts-klipper workflow", desc: "3 stærkeste hooks fra scriptet.", guide: ["Hooks ligger i scriptets JSON", "Slut på vendepunktet → 'full story on the channel'"] },
    { id: "f2s2", title: "9:16 render-template", desc: "Store captions, hook først, outro.", guide: ["Genbrug billeder i 9:16-crop", "Læsbar uden lyd (80% ser uden lyd)"] },
    { id: "f2s3", title: "Multi-platform posting", desc: "YT Shorts + Facebook (Graph API).", guide: ["Platform-tilpasset caption pr. kanal", "TikTok/IG reserveret til shorts-only projekt"] },
    { id: "f2s4", title: "Link-hub på Vercel", desc: "Egen side med kort-links — du ejer data.", guide: ["dinside.com/p/produkt → referral-link", "UTM pr. video og platform"] },
    { id: "f2s5", title: "Klik-logging i Supabase", desc: "Hver redirect logges.", guide: ["Tabel 'clicks': slug, video_id, platform, ts", "Rygraden i revenue-viewet"] },
  ]},
  { id: "f3", sag: "SAG 03", title: "Dashboard", week: "Uge 4–5", steps: [
    { id: "f3s1", title: "Supabase-projekt + schema", desc: "videos, posts, stats_daily, costs, clicks.", guide: ["Spejl data-felterne 1:1 → triviel migrering"] },
    { id: "f3s2", title: "Port denne side til Next.js", desc: "Kommandocentralen bliver dashboardets forside.", guide: ["Komponenten er bygget til at løftes over", "Tilføj auth (kun dig) før rigtige data"] },
    { id: "f3s3", title: "Cron: YouTube Analytics dagligt", desc: "Views, watch time, subs, RPM.", guide: ["Kør 06:00, hent i går (1–2 dages forsinkelse er normalt)"] },
    { id: "f3s4", title: "Meta + TikTok stats", desc: "Graph API + (evt. shorts-only senere).", guide: ["Accepter API-huller, suppler manuelt månedligt"] },
    { id: "f3s5", title: "Revenue-view", desc: "Klik + AdSense-estimat pr. video.", guide: ["Ranking: cost-per-video vs. views vs. klik"] },
  ]},
  { id: "f4", sag: "SAG 04", title: "Kommentar-AI", week: "Uge 5–6", steps: [
    { id: "f4s1", title: "Kommentar-hentning (cron)", desc: "Alle platforme, kun nye.", guide: ["Rå kommentarer i Supabase med platform + video_id"] },
    { id: "f4s2", title: "Batch-klassificering", desc: "Sentiment, spørgsmål, idéer, spam.", guide: ["Batch API (50% rabat), natten over", "Struktureret JSON pr. kommentar"] },
    { id: "f4s3", title: "Ugentlig niche-rapport", desc: "Ugens signaler → én rapport.", guide: ["Publikums spørgsmål, content-gaps, produkt-idéer"] },
    { id: "f4s4", title: "Idé-feedback-loop", desc: "Godkendte idéer → idé-køen.", guide: ["Lukket loop: publikum → AI → nye videoer"] },
  ]},
  { id: "f5", sag: "SAG 05", title: "Agents + Kanal 2", week: "Uge 6+", steps: [
    { id: "f5s1", title: "QC-agent", desc: "Scorer script + metadata mod rubric.", guide: ["Hook, fakta-kilder, struktur, SEO, compliance", "Self-healing: under tærskel = regenerér"] },
    { id: "f5s2", title: "Trend-agent", desc: "Scanner finansnyheder → idé-køen.", guide: ["Konstant story-feed = næsten gratis idéer"] },
    { id: "f5s3", title: "30 dages autopilot", desc: "Kører uden indgriben, kun stikprøver.", guide: ["Gate-kriterierne skal alle være grønne"] },
    { id: "f5s4", title: "Kanal 2: Engineering Disasters", desc: "Klon pipelinen, skift stilguide.", guide: ["Din byggeplads-viden er din edge"] },
  ]},
];
const ALL_STEPS = PHASES.flatMap((p) => p.steps.map((s) => ({ ...s, phaseId: p.id })));
const TOTAL = ALL_STEPS.length;

// Forudsatte færdige trin (pipeline + shorts + FB er live) — ret frit i Byggeplan
const SEED_DONE = [
  "f0s1","f0s2","f0s3","f0s4","f0s5","f0s6","f0s7","f0s8","f0s9",
  "f1s1","f1s2","f1s3","f1s4","f1s5","f1s6","f1s7","f1s8","f1s9","f1s10",
  "f2s1","f2s2","f2s3",
  "f3s1","f3s2", // Supabase-projekt+schema ✓ · Port til Next.js (live på Vercel) ✓
  "f3s3",        // Cron: YouTube Analytics dagligt ✓ (OAuth+scopes verificeret end-to-end)
  "f4s4",        // Idé-feedback-loop ✓ (2026-06-20: winner-loop + research-agent → idé-køen)
  "f5s1","f5s2", // QC-agent (factcheck, shadow) ✓ · Trend-agent (TREND) ✓
];

const CASE_STATUS = { live: "Live", next: "Næste", queued: "Kø" };
const nfDK = (n) => new Intl.NumberFormat("da-DK").format(Math.round(Number(n) || 0));
const N8N_BASE = "https://madsvalby.app.n8n.cloud";
const SEED_CHANNELS = [
  {
    id: "ch1", name: "Paper Empires", niche: "Financial Crime & Business Collapse",
    handle: "@paperempires", status: "live", pipeStatus: "published", accent: "#C9A14E", initial: "PE",
    n8nBase: N8N_BASE,
    masterWf: `${N8N_BASE}/workflow/LvTDjTb8MxEeOJM3`,
    shortsWf: `${N8N_BASE}/workflow/98Jel2bOtd2zDGob`,
    ytStudio: "https://studio.youtube.com",
    fb: "https://www.facebook.com/1117005634835655",
    qcMode: "shadow", jafcuPaused: false,
    renderHealth: "http://212.147.240.185:8080/health",
    systems: [
      { key: "master", label: "MASTER", id: "LvTDjTb8MxEeOJM3", role: "Idé → færdig long-form, upload YT+FB, kalder SHORTS", trigger: "Manuel + daglig 06:00 UTC", nodes: "~52" },
      { key: "shorts", label: "SHORTS", id: "98Jel2bOtd2zDGob", role: "3 shorts fra scriptet, render 9:16, upload YT+FB", trigger: "Kaldes af MASTER", nodes: "16" },
      { key: "trend",  label: "TREND",  id: "qzzhCDiOZ6FyncV2", role: "Scanner finansnyheder dagligt, fylder idé-køen (low-watermark)", trigger: "Daglig 06:00 UTC", nodes: "—" },
      { key: "qc",     label: "QC",     id: "APTIEmT2m3ONvX7O", role: "Compliance/redaktionel gatekeeper, scorer mod rubric", trigger: "Manuel test + kaldes af MASTER", nodes: "—" },
    ],
    dataTables: [
      { name: "videos",  id: "u4l7relLP5RYKdv2", desc: "video_id, case_id, title, status, script_json, urls" },
      { name: "ideas",   id: "fyNFjFIXaHME4h6b", desc: "id, case_id, title, hook, source, status, priority" },
      { name: "costlog", id: "r5fTAV7teiqSsxS4", desc: "video_id, step, model, usd_cost, ts" },
      { name: "qc_log",  id: "3BoyrX2ZIdTeYMvw", desc: "case_id, title, verdict, overall, compliance, flags, ts" },
    ],
    refs: [
      { k: "ElevenLabs voice-ID", v: "UmQN7jS1Ee8B1czsUtQh" },
      { k: "ElevenLabs model", v: "eleven_multilingual_v2" },
      { k: "Billedmodel", v: "gemini-3.1-flash-image (Nano Banana 2)" },
      { k: "Script-model", v: "claude-sonnet-4-6" },
      { k: "Facebook Page-ID", v: "1117005634835655" },
      { k: "GCP-projekt", v: "ethereal-bison-499116-e2 (somi-engine)" },
      { k: "Render-server", v: "212.147.240.185:8080" },
      { k: "n8n-projekt", v: "C7PCi9TKnRc6Idan · UTC" },
    ],
    queue: [
      { id: "c1", name: "Enron", status: "live" },
      { id: "c2", name: "Bernie Madoff", status: "live" },
      { id: "c3", name: "FTX / SBF", status: "live" },
      { id: "c4", name: "Wirecard", status: "live" },
      { id: "c5", name: "Theranos", status: "live" },
      { id: "c6", name: "Barings / Nick Leeson", status: "next" },
      { id: "c7", name: "Archegos / Bill Hwang", status: "queued" },
      { id: "c8", name: "OneCoin / Cryptoqueen", status: "queued" },
      { id: "c9", name: "LTCM", status: "queued" },
      { id: "c10", name: "Danske Bank / Estland", status: "queued" },
      { id: "c11", name: "Andrew Left / Citron", status: "queued" },
      { id: "c12", name: "Murrell", status: "queued" },
      { id: "c13", name: "Easterday cattle-Ponzi", status: "queued" },
      { id: "c14", name: "JAFCU", status: "queued" },
      { id: "c15", name: "Toshiba", status: "queued" },
      { id: "c16", name: "Boilermakers", status: "queued" },
    ],
  },
  {
    id: "ch2", name: "Engineering Disasters", niche: "Megaprojekter & ingeniør-fiaskoer",
    handle: "—", status: "planned", pipeStatus: "idle", accent: "#6E8BA6", initial: "ED",
    n8nBase: "", masterWf: "", shortsWf: "", ytStudio: "", fb: "",
    qcMode: "shadow", jafcuPaused: false, renderHealth: "",
    systems: [], dataTables: [], refs: [], queue: [],
  },
];

const CRED_ICON = { mic: Mic, cpu: Cpu, image: ImageIcon, server: Server, radio: Radio };
const SEED_CREDITS = [
  { id: "elevenlabs", name: "ElevenLabs", kind: "Kreditter · stemme", icon: "mic",
    url: "https://elevenlabs.io/app/usage", burn: "~14k tegn/video (long-form + 3 shorts)",
    note: "Plan ~131k tegn/md. Løb tør 2× — hold den fyldt.", status: "lav",
    balance: "", lastTopup: "", runwayChars: "" },
  { id: "anthropic", name: "Anthropic · Claude", kind: "API · scripts", icon: "cpu",
    url: "https://console.anthropic.com/settings/billing", burn: "~$0,30/video",
    note: "Slå auto-reload til så scripts aldrig stopper.", status: "ok", balance: "", lastTopup: "" },
  { id: "gemini", name: "Google AI Studio", kind: "API · billeder", icon: "image",
    url: "https://aistudio.google.com/app/apikey", burn: "~$2–3/video (20–30 billeder)",
    note: "Nano Banana billedgen. Tjek også Google Cloud-billing.", status: "ok", balance: "", lastTopup: "" },
  { id: "n8n", name: "n8n Cloud", kind: "Abonnement · orkestrering", icon: "server",
    url: "https://app.n8n.cloud", burn: "Fast md.-pris",
    note: "Kører hele pipelinen. Alt stopper hvis kontoen lukker.", status: "ok", balance: "", lastTopup: "" },
  { id: "render", name: "Render-server (VPS)", kind: "Server · 212.147.240.185", icon: "server",
    url: "", burn: "Fast md.-pris (hosting)",
    note: "Selv-hostet renderer + Whisper-captions. Betal VPS-regningen.", status: "ok", balance: "", lastTopup: "" },
  { id: "buffer", name: "Buffer", kind: "Abonnement · valgfri", icon: "radio",
    url: "https://publish.buffer.com/settings/billing", burn: "Gratis op til 3 kanaler",
    note: "Reserve til shorts-only projekt. FB kører gratis via Graph API nu.", status: "ok", balance: "", lastTopup: "" },
];

const LINK_GROUPS = [
  { title: "Pipeline · n8n", links: [
    { label: "MASTER workflow", url: "https://madsvalby.app.n8n.cloud/workflow/LvTDjTb8MxEeOJM3" },
    { label: "SHORTS workflow", url: "https://madsvalby.app.n8n.cloud/workflow/98Jel2bOtd2zDGob" },
    { label: "Kørsler (executions)", url: "https://madsvalby.app.n8n.cloud/home/executions" },
    { label: "n8n hjem", url: "https://madsvalby.app.n8n.cloud" },
  ]},
  { title: "Render", links: [
    { label: "Server health", url: "http://212.147.240.185:8080/health" },
  ]},
  { title: "Udgivelse", links: [
    { label: "YouTube Studio", url: "https://studio.youtube.com" },
    { label: "Facebook-side", url: "https://www.facebook.com/1117005634835655" },
    { label: "Google Drive", url: "https://drive.google.com" },
  ]},
  { title: "AI & kreditter", links: [
    { label: "ElevenLabs forbrug", url: "https://elevenlabs.io/app/usage" },
    { label: "Anthropic console", url: "https://console.anthropic.com" },
    { label: "Google AI Studio", url: "https://aistudio.google.com" },
    { label: "Google Cloud billing", url: "https://console.cloud.google.com/billing" },
  ]},
];

const GATE = [
  "Kanal 1 har kørt 30 dage med ≥2 long-form/uge uden manuel indgriben",
  "QC-agent afviser/regenererer selv",
  "Cost-per-video stabil og logget i kostloggen",
  "Mindst ét retention-signal: >5.000 views ELLER >25% watch time",
];

const SEED_COSTS = [
  { id: "k1", channelId: "ch1", case: "Enron", usd: 8 },
  { id: "k2", channelId: "ch1", case: "Bernie Madoff", usd: 8 },
  { id: "k3", channelId: "ch1", case: "FTX / SBF", usd: 8 },
  { id: "k4", channelId: "ch1", case: "Wirecard", usd: 9 },
  { id: "k5", channelId: "ch1", case: "Theranos", usd: 8 },
];
const SEED_EARNINGS = [];
const EARN_SOURCES = [
  { id: "youtube",   label: "YouTube · AdSense" },
  { id: "facebook",  label: "Facebook" },
  { id: "affiliate", label: "Affiliate" },
  { id: "other",     label: "Andet" },
];
const EARN_LABEL = Object.fromEntries(EARN_SOURCES.map((s) => [s.id, s.label]));

const ROADMAP = [
  { t: "QC enforce-flip", d: "Lad QC-dommen gate hovedflowet: reject ⇒ videos.status='needs_review' + spring publicering over, i stedet for passiv shadow-log.", when: "Efter launch-ugen" },
  { t: "JAFCU-håndtering", d: "Pause i ideas indtil enforce er på, eller lad QC fange den når enforce er live. Lander ~9 dage ude ved daglig kadence.", when: "Knyttet til enforce" },
  { t: "Kadence-beslutning", d: "Behold daglig eller drop til 2/uge afhængigt af ElevenLabs-kvote og retention-signaler.", when: "Efter uge 1" },
  { t: "Dashboard (Fase 3)", d: "Port denne kommandocentral til Next.js + Supabase på Vercel. Daglig cron: YouTube Analytics → stats. Spejl data-felterne 1:1.", when: "Fase 3" },
  { t: "Kommentar-AI (Fase 4)", d: "Cron henter kommentarer → Haiku batch-klassificering → ugentlig niche-rapport → godkendte idéer tilbage i ideas. Lukket loop.", when: "Fase 4" },
  { t: "Kanal 2: Engineering Disasters", d: "Klon pipelinen, skift kun stilguide + kø. Først når gate-kriterierne er grønne.", when: "Efter gate" },
];

const WATCH_ITEMS = [
  { t: "ElevenLabs-kvote ved daglig kadence", d: "Daglig brænder hurtigere end 2/uge-planen (~9 videoer/cyklus). Hold runway opdateret under Kreditter.", level: "amber" },
  { t: "qc_log skal fyldes før enforce", d: "Lad shadow-grenen samle rigtige domme og bekræft at den rammer korrekt, før QC flippes til enforce.", level: "neutral" },
  { t: "JAFCU i køen (anklage-stadie)", d: "Priority 14, formuleret 'allegedly'. QC flagger i shadow men stopper den ikke endnu. Overvej pause i ideas.", level: "amber" },
];

const QC_RUBRIC = [
  ["Hook", "Åbner på klimaks-tallet, trækker seeren ind"],
  ["Kilder", "Påstande forankret i dom / tilsyn / regnskab / etableret medie"],
  ["Struktur", "Cold open + 4 kapitler, cliffhanger mellem hvert"],
  ["SEO", "Titel, beskrivelse og tags på plads"],
  ["Compliance", "Levende personer kun via fastslåede fakta"],
];
const QC_READY = [
  "qc_log fyldt med rigtige domme fra produktion",
  "Domme set som korrekte af Mads (rammer rigtigt)",
  "Launch-ugen er ovre",
];

const COST_TARGET_LOW = 5, COST_TARGET_HIGH = 12;
const PIPE_META = {
  idle:      { label: "Inaktiv",    cls: "queued" },
  producing: { label: "Producerer", cls: "lav" },
  published: { label: "Udgivet",    cls: "ok" },
  error:     { label: "Fejl",       cls: "kritisk" },
};
const PIPE_ORDER = ["idle", "producing", "published", "error"];

// Faner grupperet i klynger (vist med skillelinjer i nav'en). Den flade NAV
// nedenfor afledes heraf, så tastatur-genveje (1–n) og index-logik er uændret.
const NAV_GROUPS = [
  { tabs: [
    { id: "overblik", label: "Overblik", Icon: LayoutGrid },
    { id: "udvikling", label: "Udvikling", Icon: Activity },
    { id: "agenter", label: "Agenter", Icon: Bot },
  ] },
  { label: "Drift", tabs: [
    { id: "kanaler", label: "Kanaler", Icon: Radio },
    { id: "ko", label: "Idé-kø", Icon: Flag },
    { id: "opslag", label: "Opslag", Icon: Megaphone },
    { id: "system", label: "System", Icon: Server },
  ] },
  { label: "Økonomi", tabs: [
    { id: "kreditter", label: "Kreditter", Icon: Wallet },
    { id: "okonomi", label: "Økonomi", Icon: Coins },
  ] },
  { label: "Plan", tabs: [
    { id: "byggeplan", label: "Byggeplan", Icon: ListChecks },
    { id: "roadmap", label: "Roadmap", Icon: Milestone },
    { id: "launchpad", label: "Launchpad", Icon: Rocket },
  ] },
];
const NAV = NAV_GROUPS.flatMap((g) => g.tabs);

// ── Opslag/content-strategi (Drift → Opslag) ──
// Ny kadence når video-tempoet skrues ned: hold kanalen aktiv mellem videoer.
const POST_CADENCE = [
  { Icon: Rocket,  k: "Long-form", v: "hver 2.–3. dag", note: "15-min dokumentar — kvalitet > kvantitet" },
  { Icon: Zap,     k: "Short-form", v: "1× dagligt", note: "3 shorts pr. long-form, drypvis udgivet" },
  { Icon: Megaphone, k: "Community / FB", v: "udfyld huller", note: "Hold publikum varmt på ikke-video-dage" },
];
// Per-opslag checkliste. mode=auto ⇒ kan køres i n8n · manual ⇒ ingen API, human-in-the-loop.
const POST_CHECKLIST = [
  { Icon: MessageSquare, t: "Auto-top-kommentar", mode: "auto",
    d: "Pipelinen poster en hook/spørgsmål som top-kommentar på egen video for at starte tråden.",
    api: "YouTube commentThreads.insert · scope youtube.force-ssl (50 quota/kald)" },
  { Icon: Pin, t: "Pin kommentaren", mode: "manual",
    d: "Pin top-kommentaren så den ligger øverst. Ingen API — 5 sek. i Studio.",
    api: "Manuelt i YouTube Studio" },
  { Icon: Megaphone, t: "YouTube community-post", mode: "manual",
    d: "Tekst/billede/poll i community-fanen mellem videoer. Ingen officiel API.",
    api: "Manuelt — n8n kan sende dig en påmindelse med færdig tekst" },
  { Icon: Facebook, t: "Facebook side-opslag", mode: "auto",
    d: "Tekst- eller foto-opslag på siden (klip, citat, bag-om) for at holde aktivitet.",
    api: "Graph API /{page-id}/feed + /photos · pages_manage_posts" },
];

const STATUS_META = {
  ok:      { label: "OK",       cls: "ok" },
  lav:     { label: "LAV",      cls: "lav" },
  kritisk: { label: "KRITISK",  cls: "kritisk" },
};
const STATUS_ORDER = ["ok", "lav", "kritisk"];
const ACCENTS = ["#C9A14E", "#6E8BA6", "#9C7BB0", "#6CAE7E", "#B0563B", "#C98F5E"];

function daysSince(iso) {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86400000);
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function lighten(hex, amt) {
  try {
    const h = String(hex).replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (255 - r) * amt); g = Math.round(g + (255 - g) * amt); b = Math.round(b + (255 - b) * amt);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch (e) { return hex; }
}

export default function SomiCommand() {
  const [tab, setTab] = useState("overblik");
  const [loaded, setLoaded] = useState(false);
  const [save, setSave] = useState(null);

  const [done, setDone] = useState(() => new Set(SEED_DONE));
  const [channels, setChannels] = useState(SEED_CHANNELS);
  const [credits, setCredits] = useState(SEED_CREDITS);
  const [cadence, setCadence] = useState(2);

  const [activeChan, setActiveChan] = useState("ch1");
  const [openGuide, setOpenGuide] = useState(null);
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [addChan, setAddChan] = useState({ open: false, name: "", niche: "", handle: "" });
  const [newIdea, setNewIdea] = useState("");
  const [kpis, setKpis] = useState({ videos: "", views: "", subs: "" });
  const [log, setLog] = useState([]);
  const [newLog, setNewLog] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiIdeas, setAiIdeas] = useState([]);
  const [aiError, setAiError] = useState("");
  const [costs, setCosts] = useState(SEED_COSTS);
  const [newCost, setNewCost] = useState({ case: "", usd: "", channelId: "ch1" });
  const [earnings, setEarnings] = useState(SEED_EARNINGS);
  const [newEarn, setNewEarn] = useState({ source: "youtube", month: new Date().toISOString().slice(0, 7), usd: "", channelId: "ch1" });
  const [econChan, setEconChan] = useState("all");
  const [pipelineAuto, setPipelineAuto] = useState(false);
  const [liveVideos, setLiveVideos] = useState([]); // produktions-kø fra videos-tabellen (read-only)
  const [qcLog, setQcLog] = useState([]);           // seneste QC-domme fra qc_log (read-only)
  const [analytics, setAnalytics] = useState(null); // winner-loop metrics (stats_daily) — KPI-stribe
  const [creditWatch, setCreditWatch] = useState(null); // live credit/budget-status (n8n CREDIT WATCH) — advarsels-banner
  const [queueRefresh, setQueueRefresh] = useState(0); // bump → IdeaQueueBoard genhenter n8n-køen
  const [queueBusy, setQueueBusy] = useState(false);
  const [channelStats, setChannelStats] = useState(null); // ægte kanal-totaler (YouTube Data API)
  const [kpiPlatform, setKpiPlatform] = useState("samlet"); // Samlet | youtube | facebook

  // ── Load ──
  useEffect(() => {
    (async () => {
      const [d, ch, cr, ca, kp, lg, ac, co, ea] = await Promise.all([
        loadKey(K_CHECK, null), loadKey(K_CHAN, null), loadKey(K_CRED, null),
        loadKey(K_CAD, null), loadKey(K_KPI, null), loadKey(K_LOG, null),
        loadKey(K_ACTIVE, null), loadKey(K_COSTS, null), loadKey(K_EARN, null),
      ]);
      if (d && Array.isArray(d.done)) setDone(new Set(d.done));
      if (Array.isArray(ch) && ch.length) setChannels(ch);
      if (Array.isArray(cr) && cr.length) setCredits(cr);
      if (typeof ca === "number") setCadence(ca);
      if (kp && typeof kp === "object") setKpis({ videos: "", views: "", subs: "", ...kp });
      if (Array.isArray(lg)) setLog(lg);
      if (typeof ac === "string") setActiveChan(ac);
      if (Array.isArray(co)) {
        setCosts(co);
      } else {
        // migrér evt. gamle (v1) kostlinjer → tilskriv ch1
        const old = await loadKey("somi_costs_v1", null);
        if (Array.isArray(old) && old.length) {
          const mig = old.map((c) => ({ ...c, channelId: c.channelId || "ch1" }));
          setCosts(mig); saveKey(K_COSTS, mig);
        }
      }
      if (Array.isArray(ea)) setEarnings(ea);

      // Tabel-drevet økonomi (n8n-sync + YouTube-cron). Overskriver manuel KV når der findes pipeline-data.
      try {
        const pres = await fetch("/api/pipeline");
        if (pres.ok) {
          const pj = await pres.json();
          if (Array.isArray(pj.costs) && pj.costs.length) setCosts(pj.costs);
          if (Array.isArray(pj.earnings) && pj.earnings.length) setEarnings(pj.earnings);
          if (Array.isArray(pj.queue)) setLiveVideos(pj.queue);
          if (Array.isArray(pj.qc)) setQcLog(pj.qc);
          setPipelineAuto(!!(pj.counts && (pj.counts.costlog || pj.counts.earnings)));
        }
      } catch (e) { /* pipeline ikke tilgængelig — behold manuel/KV */ }

      // KPI-stribe: live nøgletal fra stats_daily (winner-loop). Tom indtil kanalen får views.
      try {
        const ares = await fetch("/api/analytics");
        if (ares.ok) setAnalytics(await ares.json());
      } catch (e) { /* analytics ikke tilgængelig — KPI falder tilbage til manuel */ }

      // Credit/budget-status (n8n CREDIT WATCH → credits-tabel). Tom indtil workflowet har kørt.
      try {
        const cres = await fetch("/api/credits");
        if (cres.ok) setCreditWatch(await cres.json());
      } catch (e) { /* credits ikke tilgængelige — intet banner */ }

      // Ægte kanal-totaler (abonnenter/visninger/videoer) fra YouTube Data API (self-række).
      try {
        const cres = await fetch("/api/competitors");
        if (cres.ok) {
          const cj = await cres.json();
          const self = (cj.competitors || []).find((c) => c.isSelf);
          setChannelStats({
            yt: self ? { videos: self.videos, views: self.views, subs: self.subs } : null,
            fb: null, // Facebook-stats kobles på senere
          });
        }
      } catch (e) { /* kanal-stats ikke tilgængelige */ }

      setLoaded(true);
    })();
  }, []);

  // ── Tastatur: 1–6 skifter fane ──
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || e.metaKey || e.ctrlKey || e.altKey) return;
      const i = parseInt(e.key, 10);
      if (i >= 1 && i <= NAV.length) setTab(NAV[i - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const flash = useCallback(() => {
    setSave("saved");
    window.clearTimeout(flash._t);
    flash._t = window.setTimeout(() => setSave(null), 1500);
  }, []);

  const persist = useCallback((key, value) => { saveKey(key, value).then((ok) => ok && flash()); }, [flash]);

  // ── Checklist ──
  const toggleStep = (id) => setDone((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    persist(K_CHECK, { done: Array.from(next) });
    return next;
  });
  const togglePhase = (id) => setCollapsed((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const resetChecklist = () => {
    if (!window.confirm("Nulstil byggeplanen? Al afkrydsning slettes.")) return;
    const empty = new Set(); setDone(empty); persist(K_CHECK, { done: [] });
  };

  // ── Credits ──
  const patchCredit = (id, patch) => setCredits((prev) => {
    const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
    persist(K_CRED, next); return next;
  });
  const cycleStatus = (id) => {
    const c = credits.find((x) => x.id === id); if (!c) return;
    const i = STATUS_ORDER.indexOf(c.status || "ok");
    patchCredit(id, { status: STATUS_ORDER[(i + 1) % STATUS_ORDER.length] });
  };
  const markTopup = (id) => patchCredit(id, { lastTopup: todayISO(), status: "ok" });
  const setCad = (v) => { const n = Math.max(0, Number(v) || 0); setCadence(n); persist(K_CAD, n); };

  // ── Channels ──
  const patchChannel = (id, patch) => setChannels((prev) => {
    const next = prev.map((c) => (c.id === id ? { ...c, ...patch } : c));
    persist(K_CHAN, next); return next;
  });
  const pickChannel = (id) => { setActiveChan(id); persist(K_ACTIVE, id); };
  const cycleChanStatus = (id) => {
    const order = ["planned", "building", "live"];
    const c = channels.find((x) => x.id === id); if (!c) return;
    const i = order.indexOf(c.status || "planned");
    patchChannel(id, { status: order[(i + 1) % order.length] });
  };
  const cyclePipe = (id) => {
    const c = channels.find((x) => x.id === id); if (!c) return;
    const i = PIPE_ORDER.indexOf(c.pipeStatus || "idle");
    patchChannel(id, { pipeStatus: PIPE_ORDER[(i + 1) % PIPE_ORDER.length] });
  };
  const toggleQcMode = (id) => {
    const c = channels.find((x) => x.id === id); if (!c) return;
    patchChannel(id, { qcMode: c.qcMode === "enforce" ? "shadow" : "enforce" });
  };
  const toggleJafcu = (id) => {
    const c = channels.find((x) => x.id === id); if (!c) return;
    patchChannel(id, { jafcuPaused: !c.jafcuPaused });
  };
  const commitAddChannel = () => {
    const name = addChan.name.trim(); if (!name) return;
    const id = "ch" + Date.now();
    const accent = ACCENTS[channels.length % ACCENTS.length];
    const initial = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const ch = { id, name, niche: addChan.niche.trim(), handle: addChan.handle.trim() || "—",
      status: "planned", pipeStatus: "idle", accent, initial, masterWf: "", shortsWf: "", ytStudio: "", fb: "", queue: [] };
    const next = [...channels, ch];
    setChannels(next); persist(K_CHAN, next);
    setAddChan({ open: false, name: "", niche: "", handle: "" });
    setActiveChan(id); persist(K_ACTIVE, id);
  };
  const removeChannel = (id) => {
    if (id === "ch1") return;
    if (!window.confirm("Fjern denne kanal fra overblikket?")) return;
    const next = channels.filter((c) => c.id !== id);
    setChannels(next); persist(K_CHAN, next);
    if (activeChan === id) { const nid = next[0]?.id || ""; setActiveChan(nid); persist(K_ACTIVE, nid); }
  };

  // ── Queue (per channel) ──
  const channel = channels.find((c) => c.id === activeChan) || channels[0];
  const cycleCase = (chId, caseId) => {
    const order = ["queued", "next", "live"];
    setChannels((prev) => {
      const next = prev.map((c) => {
        if (c.id !== chId) return c;
        return { ...c, queue: c.queue.map((q) => q.id === caseId
          ? { ...q, status: order[(order.indexOf(q.status) + 1) % order.length] } : q) };
      });
      persist(K_CHAN, next); return next;
    });
  };
  const addIdea = (chId) => {
    const name = newIdea.trim(); if (!name) return;
    setChannels((prev) => {
      const next = prev.map((c) => c.id === chId
        ? { ...c, queue: [...c.queue, { id: "c" + Date.now(), name, status: "queued" }] } : c);
      persist(K_CHAN, next); return next;
    });
    setNewIdea("");
  };
  const removeIdea = (chId, caseId) => setChannels((prev) => {
    const next = prev.map((c) => c.id === chId ? { ...c, queue: c.queue.filter((q) => q.id !== caseId) } : c);
    persist(K_CHAN, next); return next;
  });

  // ── Nøgletal / log / AI / eksport ──
  const patchKpi = (patch) => setKpis((prev) => { const next = { ...prev, ...patch }; persist(K_KPI, next); return next; });
  const addLog = () => {
    const text = newLog.trim(); if (!text) return;
    setLog((prev) => { const next = [{ ts: Date.now(), text }, ...prev].slice(0, 50); persist(K_LOG, next); return next; });
    setNewLog("");
  };
  const removeLog = (ts) => setLog((prev) => { const next = prev.filter((e) => e.ts !== ts); persist(K_LOG, next); return next; });

  const addNamedIdea = (chId, name) => setChannels((prev) => {
    const next = prev.map((c) => c.id === chId
      ? { ...c, queue: [...c.queue, { id: "c" + Date.now() + Math.random().toString(36).slice(2, 5), name, status: "queued" }] } : c);
    persist(K_CHAN, next); return next;
  });

  const generateIdeas = async () => {
    if (!channel) return;
    setAiBusy(true); setAiError(""); setAiIdeas([]);
    try {
      const existing = channel.queue.map((q) => q.name).join(", ");
      const prompt = `You research cases for a YouTube documentary channel.
Niche: ${channel.niche || channel.name}.
Already covered (do NOT repeat any of these): ${existing || "none yet"}.
Suggest 6 NEW, real, well-documented cases that fit this niche and would make gripping 15-minute documentaries. Each needs a short title (the company, person, or event) and a one-line hook angle of max 12 words. Return ONLY a JSON array, no markdown fences, shaped exactly like: [{"name":"...","hook":"..."}]`;
      const res = await fetch("/api/anthropic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const s = text.indexOf("["), e = text.lastIndexOf("]");
      if (s >= 0 && e > s) text = text.slice(s, e + 1);
      const ideas = JSON.parse(text);
      const clean = Array.isArray(ideas) ? ideas.filter((x) => x && x.name).slice(0, 8) : [];
      setAiIdeas(clean);
      if (clean.length === 0) setAiError("Ingen forslag kom retur. Prøv igen.");
    } catch (err) {
      setAiError("Kunne ikke hente forslag lige nu. Prøv igen om lidt.");
    } finally { setAiBusy(false); }
  };
  const acceptIdea = (idea) => { addNamedIdea(channel.id, idea.name); setAiIdeas((prev) => prev.filter((x) => x !== idea)); };

  // ── n8n-kø (Idé-kø-fanen er nu n8n-drevet) ──
  // Skriver sager direkte i ideas-tabellen (status='proposed') + pusher til n8n,
  // og beder IdeaQueueBoard om at genhente.
  const pushIdeaToQueue = async (ideas, source) => {
    setQueueBusy(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas, source }),
      });
      if (res.ok) setQueueRefresh((n) => n + 1);
      return res.ok;
    } catch (e) { return false; } finally { setQueueBusy(false); }
  };
  const addCaseToQueue = async () => {
    const name = newIdea.trim(); if (!name) return;
    const ok = await pushIdeaToQueue([{ name }], "manuel");
    if (ok) setNewIdea("");
  };
  const acceptIdeaToQueue = async (idea) => {
    const ok = await pushIdeaToQueue([idea], "ai-forslag");
    if (ok) setAiIdeas((prev) => prev.filter((x) => x !== idea));
  };

  const exportData = () => {
    try {
      const dump = { exported: new Date().toISOString(), checklist: Array.from(done), channels, credits, cadence, kpis, log, costs, earnings };
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "somi-command-backup.json";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { /* download ikke muligt her */ }
  };

  const addCost = () => {
    const cs = newCost.case.trim(); const v = parseFloat(newCost.usd);
    if (!cs || isNaN(v)) return;
    const chId = econChan === "all" ? (newCost.channelId || "ch1") : econChan;
    setCosts((prev) => { const next = [...prev, { id: "k" + Date.now(), channelId: chId, case: cs, usd: Math.round(v * 100) / 100 }]; persist(K_COSTS, next); return next; });
    setNewCost({ case: "", usd: "", channelId: chId });
  };
  const removeCost = (id) => setCosts((prev) => { const next = prev.filter((c) => c.id !== id); persist(K_COSTS, next); return next; });

  const addEarning = () => {
    const v = parseFloat(newEarn.usd);
    if (isNaN(v)) return;
    const chId = econChan === "all" ? (newEarn.channelId || "ch1") : econChan;
    setEarnings((prev) => {
      const next = [...prev, { id: "e" + Date.now(), channelId: chId, source: newEarn.source, month: newEarn.month || new Date().toISOString().slice(0, 7), usd: Math.round(v * 100) / 100 }];
      persist(K_EARN, next); return next;
    });
    setNewEarn({ ...newEarn, usd: "" });
  };
  const removeEarning = (id) => setEarnings((prev) => { const next = prev.filter((e) => e.id !== id); persist(K_EARN, next); return next; });

  // ── Derived ──
  const doneCount = ALL_STEPS.filter((s) => done.has(s.id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);
  const alerts = credits.filter((c) => c.status === "lav" || c.status === "kritisk");
  const liveChannels = channels.filter((c) => c.status === "live").length;
  const monthlyChars = Math.round(cadence * 4.33 * 14000);
  const planPct = Math.round((monthlyChars / 131000) * 100);
  const monthlyUsd = Math.round(cadence * 4.33 * 8);
  const gateDone = GATE.filter((_, i) => done.has("gate" + i)).length;
  const rmDone = ROADMAP.filter((_, i) => done.has("rm" + i)).length;
  const qcrDone = QC_READY.filter((_, i) => done.has("qcr" + i)).length;
  const themeAccent = (channel && channel.accent) || "#C9A14E";
  const themeBright = lighten(themeAccent, 0.22);

  // ── Økonomi (scoped: enkelt kanal eller samlet) ──
  const sum = (arr) => arr.reduce((a, x) => a + (Number(x.usd) || 0), 0);
  const econScope = econChan === "all" ? null : econChan;
  const fCosts = econScope ? costs.filter((c) => c.channelId === econScope) : costs;
  const fEarn = econScope ? earnings.filter((e) => e.channelId === econScope) : earnings;
  const earnTotal = sum(fEarn);
  const costTotal = sum(fCosts);
  const netTotal = earnTotal - costTotal;
  const costAvg = fCosts.length ? costTotal / fCosts.length : 0;
  const costMax = fCosts.reduce((m, c) => Math.max(m, Number(c.usd) || 0), 0);
  const bySource = EARN_SOURCES.map((s) => ({ ...s, usd: sum(fEarn.filter((e) => e.source === s.id)) }));
  const srcMax = bySource.reduce((m, s) => Math.max(m, s.usd), 0);
  const rollup = channels.map((c) => {
    const ce = sum(earnings.filter((e) => e.channelId === c.id));
    const cc = sum(costs.filter((x) => x.channelId === c.id));
    return { id: c.id, name: c.name, accent: c.accent, earn: ce, cost: cc, net: ce - cc };
  });
  const grandEarn = sum(earnings);
  const grandCost = sum(costs);
  const grandNet = grandEarn - grandCost;

  return (
    <div className="sc-root" style={{ "--gold": themeAccent, "--gold-bright": themeBright }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .sc-root {
          /* Lyst/guld hybrid-tema. --ink = mørk (tekst + tekst-på-guld). --bg/--field = lyse flader. */
          --bg:#F6F7FB; --panel:#FFFFFF; --panel2:#F1F3F8; --field:#F4F5F8;
          --line:rgba(15,23,42,0.10); --line-soft:rgba(15,23,42,0.06);
          --ink:#141821; --num:#14181F;
          --bone:#1F2530; --bone-dim:#5B6473; --bone-faint:#97A0AF;
          --gold:#C9A14E; --gold-bright:#D7B26A; --green:#3E9D5E; --rust:#B0492C; --amber:#B7822B;
          --serif:'Fraunces',Georgia,serif; --sans:'Inter',-apple-system,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace;
          min-height:100vh; background:var(--bg); color:var(--bone); font-family:var(--sans); -webkit-font-smoothing:antialiased;
        }
        .sc-shell { max-width:1600px; margin:0 auto; padding:0 40px 90px; }
        .sc-root *::selection { background:rgba(201,161,78,0.3); }

        .sc-mast { padding:36px 0 0; display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap; }
        .sc-eyebrow { font-family:var(--mono); font-size:11px; letter-spacing:0.22em; color:var(--gold); text-transform:uppercase; }
        .sc-h1 { font-family:var(--serif); font-weight:600; font-size:clamp(32px,5.5vw,48px); line-height:1.02; margin:10px 0 0; letter-spacing:-0.01em; }
        .sc-mast-meta { font-family:var(--mono); font-size:11px; color:var(--bone-faint); letter-spacing:0.1em; text-align:right; }
        .sc-mast-meta b { color:var(--bone-dim); font-weight:500; }
        .sc-save { display:inline-flex; align-items:center; gap:6px; color:var(--green); }

        .sc-nav { display:flex; flex-wrap:wrap; gap:4px; margin-top:24px; border-bottom:1px solid var(--line); }
        .sc-tab { font-family:var(--mono); font-size:12px; letter-spacing:0.06em; padding:11px 13px 13px; background:none; border:none;
          cursor:pointer; color:var(--bone-faint); display:flex; align-items:center; gap:7px; border-bottom:2px solid transparent; white-space:nowrap; }
        .sc-tab:hover { color:var(--bone-dim); }
        .sc-tab.active { color:var(--bone); border-bottom-color:var(--gold); }
        .sc-nav-sep { align-self:center; width:1px; height:15px; background:var(--line); margin:0 8px 4px; flex-shrink:0; }

        .sc-section-label { font-family:var(--mono); font-size:10px; letter-spacing:0.26em; color:var(--gold); text-transform:uppercase;
          display:flex; align-items:center; gap:8px; margin:30px 0 14px; }
        .sc-section-label::before { content:""; width:22px; height:1px; background:var(--gold); }
        .sc-lede { color:var(--bone-dim); font-size:13.5px; line-height:1.6; margin:0 0 18px; max-width:64ch; }

        /* KPI strip */
        .sc-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-top:24px; }
        .sc-kpi { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:16px 18px; }
        .sc-kpi-num { font-family:var(--mono); font-size:28px; font-weight:600; color:var(--num); line-height:1; }
        .sc-kpi-lbl { font-family:var(--mono); font-size:10px; letter-spacing:0.13em; color:var(--bone-dim); text-transform:uppercase; margin-top:8px; }

        /* Alerts */
        .sc-alert { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:10px; margin-bottom:10px;
          background:linear-gradient(180deg,rgba(176,86,59,0.14),rgba(176,86,59,0.05)); border:1px solid rgba(176,86,59,0.4); }
        .sc-alert.amber { background:linear-gradient(180deg,rgba(210,154,74,0.13),rgba(210,154,74,0.04)); border-color:rgba(210,154,74,0.4); }
        .sc-alert-ic { flex-shrink:0; color:var(--rust); }
        .sc-alert.amber .sc-alert-ic { color:var(--amber); }
        .sc-alert-body { flex:1; min-width:0; }
        .sc-alert-t { font-size:14px; font-weight:600; }
        .sc-alert-d { font-size:12.5px; color:var(--bone-dim); margin-top:2px; }
        .sc-alert-ok { display:flex; align-items:center; gap:10px; padding:14px 16px; border-radius:10px; background:var(--panel);
          border:1px solid rgba(108,174,126,0.3); color:var(--green); font-size:13.5px; }

        /* Generic link button */
        .sc-link { display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:11.5px; letter-spacing:0.04em;
          background:var(--gold); color:var(--ink); border:none; border-radius:6px; padding:8px 12px; cursor:pointer; font-weight:600;
          text-decoration:none; flex-shrink:0; }
        .sc-link:hover { background:var(--gold-bright); }
        .sc-link.ghost { background:none; color:var(--bone-dim); border:1px solid var(--line); }
        .sc-link.ghost:hover { color:var(--gold); border-color:var(--gold); }
        .sc-link.ghost.disabled { opacity:0.4; pointer-events:none; }

        /* Channels */
        .sc-chan-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:14px; }
        .sc-chan { position:relative; background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:18px 18px 16px;
          overflow:hidden; }
        .sc-chan::before { content:""; position:absolute; left:0; top:0; bottom:0; width:3px; background:var(--ch-accent,var(--gold)); }
        .sc-chan-head { display:flex; align-items:center; gap:13px; }
        .sc-chan-badge { width:42px; height:42px; flex-shrink:0; border-radius:9px; display:flex; align-items:center; justify-content:center;
          font-family:var(--serif); font-weight:600; font-size:17px; color:var(--ink); background:var(--ch-accent,var(--gold)); }
        .sc-chan-name { font-family:var(--serif); font-size:18px; font-weight:600; line-height:1.1; }
        .sc-chan-niche { font-family:var(--mono); font-size:10px; letter-spacing:0.08em; color:var(--bone-dim); text-transform:uppercase; margin-top:4px; }
        .sc-chan-row { display:flex; align-items:center; gap:8px; margin-top:14px; flex-wrap:wrap; }
        .sc-chan-handle { font-family:var(--mono); font-size:11px; color:var(--bone-faint); margin-top:12px; }
        .sc-chan-links { display:flex; gap:6px; margin-top:12px; flex-wrap:wrap; }
        .sc-chan-del { position:absolute; top:12px; right:12px; background:none; border:none; color:var(--bone-faint); cursor:pointer; padding:4px; border-radius:5px; }
        .sc-chan-del:hover { color:var(--rust); }
        .sc-chan.add { display:flex; align-items:center; justify-content:center; border-style:dashed; cursor:pointer; min-height:120px;
          color:var(--bone-dim); font-family:var(--mono); font-size:13px; letter-spacing:0.06em; gap:9px; }
        .sc-chan.add:hover { border-color:var(--gold); color:var(--gold); }

        .sc-pill { font-family:var(--mono); font-size:9.5px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
          padding:4px 8px; border-radius:5px; border:1px solid; cursor:pointer; background:none; }
        .sc-pill.live, .sc-pill.ok { color:var(--green); border-color:rgba(108,174,126,0.5); }
        .sc-pill.building, .sc-pill.lav, .sc-pill.next { color:var(--amber); border-color:rgba(210,154,74,0.5); }
        .sc-pill.planned, .sc-pill.queued { color:var(--bone-faint); border-color:var(--line); }
        .sc-pill.kritisk { color:var(--rust); border-color:rgba(176,86,59,0.5); }
        .sc-pill.static { cursor:default; }

        /* Add form */
        .sc-form { background:var(--panel2); border:1px solid var(--line); border-radius:12px; padding:18px; margin-bottom:14px; display:grid; gap:10px; }
        .sc-input { background:var(--field); border:1px solid var(--line); border-radius:7px; padding:10px 12px; color:var(--bone);
          font-family:var(--sans); font-size:13.5px; width:100%; }
        .sc-input:focus { outline:none; border-color:var(--gold); }
        .sc-input.mono { font-family:var(--mono); font-size:13px; }
        .sc-form-row { display:flex; gap:8px; }
        .sc-btn { font-family:var(--mono); font-size:12px; letter-spacing:0.05em; border-radius:7px; padding:10px 14px; cursor:pointer; font-weight:600; border:none; }
        .sc-btn.primary { background:var(--gold); color:var(--ink); }
        .sc-btn.primary:hover { background:var(--gold-bright); }
        .sc-btn.ghost { background:none; color:var(--bone-dim); border:1px solid var(--line); }
        .sc-btn.ghost:hover { color:var(--bone); border-color:var(--bone-faint); }

        /* Credits */
        .sc-cred-bar { display:flex; align-items:center; gap:16px; flex-wrap:wrap; background:var(--panel); border:1px solid var(--line);
          border-radius:10px; padding:14px 18px; margin-bottom:16px; }
        .sc-cred-bar .blk { display:flex; flex-direction:column; gap:3px; }
        .sc-cred-bar .blk .v { font-family:var(--mono); font-size:18px; font-weight:600; color:var(--num); }
        .sc-cred-bar .blk .l { font-family:var(--mono); font-size:9.5px; letter-spacing:0.12em; color:var(--bone-dim); text-transform:uppercase; }
        .sc-cad { display:flex; align-items:center; gap:8px; margin-left:auto; }
        .sc-cad input { width:54px; background:var(--field); border:1px solid var(--line); border-radius:6px; padding:7px 8px; color:var(--bone);
          font-family:var(--mono); font-size:14px; text-align:center; }
        .sc-cad input:focus { outline:none; border-color:var(--gold); }
        .sc-cad span { font-family:var(--mono); font-size:11px; color:var(--bone-dim); letter-spacing:0.06em; }

        .sc-cred { background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:16px 18px; margin-bottom:12px; }
        .sc-cred.warn { border-color:rgba(210,154,74,0.45); }
        .sc-cred.crit { border-color:rgba(176,86,59,0.5); }
        .sc-cred-top { display:flex; align-items:flex-start; gap:13px; }
        .sc-cred-ic { width:38px; height:38px; flex-shrink:0; border-radius:9px; background:var(--panel2); border:1px solid var(--line);
          display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .sc-cred-name { font-family:var(--serif); font-size:16.5px; font-weight:600; line-height:1.1; }
        .sc-cred-kind { font-family:var(--mono); font-size:10px; letter-spacing:0.08em; color:var(--bone-dim); text-transform:uppercase; margin-top:4px; }
        .sc-cred-actions { margin-left:auto; display:flex; align-items:center; gap:8px; }
        .sc-cred-note { font-size:12.5px; color:var(--bone-dim); line-height:1.5; margin-top:11px; }
        .sc-cred-burn { font-family:var(--mono); font-size:11px; color:var(--bone-faint); margin-top:6px; letter-spacing:0.02em; }
        .sc-cred-foot { display:flex; align-items:center; gap:10px; margin-top:13px; flex-wrap:wrap; }
        .sc-cred-foot .since { font-family:var(--mono); font-size:10.5px; color:var(--bone-faint); letter-spacing:0.06em; }
        .sc-topup { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:11px; letter-spacing:0.04em;
          background:none; border:1px solid var(--line); color:var(--bone-dim); border-radius:6px; padding:7px 11px; cursor:pointer; }
        .sc-topup:hover { color:var(--green); border-color:rgba(108,174,126,0.5); }
        .sc-runway { display:flex; align-items:center; gap:10px; margin-top:13px; padding-top:13px; border-top:1px dashed var(--line); flex-wrap:wrap; }
        .sc-runway input { width:110px; background:var(--field); border:1px solid var(--line); border-radius:6px; padding:7px 9px; color:var(--bone);
          font-family:var(--mono); font-size:12.5px; }
        .sc-runway input:focus { outline:none; border-color:var(--gold); }
        .sc-runway .out { font-family:var(--mono); font-size:12px; }
        .sc-runway .out b { color:var(--num); font-size:15px; }

        /* Launchpad */
        .sc-lp-group { margin-bottom:8px; }
        .sc-lp-title { font-family:var(--mono); font-size:10px; letter-spacing:0.18em; color:var(--bone-faint); text-transform:uppercase; margin:18px 0 8px; }
        .sc-lp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:8px; }
        .sc-lp-link { display:flex; align-items:center; justify-content:space-between; gap:10px; background:var(--panel); border:1px solid var(--line);
          border-radius:9px; padding:13px 15px; text-decoration:none; color:var(--bone); transition:border-color 160ms; }
        .sc-lp-link:hover { border-color:var(--gold); }
        .sc-lp-link span { font-size:13.5px; font-weight:500; }
        .sc-lp-link svg { color:var(--bone-faint); flex-shrink:0; }
        .sc-lp-link:hover svg { color:var(--gold); }

        /* Gate */
        .sc-gate { background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:20px; }
        .sc-gate-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:6px; }
        .sc-gate-h { font-family:var(--serif); font-size:18px; font-weight:600; }
        .sc-gate-meta { font-family:var(--mono); font-size:11px; color:var(--bone-dim); letter-spacing:0.08em; }
        .sc-gate-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-top:1px solid var(--line-soft); }
        .sc-gate-item:first-of-type { border-top:none; }
        .sc-gate-txt { font-size:13.5px; line-height:1.5; color:var(--bone-dim); }
        .sc-gate-item.on .sc-gate-txt { color:var(--bone); }

        /* Checklist (byggeplan) */
        .sc-ledger { margin-top:8px; padding:18px 20px; background:var(--panel); border:1px solid var(--line); border-radius:10px;
          display:flex; align-items:center; gap:20px; flex-wrap:wrap; }
        .sc-ledger-num { font-family:var(--mono); font-size:30px; font-weight:600; color:var(--num); line-height:1; min-width:78px; }
        .sc-ledger-meta { font-family:var(--mono); font-size:10.5px; letter-spacing:0.13em; color:var(--bone-dim); text-transform:uppercase; margin-top:6px; }
        .sc-bar { flex:1 1 200px; height:4px; background:var(--line-soft); border-radius:2px; overflow:hidden; }
        .sc-bar-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold-bright)); border-radius:2px; transition:width 420ms ease; }
        .sc-next { margin-top:16px; padding:20px 22px; background:linear-gradient(180deg,var(--panel2),var(--panel)); border:1px solid var(--gold); border-radius:10px; }
        .sc-next-label { font-family:var(--mono); font-size:10px; letter-spacing:0.24em; color:var(--gold); text-transform:uppercase; display:flex; align-items:center; gap:8px; }
        .sc-next-label::before { content:""; width:20px; height:1px; background:var(--gold); }
        .sc-next-title { font-family:var(--serif); font-size:21px; font-weight:600; margin-top:9px; }
        .sc-next-meta { font-family:var(--mono); font-size:11px; color:var(--bone-dim); letter-spacing:0.09em; margin-top:6px; text-transform:uppercase; }
        .sc-next-desc { color:var(--bone-dim); font-size:13.5px; line-height:1.55; margin-top:8px; max-width:60ch; }
        .sc-next-btn { margin-top:15px; display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:12px; letter-spacing:0.06em;
          background:var(--gold); color:var(--ink); border:none; border-radius:6px; padding:10px 15px; cursor:pointer; font-weight:600; }
        .sc-next-btn:hover { background:var(--gold-bright); }
        .sc-done-all { font-family:var(--serif); font-size:20px; color:var(--green); }

        .sc-phase { margin-top:14px; background:var(--panel); border:1px solid var(--line); border-radius:10px; position:relative; overflow:hidden; }
        .sc-phase.complete { border-color:rgba(108,174,126,0.35); }
        .sc-phase-head { width:100%; text-align:left; background:none; border:none; cursor:pointer; padding:16px 20px; display:flex; align-items:center; gap:14px; color:var(--bone); }
        .sc-sagnr { font-family:var(--mono); font-size:11px; letter-spacing:0.16em; color:var(--gold); min-width:56px; }
        .sc-phase-title { font-family:var(--serif); font-size:18px; font-weight:600; flex:1; }
        .sc-phase-meta { font-family:var(--mono); font-size:11px; color:var(--bone-dim); letter-spacing:0.09em; display:flex; align-items:center; gap:13px; }
        .sc-chev { color:var(--bone-faint); transition:transform 220ms ease; }
        .sc-chev.open { transform:rotate(180deg); }
        .sc-phase-bar { height:3px; background:var(--line-soft); }
        .sc-phase-fill { height:100%; background:var(--gold); transition:width 420ms ease; }
        .sc-phase.complete .sc-phase-fill { background:var(--green); }
        .sc-stamp { position:absolute; top:13px; right:18px; transform:rotate(-7deg); font-family:var(--mono); font-size:10px; font-weight:600;
          letter-spacing:0.28em; color:var(--green); border:1.5px solid var(--green); border-radius:4px; padding:4px 9px 4px 11px; opacity:0.85; pointer-events:none; }
        .sc-steps { border-top:1px solid var(--line-soft); }
        .sc-step { border-bottom:1px solid var(--line-soft); }
        .sc-step:last-child { border-bottom:none; }
        .sc-step-row { display:flex; align-items:flex-start; gap:14px; padding:13px 20px; }
        .sc-check { flex-shrink:0; width:20px; height:20px; margin-top:2px; border:1.5px solid var(--bone-faint); border-radius:4px; background:none;
          cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--ink); transition:all 160ms; }
        .sc-check:hover { border-color:var(--gold); }
        .sc-check.on { background:var(--gold); border-color:var(--gold); }
        .sc-step-body { flex:1; min-width:0; }
        .sc-step-title { font-size:14px; font-weight:500; line-height:1.4; }
        .sc-step.done .sc-step-title { color:var(--bone-faint); text-decoration:line-through; }
        .sc-step-desc { font-size:12.5px; color:var(--bone-dim); line-height:1.5; margin-top:3px; }
        .sc-step.done .sc-step-desc { color:var(--bone-faint); }
        .sc-guide-btn { flex-shrink:0; background:none; border:none; cursor:pointer; color:var(--bone-faint); padding:4px; border-radius:4px; transition:transform 200ms; }
        .sc-guide-btn:hover { color:var(--gold); }
        .sc-guide-btn.open { transform:rotate(180deg); color:var(--gold); }
        .sc-guide { margin:0 20px 16px 54px; padding:12px 16px; background:var(--field); border-left:2px solid var(--gold); border-radius:0 6px 6px 0; }
        .sc-guide li { font-size:12.5px; color:var(--bone-dim); line-height:1.6; list-style:none; padding-left:18px; position:relative; margin-bottom:6px; }
        .sc-guide li:last-child { margin-bottom:0; }
        .sc-guide li::before { content:"→"; position:absolute; left:0; color:var(--gold); font-family:var(--mono); font-size:11px; top:2px; }

        .sc-foot { margin-top:34px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; }
        .sc-foot-note { font-family:var(--mono); font-size:10.5px; letter-spacing:0.1em; color:var(--bone-faint); text-transform:uppercase; }
        .sc-reset { display:inline-flex; align-items:center; gap:7px; background:none; border:1px solid var(--line); border-radius:6px; padding:8px 12px;
          font-family:var(--mono); font-size:11px; letter-spacing:0.06em; color:var(--bone-faint); cursor:pointer; }
        .sc-reset:hover { color:var(--rust); border-color:var(--rust); }

        .sc-root button:focus-visible, .sc-root a:focus-visible, .sc-root input:focus-visible { outline:2px solid var(--gold); outline-offset:2px; }
        /* v2 additions */
        .sc-kpi-input { font-family:var(--mono); font-size:28px; font-weight:600; color:var(--num); line-height:1; background:none; border:none; width:100%; padding:0; }
        .sc-kpi-input:focus { outline:none; color:var(--bone); }
        .sc-kpi-input::placeholder { color:var(--bone-faint); }
        .sc-celebrate { display:flex; align-items:center; gap:10px; margin:10px 0 4px; padding:12px 14px; border-radius:9px; font-size:13.5px;
          color:var(--green); background:linear-gradient(180deg,rgba(108,174,126,0.14),rgba(108,174,126,0.04)); border:1px solid rgba(108,174,126,0.4); }
        .sc-loglist { margin-top:4px; }
        .sc-logrow { display:flex; align-items:center; gap:12px; padding:10px 2px; border-bottom:1px solid var(--line-soft); }
        .sc-logrow:last-child { border-bottom:none; }
        .sc-logdate { font-family:var(--mono); font-size:10.5px; letter-spacing:0.08em; color:var(--gold); text-transform:uppercase; min-width:54px; }
        .sc-logtext { flex:1; font-size:13px; color:var(--bone-dim); }
        .sc-maint { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
        .sc-hint { font-family:var(--mono); font-size:10.5px; letter-spacing:0.06em; color:var(--bone-faint); }
        .sc-ai { margin-top:4px; background:linear-gradient(180deg,var(--panel2),var(--panel)); border:1px solid var(--line); border-radius:12px; padding:16px 18px; }
        .sc-ai-head { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; flex-wrap:wrap; }
        .sc-ai-title { font-family:var(--serif); font-size:16px; font-weight:600; display:flex; align-items:center; gap:8px; }
        .sc-ai-title svg { color:var(--gold); }
        .sc-ai-sub { font-size:12.5px; color:var(--bone-dim); margin-top:4px; max-width:52ch; }
        .sc-ai-err { margin-top:12px; font-size:12.5px; color:var(--rust); }
        .sc-ai-list { margin-top:14px; display:grid; gap:8px; }
        .sc-ai-card { display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--field); border:1px solid var(--line); border-radius:9px; padding:12px 14px; }
        .sc-ai-name { font-size:14px; font-weight:600; }
        .sc-ai-hook { font-size:12.5px; color:var(--bone-dim); margin-top:3px; line-height:1.4; }
        .sc-btn.primary:disabled { opacity:0.6; cursor:default; }
        .sc-spin { animation:sc-rot 0.8s linear infinite; }
        @keyframes sc-rot { to { transform:rotate(360deg); } }

        /* v3 additions */
        .sc-chanbar { display:flex; gap:8px; margin-top:18px; flex-wrap:wrap; }
        .sc-chanbar-pill { display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:11px; letter-spacing:0.05em;
          background:var(--panel); border:1px solid var(--line); border-radius:20px; padding:7px 13px 7px 11px; cursor:pointer; color:var(--bone-dim); }
        .sc-chanbar-pill .dot { width:9px; height:9px; border-radius:50%; background:var(--p); flex-shrink:0; }
        .sc-chanbar-pill:hover { color:var(--bone); border-color:var(--bone-faint); }
        .sc-chanbar-pill.on { color:var(--ink); background:var(--p); border-color:var(--p); font-weight:600; }
        .sc-chanbar-pill.on .dot { background:var(--ink); opacity:0.5; }
        .sc-pipe { display:flex; flex-direction:column; background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:10px 16px; }
        .sc-pipe-row { display:flex; align-items:center; gap:12px; padding:9px 0; border-bottom:1px solid var(--line-soft); }
        .sc-pipe-row:last-of-type { border-bottom:none; }
        .sc-pipe-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
        .sc-pipe-name { flex:1; font-size:14px; font-weight:500; }
        .sc-chart { background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:8px 18px; }
        .sc-chart-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--line-soft); }
        .sc-chart-row:last-child { border-bottom:none; }
        .sc-chart-lbl { font-size:13px; color:var(--bone-dim); width:120px; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .sc-chart-track { flex:1; height:14px; background:var(--line-soft); border-radius:3px; overflow:hidden; min-width:40px; }
        .sc-chart-bar { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold-bright)); border-radius:3px; transition:width 420ms ease; }
        .sc-chart-bar.over { background:linear-gradient(90deg,var(--rust),#c8714f); }
        .sc-chart-val { font-family:var(--mono); font-size:12.5px; color:var(--bone); min-width:62px; text-align:right; }

        /* v4 additions — System / Watch / QC / Økonomi */
        .sc-sys { background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:4px 18px; }
        .sc-sys-row { display:flex; align-items:flex-start; gap:13px; padding:14px 0; border-bottom:1px solid var(--line-soft); }
        .sc-sys-row:last-child { border-bottom:none; }
        .sc-sys-ic { width:34px; height:34px; flex-shrink:0; border-radius:8px; background:var(--panel2); border:1px solid var(--line); display:flex; align-items:center; justify-content:center; color:var(--gold); }
        .sc-sys-main { flex:1; min-width:0; }
        .sc-sys-name { font-family:var(--mono); font-size:12.5px; font-weight:600; letter-spacing:0.09em; color:var(--bone); }
        .sc-sys-role { font-size:12.5px; color:var(--bone-dim); line-height:1.5; margin-top:3px; }
        .sc-sys-meta { font-family:var(--mono); font-size:10.5px; color:var(--bone-faint); letter-spacing:0.03em; margin-top:6px; display:flex; gap:14px; flex-wrap:wrap; }
        .sc-sys-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .sc-ref-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:8px; }
        .sc-ref { background:var(--panel); border:1px solid var(--line); border-radius:9px; padding:11px 14px; }
        .sc-ref .k { font-family:var(--mono); font-size:9.5px; letter-spacing:0.12em; color:var(--bone-dim); text-transform:uppercase; }
        .sc-ref .v { font-family:var(--mono); font-size:12.5px; color:var(--bone); margin-top:5px; word-break:break-all; }
        .sc-watch { display:flex; gap:13px; padding:13px 16px; border-radius:10px; margin-bottom:10px; background:var(--panel); border:1px solid var(--line); }
        .sc-watch.amber { border-color:rgba(210,154,74,0.4); background:linear-gradient(180deg,rgba(210,154,74,0.08),transparent); }
        .sc-watch-ic { flex-shrink:0; color:var(--amber); margin-top:1px; }
        .sc-watch.neutral .sc-watch-ic { color:var(--bone-faint); }
        .sc-watch-t { font-size:13.5px; font-weight:600; }
        .sc-watch-d { font-size:12.5px; color:var(--bone-dim); margin-top:2px; line-height:1.5; }
        .sc-qc-mode { display:inline-flex; align-items:center; gap:7px; font-family:var(--mono); font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; padding:6px 12px; border-radius:6px; border:1px solid; cursor:pointer; background:none; }
        .sc-qc-mode.shadow { color:var(--amber); border-color:rgba(210,154,74,0.5); }
        .sc-qc-mode.enforce { color:var(--green); border-color:rgba(108,174,126,0.5); }
        .sc-rubric { display:flex; align-items:baseline; gap:12px; padding:9px 0; border-bottom:1px solid var(--line-soft); }
        .sc-rubric:last-child { border-bottom:none; }
        .sc-rubric .r-k { font-family:var(--mono); font-size:11px; letter-spacing:0.06em; color:var(--gold); min-width:96px; }
        .sc-rubric .r-d { font-size:12.5px; color:var(--bone-dim); line-height:1.5; }
        .sc-econ-pills { display:flex; gap:8px; margin:0 0 18px; flex-wrap:wrap; }
        .sc-chart-bar.earn { background:linear-gradient(90deg,var(--green),#8fd0a2); }
        .sc-rollup { background:var(--panel); border:1px solid var(--line); border-radius:11px; padding:4px 18px; }
        .sc-rollup-row { display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--line-soft); }
        .sc-rollup-row:last-child { border-bottom:none; }
        .sc-rollup-row.head { font-family:var(--mono); font-size:9.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--bone-faint); padding:11px 0 8px; }
        .sc-rollup-name { flex:1; display:flex; align-items:center; gap:9px; font-size:13.5px; min-width:0; }
        .sc-rollup-name span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .sc-rollup-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
        .sc-rollup-val { font-family:var(--mono); font-size:12.5px; min-width:78px; text-align:right; flex-shrink:0; }

        /* Lyst-tema: bløde skygger + større radius for premium SaaS-look (reskin) */
        .sc-kpi,.sc-chan,.sc-cred,.sc-cred-bar,.sc-phase,.sc-gate,.sc-ledger,.sc-next,.sc-sys,.sc-chart,.sc-pipe,.sc-rollup,.sc-ref,.sc-watch,.sc-ai,.sc-form,.sc-lp-link,.sc-ai-card {
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -16px rgba(16,24,40,0.16); }
        .sc-kpi,.sc-chan,.sc-cred,.sc-phase,.sc-gate,.sc-sys,.sc-chart,.sc-pipe,.sc-rollup,.sc-ai,.sc-ledger,.sc-cred-bar { border-radius:16px; }
        .sc-lp-link:hover { box-shadow:0 1px 2px rgba(16,24,40,0.04),0 12px 28px -12px rgba(201,161,78,0.32); }
        .sc-livepill { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:10px; font-weight:600;
          letter-spacing:0.14em; text-transform:uppercase; color:var(--green); border:1px solid rgba(62,157,94,0.45);
          background:rgba(62,157,94,0.08); border-radius:20px; padding:4px 11px; }
        .sc-livepill .d { width:7px; height:7px; border-radius:50%; background:var(--green); }
        @media (prefers-reduced-motion: reduce) { .sc-root * { transition:none !important; } }
        @media (max-width:560px) { .sc-phase-meta .week { display:none; } .sc-guide { margin-left:20px; } }
      ` }} />

      <div className="sc-shell">
        {/* Masthead */}
        <header className="sc-mast">
          <div>
            <div className="sc-eyebrow">Paper Empires · AI-powered content operations</div>
            <h1 className="sc-h1" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              Command Center
              <span className="sc-livepill"><span className="d" /> Live</span>
            </h1>
          </div>
          <div className="sc-mast-meta">
            {save === "saved"
              ? <span className="sc-save"><Check size={12} strokeWidth={3} /> Gemt</span>
              : <span><b>{liveChannels}</b> kanal{liveChannels === 1 ? "" : "er"} live · <b>{pct}%</b> bygget</span>}
            <div style={{ marginTop: 4 }}>{new Date().toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}</div>
            <div style={{ marginTop: 4 }}>{loaded ? "Gemmes automatisk" : "Indlæser…"}</div>
          </div>
        </header>

        {/* Active channel = theme + context */}
        {creditWatch?.alert && (
          <div style={{
            margin: "0 0 12px", padding: "10px 14px", borderRadius: 10,
            background: creditWatch.worst === "low" ? "rgba(201,57,46,0.10)" : "rgba(201,161,78,0.12)",
            border: "1px solid " + (creditWatch.worst === "low" ? "#C9392E" : "#C9A14E"),
            color: "var(--ink)", fontSize: 13, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap"
          }}>
            <span style={{ fontWeight: 700, color: creditWatch.worst === "low" ? "#C9392E" : "#C9A14E" }}>
              {creditWatch.worst === "low" ? "⚠ Lavt på credits" : "Credits-varsel"}
            </span>
            <span style={{ opacity: 0.9 }}>
              {creditWatch.items.filter((i) => i.status !== "ok").map((i) => `${i.label}: ${i.remainingPct}% tilbage`).join(" · ")}
            </span>
          </div>
        )}
        <div className="sc-chanbar" aria-label="Aktiv kanal">
          {channels.map((c) => (
            <button key={c.id} className={`sc-chanbar-pill ${activeChan === c.id ? "on" : ""}`}
              style={{ "--p": c.accent }} onClick={() => pickChannel(c.id)} title={`Tema & kontekst: ${c.name}`}>
              <span className="dot" />{c.name}
            </button>
          ))}
        </div>

        {/* Nav — grupperet i klynger med skillelinjer */}
        <nav className="sc-nav" aria-label="Sektioner">
          {NAV_GROUPS.map((g, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <span className="sc-nav-sep" aria-hidden="true" title={g.label} />}
              {g.tabs.map((t) => {
                const Ic = t.Icon;
                return (
                  <button key={t.id} className={`sc-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                    <Ic size={13} strokeWidth={2} />{t.label}
                    {t.id === "kreditter" && alerts.length > 0 && (
                      <span style={{ color: "var(--rust)", fontSize: 13, lineHeight: 1 }}>•</span>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        {/* ───────── AGENTER ───────── */}
        {tab === "agenter" && <AgentsTab />}

        {/* ───────── UDVIKLING ───────── */}
        {tab === "udvikling" && <PerformanceTab />}

        {/* ───────── OVERBLIK ───────── */}
        {tab === "overblik" && (
          <>
            <TodaysMission analytics={analytics} liveVideos={liveVideos} onGoto={setTab} />

            <div className="sc-kpis">
              <div className="sc-kpi"><div className="sc-kpi-num">{liveChannels}/{channels.length}</div><div className="sc-kpi-lbl">Kanaler live</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">{pct}%</div><div className="sc-kpi-lbl">Byggeplan</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">{gateDone}/{GATE.length}</div><div className="sc-kpi-lbl">Gate til kanal 2</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num" style={{ color: alerts.length ? "var(--rust)" : "var(--green)" }}>{alerts.length}</div><div className="sc-kpi-lbl">Konti at fylde</div></div>
            </div>

            {(channelStats && (channelStats.yt || channelStats.fb)) ? (() => {
              const yt = channelStats.yt, fb = channelStats.fb, P = kpiPlatform;
              const pick = (k) => {
                const y = yt ? Number(yt[k]) || 0 : null;
                const f = fb ? Number(fb[k]) || 0 : null;
                if (P === "youtube") return y;
                if (P === "facebook") return f;
                if (y == null && f == null) return null;
                return (y || 0) + (f || 0);
              };
              const fmtVal = (v) => (v == null ? "—" : nfDK(v));
              const labels = P === "facebook"
                ? { videos: "Opslag", views: "Rækkevidde", subs: "Følgere" }
                : { videos: "Videoer udgivet", views: "Visninger i alt", subs: "Abonnenter" };
              return (
                <>
                  <div className="sc-section-label" style={{ justifyContent: "space-between" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><TrendingUp size={11} strokeWidth={2.4} /> Nøgletal · live</span>
                    <span style={{ display: "inline-flex", gap: 6 }}>
                      {[["samlet", "Samlet"], ["youtube", "YouTube"], ["facebook", "Facebook"]].map(([k, l]) => (
                        <button key={k} className="sc-pill" style={kpiPlatform === k
                          ? { cursor: "pointer", borderColor: "var(--gold)", color: "var(--gold)", background: "rgba(201,161,78,0.10)" }
                          : { cursor: "pointer" }} onClick={() => setKpiPlatform(k)}>{l}</button>
                      ))}
                    </span>
                  </div>
                  <div className="sc-kpis">
                    <div className="sc-kpi"><div className="sc-kpi-num">{fmtVal(pick("videos"))}</div><div className="sc-kpi-lbl">{labels.videos}</div></div>
                    <div className="sc-kpi"><div className="sc-kpi-num">{fmtVal(pick("views"))}</div><div className="sc-kpi-lbl">{labels.views}</div></div>
                    <div className="sc-kpi"><div className="sc-kpi-num">{fmtVal(pick("subs"))}</div><div className="sc-kpi-lbl">{labels.subs}</div></div>
                  </div>
                  {P === "facebook" && !fb && <div className="sc-lede" style={{ marginTop: 6, marginBottom: 0, fontSize: 11.5 }}>Facebook-tal kobles på når FB-statistik integreres.</div>}
                  {P === "samlet" && !fb && <div className="sc-lede" style={{ marginTop: 6, marginBottom: 0, fontSize: 11.5 }}>Viser YouTube indtil Facebook-stats er koblet på.</div>}
                </>
              );
            })() : (
              <>
                <div className="sc-section-label"><TrendingUp size={11} strokeWidth={2.4} /> Nøgletal · manuelt indtil data er koblet på</div>
                <div className="sc-kpis">
                  {[{ k: "videos", l: "Videoer udgivet" }, { k: "views", l: "Visninger i alt" }, { k: "subs", l: "Abonnenter" }].map((m) => (
                    <div className="sc-kpi" key={m.k}>
                      <input className="sc-kpi-input" inputMode="numeric" placeholder="—" value={kpis[m.k]}
                        onChange={(e) => patchKpi({ [m.k]: e.target.value })} aria-label={m.l} />
                      <div className="sc-kpi-lbl">{m.l}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="sc-section-label"><Coins size={11} strokeWidth={2.4} /> Økonomi · samlet på tværs af kanaler</div>
            <div className="sc-kpis">
              <div className="sc-kpi"><div className="sc-kpi-num" style={{ color: "var(--green)" }}>${grandEarn.toFixed(0)}</div><div className="sc-kpi-lbl">Indtjening i alt</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">${grandCost.toFixed(0)}</div><div className="sc-kpi-lbl">Kost i alt</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num" style={{ color: grandNet >= 0 ? "var(--green)" : "var(--rust)" }}>${grandNet.toFixed(0)}</div><div className="sc-kpi-lbl">Netto</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">{channels.length}</div><div className="sc-kpi-lbl">Kanaler i alt</div></div>
            </div>
            <div style={{ marginTop: 10 }}>
              <button className="sc-link ghost" onClick={() => setTab("okonomi")}>Indtjening pr. kanal & kilde <ArrowRight size={12} /></button>
            </div>

            <CompetitorBenchmark />

            <div className="sc-section-label"><Eye size={11} strokeWidth={2.4} /> Watch-items</div>
            {WATCH_ITEMS.map((w, i) => (
              <div key={i} className={`sc-watch ${w.level}`}>
                {w.level === "amber" ? <AlertTriangle size={17} className="sc-watch-ic" /> : <Eye size={17} className="sc-watch-ic" />}
                <div className="sc-watch-body">
                  <div className="sc-watch-t">{w.t}</div>
                  <div className="sc-watch-d">{w.d}</div>
                </div>
              </div>
            ))}

            <div className="sc-section-label">Kreditter at holde øje med</div>
            {alerts.length === 0 ? (
              <div className="sc-alert-ok"><Check size={16} strokeWidth={2.5} /> Alle konti markeret OK. Pipelinen kører.</div>
            ) : alerts.map((c) => (
              <div key={c.id} className={`sc-alert ${c.status === "lav" ? "amber" : ""}`}>
                <AlertTriangle size={18} className="sc-alert-ic" />
                <div className="sc-alert-body">
                  <div className="sc-alert-t">Fyld op: {c.name}</div>
                  <div className="sc-alert-d">{c.note}</div>
                </div>
                {c.url
                  ? <a className="sc-link" href={c.url} target="_blank" rel="noopener noreferrer">Åbn <ExternalLink size={12} /></a>
                  : <button className="sc-link ghost" onClick={() => setTab("kreditter")}>Se</button>}
              </div>
            ))}

            <div className="sc-section-label">Kanaler</div>
            <div className="sc-chan-grid">
              {channels.map((c) => (
                <div key={c.id} className="sc-chan" style={{ "--ch-accent": c.accent }}>
                  <div className="sc-chan-head">
                    <div className="sc-chan-badge">{c.initial}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="sc-chan-name">{c.name}</div>
                      <div className="sc-chan-niche">{c.niche}</div>
                    </div>
                  </div>
                  <div className="sc-chan-row">
                    <span className={`sc-pill static ${c.status}`}>
                      {c.status === "live" ? "Live" : c.status === "building" ? "Bygger" : "Planlagt"}
                    </span>
                    <span className="sc-chan-handle" style={{ marginTop: 0 }}>{c.queue.length} sager</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="sc-section-label"><Activity size={11} strokeWidth={2.4} /> Pipeline nu · manuel indtil Fase 3</div>
            <div className="sc-pipe">
              {channels.map((c) => {
                const pm = PIPE_META[c.pipeStatus || "idle"];
                const hasSys = (c.systems || []).length > 0;
                return (
                  <div className="sc-pipe-row" key={c.id}>
                    <span className="sc-pipe-dot" style={{ background: c.accent }} />
                    <span className="sc-pipe-name">{c.name}</span>
                    {hasSys && (
                      <button className={`sc-pill ${c.qcMode === "enforce" ? "ok" : "lav"}`} onClick={() => toggleQcMode(c.id)} title="QC-tilstand — klik for at skifte">
                        QC: {c.qcMode === "enforce" ? "Enforce" : "Shadow"}
                      </button>
                    )}
                    <button className={`sc-pill ${pm.cls}`} onClick={() => cyclePipe(c.id)} title="Klik for at skifte">{pm.label}</button>
                  </div>
                );
              })}
              <a className="sc-link ghost" href="https://madsvalby.app.n8n.cloud/home/executions" target="_blank" rel="noopener noreferrer" style={{ alignSelf: "flex-start", marginTop: 8 }}>Live kørsler i n8n <ExternalLink size={12} /></a>
            </div>

            <div className="sc-section-label">Gate til Kanal 2</div>
            <div className="sc-gate">
              <div className="sc-gate-head">
                <div className="sc-gate-h">Klar til at klone pipelinen?</div>
                <div className="sc-gate-meta">{gateDone} / {GATE.length} opfyldt</div>
              </div>
              {gateDone === GATE.length && (
                <div className="sc-celebrate">
                  <Sparkles size={16} /> Alle kriterier grønne — klar til at klone pipelinen til Kanal 2.
                  <button className="sc-link" onClick={() => setTab("kanaler")} style={{ marginLeft: "auto" }}>Kanaler <ArrowRight size={12} /></button>
                </div>
              )}
              {GATE.map((g, i) => {
                const on = done.has("gate" + i);
                return (
                  <div key={i} className={`sc-gate-item ${on ? "on" : ""}`}>
                    <button className={`sc-check ${on ? "on" : ""}`} onClick={() => toggleStep("gate" + i)} aria-pressed={on}>
                      {on && <Check size={13} strokeWidth={3.5} />}
                    </button>
                    <div className="sc-gate-txt">{g}</div>
                  </div>
                );
              })}
            </div>

            <div className="sc-section-label">Aktivitets-log</div>
            <div className="sc-form" style={{ gridAutoFlow: "column", gridTemplateColumns: "1fr auto" }}>
              <input className="sc-input" placeholder="Notér en hændelse (fx 'Wirecard live', 'ElevenLabs fyldt op $22')…" value={newLog}
                onChange={(e) => setNewLog(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLog()} />
              <button className="sc-btn primary" onClick={addLog}>Log</button>
            </div>
            {log.length > 0 && (
              <div className="sc-loglist">
                {log.map((e) => (
                  <div className="sc-logrow" key={e.ts}>
                    <span className="sc-logdate">{new Date(e.ts).toLocaleDateString("da-DK", { day: "2-digit", month: "short" })}</span>
                    <span className="sc-logtext">{e.text}</span>
                    <button className="sc-guide-btn" onClick={() => removeLog(e.ts)} aria-label="Slet"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="sc-section-label">Vedligehold</div>
            <div className="sc-maint">
              <button className="sc-topup" onClick={exportData}><Download size={13} /> Eksportér backup (JSON)</button>
              <span className="sc-hint">Tip: tryk 1–9 for at skifte fane. Alt gemmes automatisk.</span>
            </div>
          </>
        )}

        {/* ───────── SYSTEM ───────── */}
        {tab === "system" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Infrastrukturen bag <b>{channel?.name}</b> — workflows, render-server, data-tabeller og nøgle-ID'er ét sted. Skift kanal i toppen for at se en andens motor. Secrets ligger i n8n Credentials, ikke her.
            </div>

            {(channel?.systems || []).length === 0 ? (
              <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>
                {channel?.name} har ingen pipeline endnu. Kanalen arver samme motor (MASTER / SHORTS / TREND / QC) når den bygges — vælg en live kanal i toppen for at se infrastrukturen.
              </div>
            ) : (
              <>
                {/* QC */}
                <div className="sc-section-label"><Shield size={11} strokeWidth={2.4} /> QC-gatekeeper</div>
                <div className="sc-gate">
                  <div className="sc-gate-head">
                    <div className="sc-gate-h">Compliance & redaktionel kvalitet</div>
                    <button className={`sc-qc-mode ${channel.qcMode === "enforce" ? "enforce" : "shadow"}`} onClick={() => toggleQcMode(channel.id)} title="Klik for at skifte tilstand">
                      {channel.qcMode === "enforce" ? <Shield size={13} /> : <Eye size={13} />}
                      {channel.qcMode === "enforce" ? "Enforce" : "Shadow"}
                    </button>
                  </div>
                  <p className="sc-next-desc" style={{ marginTop: 2 }}>
                    {channel.qcMode === "enforce"
                      ? "Enforce: reject ⇒ videos.status='needs_review' og publicering springes over."
                      : "Shadow: dommen logges til qc_log, men blokerer ikke produktionen endnu. Den observerer og bygger tillid."}
                  </p>
                  <div style={{ marginTop: 14 }}>
                    {QC_RUBRIC.map(([k, d]) => (
                      <div className="sc-rubric" key={k}>
                        <span className="r-k">{k}</span>
                        <span className="r-d">{d}</span>
                      </div>
                    ))}
                  </div>
                  <p className="sc-cred-note" style={{ marginTop: 14 }}>
                    Verdict: <b style={{ color: "var(--green)" }}>pass</b> (≥7 og compliance ≥7) · <b style={{ color: "var(--amber)" }}>revise</b> · <b style={{ color: "var(--rust)" }}>reject</b>. Compliance-veto: påstand-som-faktum om en levende person ⇒ automatisk reject.
                  </p>
                  <p className="sc-cred-burn" style={{ marginTop: 6 }}>⛽ Kalibreret i test: rent Enron-script → pass 8.2 · "heist/stole"-formuleret → reject 3.8.</p>
                </div>

                {qcLog.length > 0 && (
                  <>
                    <div className="sc-section-label">Seneste QC-domme (qc_log)</div>
                    <div className="sc-gate">
                      {qcLog.map((r) => {
                        const cls = r.verdict === "pass" ? "var(--green)" : r.verdict === "reject" ? "var(--rust)" : r.verdict === "revise" ? "var(--amber)" : "var(--bone-dim)";
                        return (
                          <div className="sc-rubric" key={r.id} style={{ alignItems: "baseline" }}>
                            <span className="r-k" style={{ color: cls, minWidth: 70, textTransform: "uppercase" }}>{r.verdict || "—"}</span>
                            <span className="r-d">
                              <b>{r.case}</b>
                              {(r.overall != null || r.compliance != null) && (
                                <> · score {r.overall ?? "–"} · compliance {r.compliance ?? "–"}</>
                              )}
                              {r.flags && r.flags.length > 0 && <> · {r.flags.length} flag</>}
                              {r.ts && <span style={{ color: "var(--bone-dim)" }}> · {new Date(r.ts).toLocaleDateString("da-DK", { day: "2-digit", month: "short" })}</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="sc-section-label">Klar til enforce-flip?</div>
                <div className="sc-gate">
                  {qcrDone === QC_READY.length && (
                    <div className="sc-celebrate">
                      <Sparkles size={16} /> Alle betingelser opfyldt — flip QC til enforce i panelet ovenfor.
                    </div>
                  )}
                  {QC_READY.map((g, i) => {
                    const on = done.has("qcr" + i);
                    return (
                      <div key={i} className={`sc-gate-item ${on ? "on" : ""}`}>
                        <button className={`sc-check ${on ? "on" : ""}`} onClick={() => toggleStep("qcr" + i)} aria-pressed={on}>
                          {on && <Check size={13} strokeWidth={3.5} />}
                        </button>
                        <div className="sc-gate-txt">{g}</div>
                      </div>
                    );
                  })}
                </div>

                <div className={`sc-watch amber`} style={{ marginTop: 14 }}>
                  <AlertTriangle size={17} className="sc-watch-ic" />
                  <div className="sc-watch-body">
                    <div className="sc-watch-t">JAFCU · anklage-stadie</div>
                    <div className="sc-watch-d">Priority 14, formuleret "allegedly". {channel.jafcuPaused ? "Sat på pause i ideas." : "Aktiv i køen — QC flagger den i shadow, men stopper den ikke endnu."}</div>
                  </div>
                  <button className={`sc-pill ${channel.jafcuPaused ? "queued" : "lav"}`} style={{ alignSelf: "center" }} onClick={() => toggleJafcu(channel.id)}>
                    {channel.jafcuPaused ? "Genoptag" : "Pause"}
                  </button>
                </div>

                {/* Workflows */}
                <div className="sc-section-label"><GitBranch size={11} strokeWidth={2.4} /> Workflows</div>
                <div className="sc-sys">
                  {channel.systems.map((s) => {
                    const isQc = s.key === "qc";
                    const stateLabel = isQc ? (channel.qcMode === "enforce" ? "Enforce" : "Shadow") : "Aktiv";
                    const stateCls = isQc ? (channel.qcMode === "enforce" ? "ok" : "lav") : "ok";
                    return (
                      <div className="sc-sys-row" key={s.key}>
                        <div className="sc-sys-ic"><GitBranch size={16} strokeWidth={1.9} /></div>
                        <div className="sc-sys-main">
                          <div className="sc-sys-name">{s.label}</div>
                          <div className="sc-sys-role">{s.role}</div>
                          <div className="sc-sys-meta"><span>{s.trigger}</span><span>{s.nodes} noder</span><span>ID {s.id}</span></div>
                        </div>
                        <div className="sc-sys-actions">
                          <span className={`sc-pill static ${stateCls}`}>{stateLabel}</span>
                          <a className="sc-link ghost" href={`${channel.n8nBase || N8N_BASE}/workflow/${s.id}`} target="_blank" rel="noopener noreferrer">Åbn <ExternalLink size={12} /></a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <a className="sc-link ghost" href={`${channel.n8nBase || N8N_BASE}/home/executions`} target="_blank" rel="noopener noreferrer" style={{ marginTop: 10 }}>Kørsler (executions) <ExternalLink size={12} /></a>

                {/* Render */}
                <div className="sc-section-label"><Server size={11} strokeWidth={2.4} /> Render-server</div>
                <div className="sc-sys">
                  <div className="sc-sys-row">
                    <div className="sc-sys-ic"><Server size={16} strokeWidth={1.9} /></div>
                    <div className="sc-sys-main">
                      <div className="sc-sys-name">SELV-HOSTET VPS</div>
                      <div className="sc-sys-role">Renderer + Whisper-captions. Deploy: scp server.js → systemctl restart somi-renderer.</div>
                      <div className="sc-sys-meta"><span>212.147.240.185:8080</span><span>systemd: somi-renderer</span></div>
                    </div>
                    <div className="sc-sys-actions">
                      {channel.renderHealth && <a className="sc-link ghost" href={channel.renderHealth} target="_blank" rel="noopener noreferrer">Health <ExternalLink size={12} /></a>}
                    </div>
                  </div>
                </div>

                {/* Data tables */}
                <div className="sc-section-label"><Database size={11} strokeWidth={2.4} /> Data-tabeller</div>
                <div className="sc-sys">
                  {channel.dataTables.map((t) => (
                    <div className="sc-sys-row" key={t.id}>
                      <div className="sc-sys-ic"><Database size={15} strokeWidth={1.9} /></div>
                      <div className="sc-sys-main">
                        <div className="sc-sys-name">{t.name}</div>
                        <div className="sc-sys-role">{t.desc}</div>
                        <div className="sc-sys-meta"><span>ID {t.id}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="sc-hint" style={{ marginTop: 10 }}>MCP kan ikke læse/skrive tabel-rækker — kun workflow-noder og UI. Rækker redigeres manuelt i n8n.</p>

                {/* Refs */}
                <div className="sc-section-label"><Key size={11} strokeWidth={2.4} /> Nøgle-ID'er & modeller</div>
                <div className="sc-ref-grid">
                  {channel.refs.map((r, i) => (
                    <div className="sc-ref" key={i}><div className="k">{r.k}</div><div className="v">{r.v}</div></div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ───────── BYGGEPLAN ───────── */}
        {tab === "byggeplan" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Fase 0–5 fra masterplanen. Trin der tydeligvis er færdige (pipeline, shorts, FB) er sat på forhånd — ret frit.
            </div>
            <div className="sc-ledger">
              <div>
                <div className="sc-ledger-num">{pct}%</div>
                <div className="sc-ledger-meta">{doneCount} / {TOTAL} trin udført</div>
              </div>
              <div className="sc-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="sc-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {(() => {
              const nextStep = ALL_STEPS.find((s) => !done.has(s.id));
              const nextPhase = nextStep ? PHASES.find((p) => p.id === nextStep.phaseId) : null;
              return (
                <section className="sc-next" aria-live="polite">
                  <div className="sc-next-label">Næste skridt</div>
                  {nextStep ? (
                    <>
                      <div className="sc-next-title">{nextStep.title}</div>
                      <div className="sc-next-meta">{nextPhase?.sag} · {nextPhase?.title} · {nextPhase?.week}</div>
                      <p className="sc-next-desc">{nextStep.desc}</p>
                      <button className="sc-next-btn" onClick={() => toggleStep(nextStep.id)}>
                        Markér som udført <ArrowRight size={14} strokeWidth={2.5} />
                      </button>
                    </>
                  ) : <div className="sc-done-all">Alle {TOTAL} trin er udført. Pipelinen kører på autopilot.</div>}
                </section>
              );
            })()}

            {PHASES.map((phase) => {
              const pd = phase.steps.filter((s) => done.has(s.id)).length;
              const pPct = Math.round((pd / phase.steps.length) * 100);
              const isComplete = pd === phase.steps.length;
              const isCollapsed = collapsed.has(phase.id);
              return (
                <section key={phase.id} className={`sc-phase ${isComplete ? "complete" : ""}`}>
                  {isComplete && <div className="sc-stamp">Afsluttet</div>}
                  <button className="sc-phase-head" onClick={() => togglePhase(phase.id)} aria-expanded={!isCollapsed}>
                    <span className="sc-sagnr">{phase.sag}</span>
                    <span className="sc-phase-title">{phase.title}</span>
                    <span className="sc-phase-meta">
                      <span className="week">{phase.week}</span>
                      <span>{pd}/{phase.steps.length}</span>
                      <ChevronDown size={16} className={`sc-chev ${!isCollapsed ? "open" : ""}`} />
                    </span>
                  </button>
                  <div className="sc-phase-bar"><div className="sc-phase-fill" style={{ width: `${pPct}%` }} /></div>
                  {!isCollapsed && (
                    <div className="sc-steps">
                      {phase.steps.map((step) => {
                        const isDone = done.has(step.id);
                        const isOpen = openGuide === step.id;
                        return (
                          <div key={step.id} className={`sc-step ${isDone ? "done" : ""}`}>
                            <div className="sc-step-row">
                              <button className={`sc-check ${isDone ? "on" : ""}`} onClick={() => toggleStep(step.id)} aria-pressed={isDone}>
                                {isDone && <Check size={13} strokeWidth={3.5} />}
                              </button>
                              <div className="sc-step-body">
                                <div className="sc-step-title">{step.title}</div>
                                <div className="sc-step-desc">{step.desc}</div>
                              </div>
                              {step.guide?.length > 0 && (
                                <button className={`sc-guide-btn ${isOpen ? "open" : ""}`} onClick={() => setOpenGuide(isOpen ? null : step.id)} aria-expanded={isOpen}>
                                  <ChevronDown size={16} />
                                </button>
                              )}
                            </div>
                            {isOpen && <ul className="sc-guide">{step.guide.map((g, i) => <li key={i}>{g}</li>)}</ul>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}

            <footer className="sc-foot">
              <span className="sc-foot-note">Masterplan v1.1 · porteres til Next.js i Fase 3</span>
              <button className="sc-reset" onClick={resetChecklist}><RotateCcw size={12} /> Nulstil byggeplan</button>
            </footer>
          </>
        )}

        {/* ───────── ROADMAP ───────── */}
        {tab === "roadmap" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Den prioriterede backlog fra status-dokumentet. Byggeplanen dækker selve opbygningen — det her er programbeslutningerne efter launch: hvad gør vi nu, og i hvilken rækkefølge.
            </div>

            <div className="sc-ledger">
              <div className="sc-ledger-num">{rmDone}/{ROADMAP.length}</div>
              <div className="sc-ledger-meta">beslutninger lukket</div>
            </div>

            <div className="sc-section-label"><Milestone size={11} strokeWidth={2.4} /> Næste skridt</div>
            <div className="sc-gate">
              {rmDone === ROADMAP.length && (
                <div className="sc-celebrate"><Sparkles size={16} /> Hele roadmappen er afviklet — tid til at sætte nye mål.</div>
              )}
              {ROADMAP.map((r, i) => {
                const on = done.has("rm" + i);
                return (
                  <div key={i} className={`sc-gate-item ${on ? "on" : ""}`}>
                    <button className={`sc-check ${on ? "on" : ""}`} onClick={() => toggleStep("rm" + i)} aria-pressed={on}>
                      {on && <Check size={13} strokeWidth={3.5} />}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)" }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--bone)" }}>{r.t}</span>
                        <span className="sc-pill static">{r.when}</span>
                      </div>
                      <div className="sc-gate-txt" style={{ marginTop: 4 }}>{r.d}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ───────── KREDITTER ───────── */}
        {tab === "kreditter" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Pipelinen stopper hvis en konto løber tør. Hold dem fyldt, klik dig direkte til top-up, og flag status så du ser det med det samme.
            </div>

            <div className="sc-cred-bar">
              <div className="blk"><span className="v">~$8</span><span className="l">Pr. video (est.)</span></div>
              <div className="blk"><span className="v">${monthlyUsd}</span><span className="l">Pr. md. ved {cadence}/uge</span></div>
              <div className="blk"><span className="v" style={{ color: planPct > 100 ? "var(--rust)" : planPct > 80 ? "var(--amber)" : "var(--green)" }}>{planPct}%</span><span className="l">Af ElevenLabs-plan</span></div>
              <div className="sc-cad">
                <span>Kadence</span>
                <input type="number" min="0" value={cadence} onChange={(e) => setCad(e.target.value)} aria-label="Videoer pr. uge" />
                <span>/uge</span>
              </div>
            </div>

            {credits.map((c) => {
              const Ic = CRED_ICON[c.icon] || Wallet;
              const sm = STATUS_META[c.status] || STATUS_META.ok;
              const since = daysSince(c.lastTopup);
              const cardCls = c.status === "kritisk" ? "crit" : c.status === "lav" ? "warn" : "";
              const videosLeft = c.id === "elevenlabs" && c.runwayChars
                ? Math.floor((Number(c.runwayChars) || 0) / 14000) : null;
              return (
                <div key={c.id} className={`sc-cred ${cardCls}`}>
                  <div className="sc-cred-top">
                    <div className="sc-cred-ic"><Ic size={18} strokeWidth={1.8} /></div>
                    <div style={{ minWidth: 0 }}>
                      <div className="sc-cred-name">{c.name}</div>
                      <div className="sc-cred-kind">{c.kind}</div>
                    </div>
                    <div className="sc-cred-actions">
                      <button className={`sc-pill ${sm.cls}`} onClick={() => cycleStatus(c.id)} title="Klik for at skifte status">{sm.label}</button>
                      {c.url
                        ? <a className="sc-link" href={c.url} target="_blank" rel="noopener noreferrer">Top-up <ExternalLink size={12} /></a>
                        : <span className="sc-link ghost disabled">Ingen link</span>}
                    </div>
                  </div>
                  <div className="sc-cred-note">{c.note}</div>
                  <div className="sc-cred-burn">⛽ {c.burn}</div>

                  {c.id === "elevenlabs" && (
                    <div className="sc-runway">
                      <input type="number" placeholder="Resterende tegn" value={c.runwayChars}
                        onChange={(e) => patchCredit(c.id, { runwayChars: e.target.value })} aria-label="Resterende tegn" />
                      <span className="out">{videosLeft != null
                        ? <>≈ <b>{videosLeft}</b> videoer tilbage</>
                        : <span style={{ color: "var(--bone-faint)" }}>indtast saldo → runway</span>}</span>
                    </div>
                  )}

                  <div className="sc-cred-foot">
                    <button className="sc-topup" onClick={() => markTopup(c.id)}><Check size={12} strokeWidth={2.5} /> Fyldt op i dag</button>
                    <span className="since">{since == null ? "ingen top-up logget" : since === 0 ? "fyldt op i dag" : `${since} dag${since === 1 ? "" : "e"} siden top-up`}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ───────── LAUNCHPAD ───────── */}
        {tab === "launchpad" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Alt du åbner dagligt, ét klik væk — pipeline, render-server, udgivelse og AI-konti.
            </div>
            {LINK_GROUPS.map((grp) => (
              <div key={grp.title} className="sc-lp-group">
                <div className="sc-lp-title">{grp.title}</div>
                <div className="sc-lp-grid">
                  {grp.links.map((l) => (
                    <a key={l.label} className="sc-lp-link" href={l.url} target="_blank" rel="noopener noreferrer">
                      <span>{l.label}</span><ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ───────── KANALER ───────── */}
        {tab === "kanaler" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Hver kanal er sin egen pipeline. Tilføj en ny SOMI-kanal når en niche er klar — den arver samme motor, kun stilguide og kø skifter.
            </div>

            {addChan.open && (
              <div className="sc-form">
                <input className="sc-input" placeholder="Kanalnavn (fx Engineering Disasters)" value={addChan.name}
                  onChange={(e) => setAddChan({ ...addChan, name: e.target.value })} autoFocus />
                <input className="sc-input" placeholder="Niche / undertitel" value={addChan.niche}
                  onChange={(e) => setAddChan({ ...addChan, niche: e.target.value })} />
                <input className="sc-input mono" placeholder="@handle" value={addChan.handle}
                  onChange={(e) => setAddChan({ ...addChan, handle: e.target.value })} />
                <div className="sc-form-row">
                  <button className="sc-btn primary" onClick={commitAddChannel}>Tilføj kanal</button>
                  <button className="sc-btn ghost" onClick={() => setAddChan({ open: false, name: "", niche: "", handle: "" })}>Annullér</button>
                </div>
              </div>
            )}

            <div className="sc-chan-grid">
              {channels.map((c) => (
                <div key={c.id} className="sc-chan" style={{ "--ch-accent": c.accent }}>
                  {c.id !== "ch1" && <button className="sc-chan-del" onClick={() => removeChannel(c.id)} aria-label="Fjern kanal"><Trash2 size={14} /></button>}
                  <div className="sc-chan-head">
                    <div className="sc-chan-badge">{c.initial}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="sc-chan-name">{c.name}</div>
                      <div className="sc-chan-niche">{c.niche}</div>
                    </div>
                  </div>
                  <div className="sc-chan-row">
                    <button className={`sc-pill ${c.status}`} onClick={() => cycleChanStatus(c.id)} title="Klik for at skifte status">
                      {c.status === "live" ? "Live" : c.status === "building" ? "Bygger" : "Planlagt"}
                    </button>
                    <span className="sc-chan-handle" style={{ marginTop: 0 }}>{c.handle}</span>
                  </div>
                  <div className="sc-chan-links">
                    <a className={`sc-link ghost ${c.masterWf ? "" : "disabled"}`} href={c.masterWf || "#"} target="_blank" rel="noopener noreferrer">MASTER</a>
                    <a className={`sc-link ghost ${c.shortsWf ? "" : "disabled"}`} href={c.shortsWf || "#"} target="_blank" rel="noopener noreferrer">SHORTS</a>
                    <a className={`sc-link ghost ${c.ytStudio ? "" : "disabled"}`} href={c.ytStudio || "#"} target="_blank" rel="noopener noreferrer">YouTube</a>
                    <a className={`sc-link ghost ${c.fb ? "" : "disabled"}`} href={c.fb || "#"} target="_blank" rel="noopener noreferrer">Facebook</a>
                  </div>
                </div>
              ))}
              {!addChan.open && (
                <button className="sc-chan add" onClick={() => setAddChan({ ...addChan, open: true })}>
                  <Plus size={18} /> Tilføj kanal
                </button>
              )}
            </div>
          </>
        )}

        {/* ───────── IDÉ-KØ ───────── */}
        {/* ───────── OPSLAG ───────── */}
        {tab === "opslag" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Når video-tempoet skrues ned, holder vi kanalen aktiv med community- og FB-opslag + kommentar-spil.
              Her er kadencen og hvad pipelinen kan automatisere kontra hvad der kræver et manuelt klik.
            </div>

            <div className="sc-section-label"><Activity size={11} strokeWidth={2.4} /> Kadence</div>
            <div className="sc-kpis">
              {POST_CADENCE.map((c) => {
                const Ic = c.Icon;
                return (
                  <div className="sc-kpi" key={c.k}>
                    <div className="sc-kpi-num" style={{ fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}><Ic size={15} /> {c.v}</div>
                    <div className="sc-kpi-lbl">{c.k}</div>
                    <div style={{ fontSize: 11.5, color: "var(--bone-faint)", marginTop: 7, lineHeight: 1.45 }}>{c.note}</div>
                  </div>
                );
              })}
            </div>

            <div className="sc-section-label"><ListChecks size={11} strokeWidth={2.4} /> Per-opslag checkliste</div>
            {POST_CHECKLIST.map((p) => {
              const Ic = p.Icon;
              return (
                <div className="sc-watch" key={p.t} style={{ alignItems: "flex-start" }}>
                  <Ic size={17} className="sc-watch-ic" style={{ color: p.mode === "auto" ? "var(--green)" : "var(--bone-faint)" }} />
                  <div className="sc-watch-body">
                    <div className="sc-watch-t" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      {p.t}
                      <span className={`sc-pill static ${p.mode === "auto" ? "ok" : "queued"}`}>{p.mode === "auto" ? "Auto" : "Manuelt"}</span>
                    </div>
                    <div className="sc-watch-d">{p.d}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--bone-faint)", marginTop: 6, letterSpacing: "0.02em" }}>{p.api}</div>
                  </div>
                </div>
              );
            })}

            <div className="sc-section-label"><GitBranch size={11} strokeWidth={2.4} /> Automatiserings-status (n8n)</div>
            <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)", display: "block", lineHeight: 1.6 }}>
              <b style={{ color: "var(--green)" }}>Live nu:</b> Facebook side-opslag postes automatisk når en video bliver offentlig — watcheren "SOMI FB ANNOUNCE" opdager publicering via YouTube oEmbed (intet scope nødvendigt), Claude skriver opslaget, og det poster til siden med link.<br />
              <b style={{ color: "var(--amber, #C9A14E)" }}>Venter på scope:</b> YouTube auto-top-kommentar + pin-kommentar kræver at Google-scopet udvides til <code>youtube.force-ssl</code>.<br />
              <b style={{ color: "var(--bone-faint)" }}>Forbliver manuelt:</b> YouTube community-post (ingen API) — pipelinen kan sende dig en påmindelse med færdig tekst.
            </div>
          </>
        )}

        {tab === "ko" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Idé-køen og produktionen — drevet direkte af n8n. Tilføj sager øverst, træk i køen for at styre
              rækkefølgen, og se nederst hvad pipelinen faktisk har produceret (opdateres automatisk).
            </div>

            {/* Ny sag → n8n-køen */}
            <div className="sc-form" style={{ gridTemplateColumns: "1fr auto", display: "grid", gridAutoFlow: "column" }}>
              <input className="sc-input" placeholder="Ny sag til køen…" value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCaseToQueue()} />
              <button className="sc-btn primary" onClick={addCaseToQueue} disabled={queueBusy}>
                {queueBusy ? <Loader2 size={13} className="sc-spin" /> : "Tilføj"}
              </button>
            </div>

            {/* AI-sagsforslag → n8n-køen */}
            {channel && (
              <div className="sc-ai">
                <div className="sc-ai-head">
                  <div>
                    <div className="sc-ai-title"><Wand2 size={14} /> AI-sagsforslag</div>
                    <div className="sc-ai-sub">Claude foreslår nye, ikke-dækkede sager til nichen — tilføj dem direkte i køen.</div>
                  </div>
                  <button className="sc-btn primary" onClick={generateIdeas} disabled={aiBusy}>
                    {aiBusy ? <><Loader2 size={13} className="sc-spin" /> Henter…</> : <>Foreslå sager</>}
                  </button>
                </div>
                {aiError && <div className="sc-ai-err">{aiError}</div>}
                {aiIdeas.length > 0 && (
                  <div className="sc-ai-list">
                    {aiIdeas.map((idea, i) => (
                      <div className="sc-ai-card" key={i}>
                        <div style={{ minWidth: 0 }}>
                          <div className="sc-ai-name">{idea.name}</div>
                          {idea.hook && <div className="sc-ai-hook">{idea.hook}</div>}
                        </div>
                        <button className="sc-topup" onClick={() => acceptIdeaToQueue(idea)} disabled={queueBusy}><Plus size={13} /> Tilføj</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Produktions-kø (n8n) — drag-reorder */}
            <IdeaQueueBoard refreshKey={queueRefresh} />

            {/* Live / udgivet — auto fra videos-tabellen (det MASTER har produceret) */}
            <div className="sc-section-label" style={{ marginTop: 22 }}><Radio size={11} strokeWidth={2.4} /> Live / udgivet</div>
            <div className="sc-lede" style={{ marginTop: 0, marginBottom: 8, fontSize: 12 }}>
              Automatisk fra pipelinen (videos-tabellen) — det MASTER har produceret. Kun læsning; statusserne styres af pipelinen.
            </div>
            {liveVideos.length === 0 ? (
              <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>
                Ingen producerede videoer endnu. Når MASTER producerer en idé fra køen, dukker den op her af sig selv.
              </div>
            ) : (
              <div className="sc-phase">
                <div className="sc-steps" style={{ borderTop: "none" }}>
                  {liveVideos.map((v) => (
                    <div key={v.id} className="sc-step">
                      <div className="sc-step-row">
                        <div className="sc-step-body">
                          <div className="sc-step-title">{v.case}</div>
                        </div>
                        <span className={"sc-pill static " + ({ producerer: "next", til_godkendelse: "queued", needs_review: "kritisk", uploadet_privat: "ok", published: "ok" }[v.status] || "")}>{v.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ───────── ØKONOMI ───────── */}
        {tab === "okonomi" && (
          <>
            <div className="sc-lede" style={{ marginTop: 28 }}>
              Indtjening og kost — pr. kilde og pr. kanal. Vælg en enkelt kanal eller se alt samlet. Netto = indtjening − kost.{" "}
              {pipelineAuto
                ? "Tallene kommer automatisk fra pipelinen (costlog via n8n, indtjening via YouTube-cron)."
                : "Tallene er manuelle indtil pipeline-data (n8n/YouTube-cron) lander i tabellerne."}
            </div>

            <div className="sc-econ-pills">
              <button className="sc-pill" style={econChan === "all"
                ? { cursor: "pointer", borderColor: "var(--gold)", color: "var(--gold)", background: "rgba(201,161,78,0.10)" }
                : { cursor: "pointer" }} onClick={() => setEconChan("all")}>Alle kanaler</button>
              {channels.map((c) => (
                <button key={c.id} className="sc-pill" style={econChan === c.id
                  ? { cursor: "pointer", borderColor: c.accent, color: c.accent, background: "rgba(255,255,255,0.04)" }
                  : { cursor: "pointer" }} onClick={() => setEconChan(c.id)}>{c.name}</button>
              ))}
            </div>

            <div className="sc-kpis">
              <div className="sc-kpi"><div className="sc-kpi-num" style={{ color: "var(--green)" }}>${earnTotal.toFixed(0)}</div><div className="sc-kpi-lbl">Indtjening</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">${costTotal.toFixed(0)}</div><div className="sc-kpi-lbl">Kost</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num" style={{ color: netTotal >= 0 ? "var(--green)" : "var(--rust)" }}>${netTotal.toFixed(0)}</div><div className="sc-kpi-lbl">Netto</div></div>
              <div className="sc-kpi"><div className="sc-kpi-num">${costAvg.toFixed(1)}</div><div className="sc-kpi-lbl">Snit pr. video</div></div>
            </div>

            {econChan === "all" && (
              <>
                <div className="sc-section-label"><GitBranch size={11} strokeWidth={2.4} /> Pr. kanal</div>
                <div className="sc-rollup">
                  <div className="sc-rollup-row head">
                    <div className="sc-rollup-name">Kanal</div>
                    <div className="sc-rollup-val">Indtjening</div>
                    <div className="sc-rollup-val">Kost</div>
                    <div className="sc-rollup-val">Netto</div>
                  </div>
                  {rollup.map((r) => (
                    <div className="sc-rollup-row" key={r.id}>
                      <div className="sc-rollup-name"><span className="sc-rollup-dot" style={{ background: r.accent }} /><span>{r.name}</span></div>
                      <div className="sc-rollup-val" style={{ color: r.earn > 0 ? "var(--green)" : "var(--bone-faint)" }}>${r.earn.toFixed(0)}</div>
                      <div className="sc-rollup-val">${r.cost.toFixed(0)}</div>
                      <div className="sc-rollup-val" style={{ color: r.net >= 0 ? "var(--green)" : "var(--rust)" }}>${r.net.toFixed(0)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="sc-section-label"><Banknote size={11} strokeWidth={2.4} /> Indtjening pr. kilde</div>
            {earnTotal === 0 ? (
              <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>Ingen indtjening logget endnu{econScope ? " for denne kanal" : ""}. Tilføj YouTube-, Facebook- eller affiliate-indtjening nedenfor.</div>
            ) : (
              <div className="sc-chart">
                {bySource.map((s) => {
                  const w = srcMax ? Math.max(s.usd > 0 ? 6 : 0, (s.usd / srcMax) * 100) : 0;
                  return (
                    <div className="sc-chart-row" key={s.id}>
                      <span className="sc-chart-lbl" title={s.label}>{s.label}</span>
                      <div className="sc-chart-track"><div className="sc-chart-bar earn" style={{ width: `${w}%` }} /></div>
                      <span className="sc-chart-val">${s.usd.toFixed(0)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="sc-section-label">Tilføj indtjening</div>
            <div className="sc-form" style={{ display: "flex", flexWrap: "wrap", gap: 10, gridAutoFlow: "unset", gridTemplateColumns: "unset" }}>
              <select className="sc-input mono" style={{ flex: "1 1 150px" }} value={newEarn.source} onChange={(e) => setNewEarn({ ...newEarn, source: e.target.value })}>
                {EARN_SOURCES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              {econChan === "all" && (
                <select className="sc-input mono" style={{ flex: "1 1 150px" }} value={newEarn.channelId} onChange={(e) => setNewEarn({ ...newEarn, channelId: e.target.value })}>
                  {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              <input className="sc-input mono" style={{ flex: "0 1 140px" }} type="month" value={newEarn.month} onChange={(e) => setNewEarn({ ...newEarn, month: e.target.value })} />
              <input className="sc-input mono" style={{ flex: "1 1 110px" }} inputMode="decimal" placeholder="USD" value={newEarn.usd}
                onChange={(e) => setNewEarn({ ...newEarn, usd: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addEarning()} />
              <button className="sc-btn primary" onClick={addEarning}>Tilføj</button>
            </div>

            <div className="sc-section-label">Kost pr. video</div>
            {fCosts.length === 0 ? (
              <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>Ingen kost logget endnu{econScope ? " for denne kanal" : ""}. Tilføj den første nedenfor.</div>
            ) : (
              <div className="sc-chart">
                {fCosts.map((c) => {
                  const w = costMax ? Math.max(6, (Number(c.usd) / costMax) * 100) : 0;
                  const over = Number(c.usd) > COST_TARGET_HIGH;
                  const ch = channels.find((x) => x.id === c.channelId);
                  const label = econChan === "all" && ch ? `${c.case} · ${ch.initial}` : c.case;
                  return (
                    <div className="sc-chart-row" key={c.id}>
                      <span className="sc-chart-lbl" title={label}>{label}</span>
                      <div className="sc-chart-track"><div className={`sc-chart-bar ${over ? "over" : ""}`} style={{ width: `${w}%` }} /></div>
                      <span className="sc-chart-val">${Number(c.usd).toFixed(2)}</span>
                      <button className="sc-guide-btn" onClick={() => removeCost(c.id)} aria-label="Slet"><X size={14} /></button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="sc-section-label">Tilføj kost</div>
            <div className="sc-form" style={{ display: "flex", flexWrap: "wrap", gap: 10, gridAutoFlow: "unset", gridTemplateColumns: "unset" }}>
              {econChan === "all" && (
                <select className="sc-input mono" style={{ flex: "1 1 150px" }} value={newCost.channelId} onChange={(e) => setNewCost({ ...newCost, channelId: e.target.value })}>
                  {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              <input className="sc-input" style={{ flex: "1 1 160px" }} placeholder="Sag (fx Barings)" value={newCost.case}
                onChange={(e) => setNewCost({ ...newCost, case: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCost()} />
              <input className="sc-input mono" style={{ flex: "0 1 110px" }} inputMode="decimal" placeholder="USD" value={newCost.usd}
                onChange={(e) => setNewCost({ ...newCost, usd: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addCost()} />
              <button className="sc-btn primary" onClick={addCost}>Tilføj</button>
            </div>

            {fEarn.length > 0 && (
              <>
                <div className="sc-section-label">Indtjenings-posteringer</div>
                <div className="sc-chart">
                  {[...fEarn].reverse().map((e) => {
                    const ch = channels.find((x) => x.id === e.channelId);
                    return (
                      <div className="sc-chart-row" key={e.id}>
                        <span className="sc-chart-lbl" title={EARN_LABEL[e.source] || e.source} style={{ width: 150 }}>{EARN_LABEL[e.source] || e.source}</span>
                        <span style={{ flex: 1, fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--bone-faint)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {e.month}{econChan === "all" && ch ? ` · ${ch.initial}` : ""}
                        </span>
                        <span className="sc-chart-val" style={{ color: "var(--green)" }}>${Number(e.usd).toFixed(0)}</span>
                        <button className="sc-guide-btn" onClick={() => removeEarning(e.id)} aria-label="Slet"><X size={14} /></button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
