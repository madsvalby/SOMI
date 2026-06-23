"use client";
import React, { useState } from "react";
import { Check, Circle, ExternalLink, Rocket, Server, Cloud, KeyRound, Target, Flag, ArrowRight } from "lucide-react";
import { COMPANY_ROADMAPS } from "./companyRoadmapsData";

const ACCENT = {
  faceless: "#C9A14E", listingreel: "#1F9E8F", adforge: "#E0794E",
  automation: "#3B6FB0", beacon: "#7C5CCB", ringback: "#3FA66A",
};

const STYLES = `
  .cr-wrap { margin-top: 26px; display: flex; gap: 22px; align-items: flex-start; }
  .cr-rail { flex: 0 0 232px; position: sticky; top: 16px; }
  .cr-rail-h { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone-faint); margin: 2px 0 10px 4px; }
  .cr-railbtn { display: flex; align-items: center; gap: 11px; width: 100%; text-align: left; background: none; border: 1px solid transparent;
    border-radius: 11px; padding: 11px 12px; cursor: pointer; transition: background .14s ease, border-color .14s ease; margin-bottom: 3px; }
  .cr-railbtn:hover { background: var(--panel2); }
  .cr-railbtn.on { background: var(--panel); border-color: var(--line); box-shadow: 0 4px 14px rgba(15,23,42,0.05); }
  .cr-rail-num { flex: 0 0 26px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 12px; font-weight: 600; color: #fff; }
  .cr-rail-tx { min-width: 0; }
  .cr-rail-nm { font-size: 13.5px; font-weight: 600; color: var(--ink); line-height: 1.2; }
  .cr-rail-tag { font-size: 11px; color: var(--bone-faint); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .cr-main { flex: 1; min-width: 0; }
  .cr-head { border: 1px solid var(--line); border-radius: 16px; padding: 22px 24px; position: relative; overflow: hidden; }
  .cr-head h2 { font-family: var(--serif); font-size: 25px; font-weight: 600; color: var(--ink); margin: 0 0 4px; }
  .cr-head .tag { font-size: 13px; color: var(--bone-dim); font-style: italic; }
  .cr-head .sum { font-size: 13.5px; color: var(--bone-dim); line-height: 1.6; margin-top: 12px; max-width: 760px; }
  .cr-first { display: flex; gap: 9px; align-items: flex-start; margin-top: 16px; padding: 12px 14px; border-radius: 11px;
    background: var(--field); border: 1px solid var(--line-soft); font-size: 13px; color: var(--ink); }
  .cr-first b { font-weight: 600; }

  .cr-sec-h { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--bone-dim); margin: 26px 0 12px; }
  .cr-deploy { border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; background: var(--panel); }
  .cr-deploy .rec { font-size: 14px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 8px; }
  .cr-deploy .rat { font-size: 12.5px; color: var(--bone-dim); line-height: 1.55; margin-top: 7px; }
  .cr-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 11px; }
  .cr-stk { font-family: var(--mono); font-size: 11px; color: var(--bone); background: var(--field); border: 1px solid var(--line-soft); border-radius: 6px; padding: 3px 8px; }

  .cr-phase { position: relative; padding-left: 26px; padding-bottom: 18px; }
  .cr-phase::before { content: ""; position: absolute; left: 8px; top: 6px; bottom: -4px; width: 2px; background: var(--line); }
  .cr-phase:last-child::before { display: none; }
  .cr-dot { position: absolute; left: 2px; top: 3px; width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--panel); }
  .cr-ptitle { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .cr-ptitle .t { font-family: var(--serif); font-size: 16.5px; font-weight: 600; color: var(--ink); }
  .cr-dur { font-family: var(--mono); font-size: 10.5px; color: var(--bone-faint); background: var(--field); border-radius: 5px; padding: 2px 7px; }
  .cr-goal { font-size: 12.5px; color: var(--bone-dim); margin: 3px 0 10px; line-height: 1.5; }
  .cr-step { display: flex; gap: 9px; align-items: flex-start; padding: 6px 0; }
  .cr-step .ico { flex: 0 0 auto; margin-top: 1px; }
  .cr-step .stx { font-size: 13px; color: var(--ink); line-height: 1.4; }
  .cr-step .sd { font-size: 12px; color: var(--bone-dim); line-height: 1.45; }
  .cr-step.done .stx { color: var(--bone-dim); }
  .cr-mads { display: inline-block; font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.04em; color: var(--rust);
    background: rgba(176,73,44,0.08); border: 1px solid rgba(176,73,44,0.18); border-radius: 5px; padding: 1px 5px; margin-left: 7px; vertical-align: 1px; }
  .cr-deliv { font-size: 12px; color: var(--bone-dim); margin-top: 8px; padding: 7px 11px; border-left: 2px solid var(--line); background: var(--panel2); border-radius: 0 8px 8px 0; }
  .cr-deliv b { color: var(--ink); }

  .cr-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .cr-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .cr-need { font-size: 11.5px; color: var(--bone-dim); background: rgba(176,73,44,0.06); border: 1px solid rgba(176,73,44,0.16); border-radius: 6px; padding: 3px 8px; }
  .cr-kpi { font-size: 11.5px; color: var(--bone); background: var(--field); border: 1px solid var(--line-soft); border-radius: 6px; padding: 3px 8px; }
  .cr-links { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 8px; }
  .cr-link { display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11.5px; font-weight: 600;
    color: #fff; border-radius: 9px; padding: 8px 13px; text-decoration: none; transition: filter .15s ease; }
  .cr-link:hover { filter: brightness(1.07); }
  .cr-link.ghost { color: var(--bone); background: var(--field); border: 1px solid var(--line); }
  @media (max-width: 880px) { .cr-wrap { flex-direction: column; } .cr-rail { position: static; flex-basis: auto; width: 100%; } .cr-cols { grid-template-columns: 1fr; } }
`;

