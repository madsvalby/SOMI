"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Bot, Search, PenLine, ShieldCheck, Mic, Image as ImageIcon, Tag, UploadCloud,
  Zap, MessageSquare, Activity, Lightbulb, ExternalLink, ScrollText, Play,
  Settings, Check, Loader2, Sparkles, AlertTriangle,
} from "lucide-react";
import { getAgents, AGENT_STATUS_META, AGENTS_ARE_MOCK, EXECUTIONS_URL } from "@/lib/agents";
import { MOCK_SKILLS, runSkill } from "@/lib/agentSkills";
import { loadKey, saveKey } from "@/lib/dashboardState";
import InsightsPanel from "./InsightsPanel";

const K_SKILLS = "somi_agent_skills_v1";

const ICONS = {
  lightbulb: Lightbulb, search: Search, penLine: PenLine, shieldCheck: ShieldCheck,
  mic: Mic, image: ImageIcon, tag: Tag, uploadCloud: UploadCloud, zap: Zap,
  messageSquare: MessageSquare, activity: Activity,
};

export default function AgentsTab() {
  const agents = useMemo(() => getAgents(), []);
  const [selected, setSelected] = useState(null); // agentId eller null = alle
  const [overrides, setOverrides] = useState({}); // { [skillId]: {enabled, webhookUrl, config} }
  const [configOpen, setConfigOpen] = useState(null);
  const [running, setRunning] = useState({});
  const [results, setResults] = useState({});
  const [draftHook, setDraftHook] = useState({}); // skillId -> webhookUrl tekst

  useEffect(() => {
    (async () => {
      const o = await loadKey(K_SKILLS, null);
      if (o && typeof o === "object") setOverrides(o);
    })();
  }, []);

  const persist = (next) => { setOverrides(next); saveKey(K_SKILLS, next); };

  const mergedSkill = (s) => ({ ...s, ...(overrides[s.id] || {}) });

  const toggleEnabled = (s) => {
    const cur = mergedSkill(s);
    const next = { ...overrides, [s.id]: { ...(overrides[s.id] || {}), enabled: !cur.enabled } };
    persist(next);
  };

  const saveHook = (s) => {
    const url = (draftHook[s.id] ?? mergedSkill(s).webhookUrl ?? "").trim();
    const next = { ...overrides, [s.id]: { ...(overrides[s.id] || {}), webhookUrl: url } };
    persist(next);
    setConfigOpen(null);
  };

  const doRun = async (s) => {
    const skill = mergedSkill(s);
    setRunning((r) => ({ ...r, [s.id]: true }));
    setResults((r) => ({ ...r, [s.id]: null }));
    const res = await runSkill(skill);
    setRunning((r) => ({ ...r, [s.id]: false }));
    setResults((r) => ({ ...r, [s.id]: res }));
  };

  const shownAgents = selected ? agents.filter((a) => a.id === selected) : agents;
  const skillCount = (agentId) => MOCK_SKILLS.filter((s) => s.agentId === agentId).length;

  return (
    <div className="agt">
      <style dangerouslySetInnerHTML={{ __html: `
        .agt-head { display:flex; align-items:flex-end; justify-content:space-between; gap:14px; flex-wrap:wrap; }
        .agt-demo { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:9.5px; font-weight:600;
          letter-spacing:0.14em; text-transform:uppercase; color:var(--amber); border:1px solid var(--amber); border-radius:5px; padding:4px 8px; }
        .agt-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; margin-top:18px; }
        .agt-card { position:relative; text-align:left; background:var(--panel); border:1px solid var(--line); border-radius:16px;
          padding:18px; cursor:pointer; transition:border-color 160ms, box-shadow 160ms, transform 160ms;
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -14px rgba(16,24,40,0.16); }
        .agt-card:hover { transform:translateY(-2px); border-color:var(--gold); }
        .agt-card.on { border-color:var(--gold); box-shadow:0 1px 2px rgba(16,24,40,0.04),0 14px 30px -12px rgba(201,161,78,0.4); }
        .agt-card.planned { opacity:0.78; }
        .agt-top { display:flex; align-items:center; gap:13px; }
        .agt-av { width:46px; height:46px; flex-shrink:0; border-radius:13px; display:flex; align-items:center; justify-content:center;
          color:var(--ink); background:linear-gradient(160deg,var(--gold-bright),var(--gold)); box-shadow:0 6px 14px -6px rgba(201,161,78,0.6); }
        .agt-name { font-family:var(--serif); font-size:17px; font-weight:600; line-height:1.1; }
        .agt-sub { font-family:var(--mono); font-size:9.5px; letter-spacing:0.08em; text-transform:uppercase; color:var(--bone-faint); margin-top:4px; }
        .agt-role { font-size:12.5px; color:var(--bone-dim); line-height:1.5; margin-top:12px; min-height:38px; }
        .agt-meta { display:flex; gap:14px; flex-wrap:wrap; font-family:var(--mono); font-size:10px; color:var(--bone-faint);
          letter-spacing:0.04em; margin-top:12px; }
        .agt-meta b { color:var(--bone-dim); font-weight:600; }
        .agt-rate { margin-top:12px; }
        .agt-rate-track { height:5px; background:var(--line-soft); border-radius:3px; overflow:hidden; }
        .agt-rate-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--gold-bright)); border-radius:3px; }
        .agt-foot { display:flex; align-items:center; gap:8px; margin-top:14px; flex-wrap:wrap; }
        .agt-statpill { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:9.5px; font-weight:600;
          letter-spacing:0.12em; text-transform:uppercase; padding:4px 9px; border-radius:20px; border:1px solid; }
        .agt-statpill .d { width:7px; height:7px; border-radius:50%; background:currentColor; }
        .agt-statpill.run  { color:#2563EB; border-color:rgba(37,99,235,0.4); }
        .agt-statpill.ok   { color:var(--green); border-color:rgba(62,157,94,0.45); }
        .agt-statpill.sched{ color:var(--gold); border-color:rgba(201,161,78,0.5); }
        .agt-statpill.idle { color:var(--bone-faint); border-color:var(--line); }
        .agt-statpill.warn { color:var(--amber); border-color:rgba(183,130,43,0.5); }
        .agt-statpill.fail { color:var(--rust); border-color:rgba(176,73,44,0.5); }
        .agt-ilink { margin-left:auto; display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:10px;
          color:var(--bone-faint); text-decoration:none; }
        .agt-ilink:hover { color:var(--gold); }
        .agt-plannedtag { font-family:var(--mono); font-size:9px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--bone-faint); border:1px dashed var(--line); border-radius:5px; padding:3px 7px; }

        .agt-filterbar { display:flex; gap:8px; flex-wrap:wrap; margin:8px 0 4px; }
        .agt-chip { font-family:var(--mono); font-size:11px; letter-spacing:0.04em; background:var(--panel); border:1px solid var(--line);
          border-radius:20px; padding:6px 12px; cursor:pointer; color:var(--bone-dim); }
        .agt-chip:hover { border-color:var(--bone-faint); color:var(--bone); }
        .agt-chip.on { background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:600; }

        .agt-skgroup { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:6px 18px 8px; margin-top:14px;
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -16px rgba(16,24,40,0.14); }
        .agt-skgroup-head { display:flex; align-items:center; gap:11px; padding:14px 0 12px; }
        .agt-skgroup-ic { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center;
          color:var(--gold); background:var(--field); border:1px solid var(--line); flex-shrink:0; }
        .agt-skgroup-name { font-family:var(--serif); font-size:15.5px; font-weight:600; }
        .agt-skgroup-cnt { font-family:var(--mono); font-size:10px; color:var(--bone-faint); letter-spacing:0.08em; margin-left:auto; }

        .agt-skill { border-top:1px solid var(--line-soft); padding:13px 0; }
        .agt-skill-row { display:flex; align-items:flex-start; gap:12px; }
        .agt-skill-body { flex:1; min-width:0; }
        .agt-skill-name { font-size:13.5px; font-weight:600; display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
        .agt-cat { font-family:var(--mono); font-size:9px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          color:var(--gold); border:1px solid rgba(201,161,78,0.4); border-radius:4px; padding:2px 6px; }
        .agt-skill-desc { font-size:12px; color:var(--bone-dim); line-height:1.5; margin-top:4px; }
        .agt-skill-actions { display:flex; align-items:center; gap:7px; flex-shrink:0; }
        .agt-iconbtn { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:10.5px; letter-spacing:0.04em;
          background:none; border:1px solid var(--line); color:var(--bone-dim); border-radius:7px; padding:7px 10px; cursor:pointer; }
        .agt-iconbtn:hover { color:var(--gold); border-color:var(--gold); }
        .agt-iconbtn.run { background:var(--gold); border-color:var(--gold); color:var(--ink); font-weight:600; }
        .agt-iconbtn.run:hover { background:var(--gold-bright); }
        .agt-iconbtn:disabled { opacity:0.55; cursor:default; }

        .agt-toggle { width:38px; height:22px; border-radius:20px; border:none; cursor:pointer; position:relative; flex-shrink:0;
          background:var(--line); transition:background 160ms; }
        .agt-toggle.on { background:var(--green); }
        .agt-toggle .k { position:absolute; top:3px; left:3px; width:16px; height:16px; border-radius:50%; background:#fff;
          box-shadow:0 1px 3px rgba(0,0,0,0.25); transition:left 160ms; }
        .agt-toggle.on .k { left:19px; }

        .agt-cfg { margin-top:11px; background:var(--field); border:1px solid var(--line); border-radius:10px; padding:13px; }
        .agt-cfg label { font-family:var(--mono); font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase; color:var(--bone-dim); }
        .agt-cfg input { width:100%; margin-top:6px; background:var(--panel); border:1px solid var(--line); border-radius:7px;
          padding:9px 11px; color:var(--bone); font-family:var(--mono); font-size:12px; }
        .agt-cfg input:focus { outline:none; border-color:var(--gold); }
        .agt-cfg-row { display:flex; gap:8px; margin-top:10px; align-items:center; flex-wrap:wrap; }
        .agt-cfg-hint { font-family:var(--mono); font-size:10px; color:var(--bone-faint); }
        .agt-res { margin-top:10px; font-family:var(--mono); font-size:11px; line-height:1.5; padding:9px 11px; border-radius:8px; }
        .agt-res.ok { color:var(--green); background:rgba(62,157,94,0.1); border:1px solid rgba(62,157,94,0.3); }
        .agt-res.todo { color:var(--amber); background:rgba(183,130,43,0.1); border:1px solid rgba(183,130,43,0.3); }
        .agt-res.err { color:var(--rust); background:rgba(176,73,44,0.1); border:1px solid rgba(176,73,44,0.3); }
        .agt-empty { font-size:12.5px; color:var(--bone-faint); padding:14px 0; }
      ` }} />

      <div className="sc-section-label"><Bot size={11} strokeWidth={2.4} /> Dit agent-hold</div>
      <div className="agt-head">
        <p className="sc-lede" style={{ margin: 0 }}>
          Hver agent svarer til en del af content-pipelinen. Klik en agent for at se og styre dens skills.
        </p>
        {AGENTS_ARE_MOCK && <span className="agt-demo"><AlertTriangle size={11} /> Demo-status · n8n-live følger</span>}
      </div>

      <div className="agt-grid">
        {agents.map((a) => {
          const Ic = ICONS[a.icon] || Bot;
          const meta = AGENT_STATUS_META[a.status] || AGENT_STATUS_META.idle;
          return (
            <button key={a.id} className={`agt-card ${selected === a.id ? "on" : ""} ${a.real ? "" : "planned"}`}
              onClick={() => setSelected(selected === a.id ? null : a.id)}>
              <div className="agt-top">
                <div className="agt-av"><Ic size={22} strokeWidth={1.9} /></div>
                <div style={{ minWidth: 0 }}>
                  <div className="agt-name">{a.name}</div>
                  <div className="agt-sub">{skillCount(a.id)} skills{a.real ? "" : " · planlagt"}</div>
                </div>
              </div>
              <div className="agt-role">{a.role}</div>
              <div className="agt-rate">
                <div className="agt-meta" style={{ marginTop: 0, marginBottom: 6 }}>
                  <span>Success: <b>{a.successRate == null ? "—" : a.successRate + "%"}</b></span>
                </div>
                <div className="agt-rate-track"><div className="agt-rate-fill" style={{ width: (a.successRate || 0) + "%" }} /></div>
              </div>
              <div className="agt-meta">
                <span>Sidst: <b>{a.lastRun || "—"}</b></span>
                <span>Næste: <b>{a.nextRun || "—"}</b></span>
              </div>
              <div className="agt-foot">
                <span className={`agt-statpill ${meta.cls}`}><span className="d" />{meta.label}</span>
                {a.real
                  ? <a className="agt-ilink" href={a.n8nUrl || EXECUTIONS_URL} target="_blank" rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}><ExternalLink size={11} /> n8n</a>
                  : <span className="agt-plannedtag">Planlagt</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="sc-section-label"><Sparkles size={11} strokeWidth={2.4} /> Agent skills</div>
      <div className="agt-filterbar">
        <button className={`agt-chip ${selected === null ? "on" : ""}`} onClick={() => setSelected(null)}>Alle agenter</button>
        {agents.filter((a) => skillCount(a.id) > 0).map((a) => (
          <button key={a.id} className={`agt-chip ${selected === a.id ? "on" : ""}`} onClick={() => setSelected(a.id)}>{a.name}</button>
        ))}
      </div>

      {shownAgents.filter((a) => skillCount(a.id) > 0).map((a) => {
        const Ic = ICONS[a.icon] || Bot;
        const skills = MOCK_SKILLS.filter((s) => s.agentId === a.id);
        return (
          <div key={a.id} className="agt-skgroup">
            <div className="agt-skgroup-head">
              <div className="agt-skgroup-ic"><Ic size={16} strokeWidth={1.9} /></div>
              <div className="agt-skgroup-name">{a.name}</div>
              <div className="agt-skgroup-cnt">{skills.length} skills</div>
            </div>
            {skills.map((s0) => {
              const s = mergedSkill(s0);
              const res = results[s.id];
              const isOpen = configOpen === s.id;
              return (
                <div className="agt-skill" key={s.id}>
                  <div className="agt-skill-row">
                    <button className={`agt-toggle ${s.enabled ? "on" : ""}`} title={s.enabled ? "Aktiveret" : "Deaktiveret"}
                      onClick={() => toggleEnabled(s0)}><span className="k" /></button>
                    <div className="agt-skill-body">
                      <div className="agt-skill-name">{s.name}<span className="agt-cat">{s.category}</span>
                        {s.webhookUrl ? <span className="agt-cat" style={{ color: "var(--green)", borderColor: "rgba(62,157,94,0.4)" }}>● webhook</span> : null}
                      </div>
                      <div className="agt-skill-desc">{s.description}</div>
                      {isOpen && (
                        <div className="agt-cfg">
                          <label>n8n webhook-URL (gør skill'en kørbar)</label>
                          <input type="url" placeholder="https://madsvalby.app.n8n.cloud/webhook/..."
                            defaultValue={s.webhookUrl}
                            onChange={(e) => setDraftHook((d) => ({ ...d, [s.id]: e.target.value }))} />
                          <div className="agt-cfg-row">
                            <button className="agt-iconbtn run" onClick={() => saveHook(s0)}><Check size={12} /> Gem</button>
                            <button className="agt-iconbtn" onClick={() => setConfigOpen(null)}>Luk</button>
                            <span className="agt-cfg-hint">Tom = ikke koblet på endnu (TODO-integration)</span>
                          </div>
                        </div>
                      )}
                      {res && (
                        <div className={`agt-res ${res.ok ? "ok" : res.todo ? "todo" : "err"}`}>
                          {res.ok ? "✓ Kaldt (HTTP " + (res.status || 200) + ")"
                            : res.todo ? "Ingen webhook koblet på endnu — sæt en URL via Konfigurér."
                            : "Fejl: " + (res.error || "kald mislykkedes")}
                        </div>
                      )}
                    </div>
                    <div className="agt-skill-actions">
                      <button className="agt-iconbtn" onClick={() => { setConfigOpen(isOpen ? null : s.id); setDraftHook((d) => ({ ...d, [s.id]: s.webhookUrl })); }}>
                        <Settings size={12} /> Konfigurér
                      </button>
                      <button className="agt-iconbtn run" disabled={!s.enabled || !!running[s.id]} onClick={() => doRun(s0)}>
                        {running[s.id] ? <Loader2 size={12} className="sc-spin" /> : <Play size={12} />} Kør
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      <InsightsPanel />

      <div className="sc-foot" style={{ marginTop: 26 }}>
        <span className="sc-foot-note">Skills-status gemmes pr. bruger · webhooks kalder n8n direkte</span>
        <a className="sc-link ghost" href={EXECUTIONS_URL} target="_blank" rel="noreferrer"><ScrollText size={13} /> Alle n8n-kørsler</a>
      </div>
    </div>
  );
}
