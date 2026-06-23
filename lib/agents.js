// ─────────────────────────────────────────────────────────────
// Agent-roster for Paper Empires Command Center.
// Hver agent er mappet til en RIGTIG del af pipelinen (n8n-workflow eller route).
//
// VIGTIGT: status/lastRun/nextRun/successRate er pt. DEMO/mock-værdier indtil de
// wires til n8n-executions. Datalaget er adskilt fra UI'et med vilje — se getAgents()
// + lib/agentSkills.js (runSkill) for integrations-punkterne.
// ─────────────────────────────────────────────────────────────

export const N8N_BASE = "https://madsvalby.app.n8n.cloud";
export const EXECUTIONS_URL = `${N8N_BASE}/home/executions`;
export const wfUrl = (id) => (id ? `${N8N_BASE}/workflow/${id}` : "");

// Markerer at status-felterne nedenfor er demo indtil n8n-status hentes live.
export const AGENTS_ARE_MOCK = true;

// status: running | ok | scheduled | idle | warning | failed
export const AGENT_STATUS_META = {
  running:   { label: "Kører",      cls: "run" },
  ok:        { label: "OK",         cls: "ok" },
  scheduled: { label: "Planlagt",   cls: "sched" },
  idle:      { label: "Inaktiv",    cls: "idle" },
  warning:   { label: "Advarsel",   cls: "warn" },
  failed:    { label: "Fejlet",     cls: "fail" },
};

// real:true = der findes faktisk en workflow/route bag. real:false = planlagt (kun mock).
export const AGENTS = [
  { id: "idea", name: "Idea Agent", icon: "lightbulb",
    role: "Scanner finansnyheder og fylder idé-køen med nye sager",
    wfId: "qzzhCDiOZ6FyncV2", real: true,
    status: "scheduled", lastRun: "i dag 06:00", nextRun: "i morgen 06:00", successRate: 97 },

  { id: "research", name: "Research Agent", icon: "search",
    role: "Scorer & vurderer forslag (websearch) → gode bliver klar til produktion",
    wfId: "TqpBSlFljcX3A4la", real: true,
    status: "scheduled", lastRun: "for nylig", nextRun: "hver 2. time", successRate: 96 },

  { id: "script", name: "Script Agent", icon: "penLine",
    role: "Outline, cold open, narration, pacing, cliffhangers",
    wfId: "LvTDjTb8MxEeOJM3", real: true,
    status: "ok", lastRun: "i går 06:12", nextRun: "i morgen 06:00", successRate: 94 },

  { id: "factcheck", name: "Fact Check Agent", icon: "shieldCheck",
    role: "QC-gatekeeper: scorer script + metadata mod rubric (compliance)",
    wfId: "APTIEmT2m3ONvX7O", real: true,
    status: "ok", lastRun: "i går 06:14", nextRun: "ved næste produktion", successRate: 91 },

  { id: "voiceover", name: "Voiceover Agent", icon: "mic",
    role: "Self-host Chatterbox TTS (klonet stemme), kapitel-opdelt voiceover",
    wfId: "LvTDjTb8MxEeOJM3", real: true,
    status: "ok", lastRun: "i går 06:20", nextRun: "ved næste produktion", successRate: 99 },

  { id: "thumbnail", name: "Thumbnail Agent", icon: "image",
    role: "Hero-billede (Gemini) + thumbnail-koncept",
    wfId: "LvTDjTb8MxEeOJM3", real: true,
    status: "ok", lastRun: "i går 06:31", nextRun: "ved næste produktion", successRate: 88 },

  { id: "seo", name: "SEO Agent", icon: "tag",
    role: "Titler, beskrivelse, tags, kapitler, pinned comment",
    wfId: "LvTDjTb8MxEeOJM3", real: true,
    status: "ok", lastRun: "i går 06:33", nextRun: "ved næste produktion", successRate: 96 },

  { id: "upload", name: "Upload Agent", icon: "uploadCloud",
    role: "Publicerer long-form til YouTube + Facebook (planlagt)",
    wfId: "LvTDjTb8MxEeOJM3", real: true,
    status: "scheduled", lastRun: "i går 06:40", nextRun: "i dag 17:30", successRate: 100 },

  { id: "shorts", name: "Shorts / Reels Agent", icon: "zap",
    role: "3 shorts fra scriptet, 9:16 render, upload YT + FB",
    wfId: "98Jel2bOtd2zDGob", real: true,
    status: "ok", lastRun: "i går 06:52", nextRun: "ved næste produktion", successRate: 90 },

  { id: "community", name: "Community Agent", icon: "messageSquare",
    role: "Auto YT-kommentar + FB announce/engagement ved publicering",
    wfId: "qK9930HfQZ3l6Kxn", real: true,
    status: "scheduled", lastRun: "i dag 14:00", nextRun: "hver 30. min", successRate: 95 },

  { id: "analytics", name: "Analytics Agent", icon: "activity",
    role: "YouTube stats-cron + Supabase-sync (data til dashboardet)",
    wfId: "ZgCQXIG5osogFNeb", real: true,
    status: "scheduled", lastRun: "for 15 min siden", nextRun: "om 15 min", successRate: 99 },
];

// Adapter — returnerer rosteret. Senere: flet rigtig status ind fra n8n-executions/Supabase
// her, så UI'et ikke behøver ændres (TODO: live-status).
export function getAgents() {
  return AGENTS.map((a) => ({ ...a, n8nUrl: wfUrl(a.wfId) }));
}

export function getAgent(id) {
  return getAgents().find((a) => a.id === id) || null;
}
