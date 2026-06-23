"use client";
import React from "react";
import { Compass, Rocket, Milestone, Ship, Link2, ArrowRight } from "lucide-react";

// Side quests — de små/sekundære spor ved siden af hovedpipelinen. Synlige links
// på Overblik så de ikke bliver glemt. onGoto(tabId) navigerer til den fane.
const QUESTS = [
  { icon: Rocket, name: "AI-imperiet", desc: "6 venture-planer + landing pages, lead-backend live.", status: "Klar", tone: "var(--gold)", goto: "kommende" },
  { icon: Milestone, name: "Venture-roadmaps", desc: "Komplet launch-plan pr. virksomhed med diagnose + links.", status: "Live", tone: "var(--green)", goto: "roadmaps" },
  { icon: Ship, name: "Kanal 2 — Maritime Disasters", desc: "Klon pipelinen til ny niche — venter på grøn vækst-gate.", status: "Gated", tone: "var(--amber)", goto: "roadmap" },
  { icon: Link2, name: "Link-hub (affiliate)", desc: "Egen redirect-side + klik-logging, når der er deals at linke.", status: "Planlagt", tone: "var(--bone-faint)", goto: null },
];

const STYLES = `
  .sq { background:linear-gradient(180deg,var(--panel2,var(--panel)),var(--panel)); border:1px solid var(--line);
    border-radius:18px; padding:18px 20px; margin-bottom:18px;
    box-shadow:0 1px 2px rgba(16,24,40,0.04),0 18px 40px -28px rgba(16,24,40,0.22); }
  .sq-h { display:flex; align-items:center; gap:9px; font-family:var(--serif); font-size:16px; font-weight:600; }
  .sq-h svg { color:var(--gold); }
  .sq-sub { font-size:12px; color:var(--bone-dim); margin:3px 0 12px 0; }
  .sq-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:10px; }
  .sq-item { display:flex; align-items:flex-start; gap:11px; background:var(--field); border:1px solid var(--line);
    border-radius:12px; padding:12px 13px; text-align:left; transition:border-color .12s, transform .12s; }
  .sq-item.go { cursor:pointer; }
  .sq-item.go:hover { border-color:var(--gold); transform:translateY(-1px); }
  .sq-ic { flex-shrink:0; margin-top:1px; }
  .sq-body { flex:1; min-width:0; }
  .sq-top { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .sq-name { font-size:13.5px; font-weight:600; color:var(--ink); }
  .sq-badge { font-family:var(--mono); font-size:9px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase;
    border-radius:5px; padding:2px 6px; }
  .sq-desc { font-size:12px; color:var(--bone-dim); margin-top:3px; line-height:1.45; }
  .sq-go { flex-shrink:0; color:var(--bone-faint); margin-top:2px; }
  .sq-item.go:hover .sq-go { color:var(--gold); }
`;

export default function SideQuests({ onGoto }) {
  return (
    <div className="sq">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="sq-h"><Compass size={17} strokeWidth={2.2} /> Side quests</div>
      <div className="sq-sub">De små spor ved siden af hovedpipelinen — så de ikke bliver glemt.</div>
      <div className="sq-grid">
        {QUESTS.map((q, i) => {
          const Ic = q.icon;
          const clickable = !!q.goto;
          return (
            <div key={i} className={`sq-item ${clickable ? "go" : ""}`}
              role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : undefined}
              onClick={() => clickable && onGoto && onGoto(q.goto)}
              onKeyDown={(e) => clickable && (e.key === "Enter" || e.key === " ") && onGoto && onGoto(q.goto)}>
              <Ic size={17} className="sq-ic" style={{ color: q.tone }} />
              <div className="sq-body">
                <div className="sq-top">
                  <span className="sq-name">{q.name}</span>
                  <span className="sq-badge" style={{ color: q.tone, background: "var(--panel)", border: `1px solid ${q.tone}` }}>{q.status}</span>
                </div>
                <div className="sq-desc">{q.desc}</div>
              </div>
              {clickable && <ArrowRight size={15} className="sq-go" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