function StepRow({ s, accent }) {
  return (
    <div className={`cr-step ${s.status === "done" ? "done" : ""}`}>
      <span className="ico">
        {s.status === "done"
          ? <Check size={15} strokeWidth={3} style={{ color: accent }} />
          : <Circle size={13} strokeWidth={2} style={{ color: "var(--bone-faint)" }} />}
      </span>
      <span>
        <span className="stx">{s.title}{s.needsMads && <span className="cr-mads">KRÆVER DIG</span>}</span>
        {s.detail && <div className="sd">{s.detail}</div>}
      </span>
    </div>
  );
}

export default function CompanyRoadmaps() {
  const list = Array.isArray(COMPANY_ROADMAPS) ? COMPANY_ROADMAPS : [];
  const [sel, setSel] = useState(0);
  if (!list.length) {
    return <div style={{ marginTop: 28, color: "var(--bone-dim)" }}>Roadmaps indlæses…</div>;
  }
  const r = list[Math.min(sel, list.length - 1)];
  const accent = ACCENT[r.slug] || "var(--gold)";
  const isLocal = /lokal/i.test(r.deploy?.recommendation || "");

  return (
    <div className="cr-wrap">
      <style>{STYLES}</style>

      <aside className="cr-rail">
        <div className="cr-rail-h">Virksomheder · roadmaps</div>
        {list.map((c, i) => {
          const a = ACCENT[c.slug] || "var(--gold)";
          return (
            <button key={c.slug} className={`cr-railbtn ${i === sel ? "on" : ""}`} onClick={() => setSel(i)}>
              <span className="cr-rail-num" style={{ background: a }}>{i + 1}</span>
              <span className="cr-rail-tx">
                <div className="cr-rail-nm">{c.name}</div>
                <div className="cr-rail-tag">{c.tagline}</div>
              </span>
            </button>
          );
        })}
      </aside>

      <div className="cr-main">
        <div className="cr-head">
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: accent }} />
          <h2>{r.name}</h2>
          <div className="tag">{r.tagline}</div>
          <div className="sum">{r.summary}</div>
          {r.firstMove && (
            <div className="cr-first"><Flag size={15} strokeWidth={2.2} style={{ color: accent, flexShrink: 0, marginTop: 1 }} />
              <span><b>Første træk:</b> {r.firstMove}</span></div>
          )}
        </div>

        <div className="cr-sec-h"><Cloud size={12} /> Deploy-anbefaling</div>
        <div className="cr-deploy">
          <div className="rec">{isLocal ? <Server size={16} style={{ color: accent }} /> : <Cloud size={16} style={{ color: accent }} />}{r.deploy?.recommendation}</div>
          <div className="rat">{r.deploy?.rationale}</div>
          <div className="cr-stack">{(r.deploy?.stack || []).map((s, i) => <span key={i} className="cr-stk">{s}</span>)}</div>
        </div>

        <div className="cr-sec-h"><Rocket size={12} /> Roadmap — {r.phases?.length || 0} faser</div>
        <div>
          {(r.phases || []).map((p, i) => (
            <div key={i} className="cr-phase">
              <span className="cr-dot" style={{ background: accent }} />
              <div className="cr-ptitle"><span className="t">{p.title}</span>{p.duration && <span className="cr-dur">{p.duration}</span>}</div>
              <div className="cr-goal">{p.goal}</div>
              {(p.steps || []).map((s, j) => <StepRow key={j} s={s} accent={accent} />)}
              {p.deliverable && <div className="cr-deliv"><b>Leverance:</b> {p.deliverable}</div>}
            </div>
          ))}
        </div>

        <div className="cr-cols">
          <div>
            <div className="cr-sec-h"><KeyRound size={12} /> Hvad du skal bruge</div>
            <div className="cr-tags">{(r.madsNeeds || []).map((n, i) => <span key={i} className="cr-need">{n}</span>)}</div>
          </div>
          <div>
            <div className="cr-sec-h"><Target size={12} /> Succes-metrikker</div>
            <div className="cr-tags">{(r.kpis || []).map((k, i) => <span key={i} className="cr-kpi">{k}</span>)}</div>
          </div>
        </div>

        <div className="cr-sec-h"><ArrowRight size={12} /> Links</div>
        <div className="cr-links">
          {(r.links || []).map((l, i) => (
            <a key={i} className={`cr-link ${i === 0 ? "" : "ghost"}`} style={i === 0 ? { background: accent } : undefined}
              href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label} <ExternalLink size={12} strokeWidth={2.4} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
