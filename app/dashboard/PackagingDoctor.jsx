"use client";
import React, { useState } from "react";
import { Stethoscope, Eye, Copy, Check, Image as ImageIcon, Lightbulb, Type } from "lucide-react";
import { PACKAGING_DOCTOR } from "./packagingDoctorData";

const nf = (n) => new Intl.NumberFormat("da-DK").format(Math.round(Number(n) || 0));

const TIER = {
  underperformer: { label: "Underperformer", color: "var(--rust)", bg: "rgba(176,73,44,0.08)", bd: "rgba(176,73,44,0.28)" },
  middel: { label: "Middel", color: "var(--amber, #B7822B)", bg: "rgba(183,130,43,0.08)", bd: "rgba(183,130,43,0.30)" },
  vinder: { label: "Vinder", color: "var(--green)", bg: "rgba(62,157,94,0.10)", bd: "rgba(62,157,94,0.30)" },
};
const PRIO = { "høj": "var(--rust)", "middel": "var(--amber, #B7822B)", "lav": "var(--bone-faint)" };

const STYLES = `
  .pd { margin-top: 18px; }
  .pd-h { display:flex; align-items:center; gap:9px; font-family:var(--serif); font-size:16px; font-weight:600; }
  .pd-h svg { color:var(--gold); }
  .pd-sub { font-size:12px; color:var(--bone-dim); margin:3px 0 14px; line-height:1.5; max-width:70ch; }
  .pd-card { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:16px 18px; margin-bottom:14px;
    box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -18px rgba(16,24,40,0.16); }
  .pd-top { display:flex; align-items:flex-start; gap:10px; flex-wrap:wrap; }
  .pd-title { flex:1; min-width:200px; font-family:var(--serif); font-size:15.5px; font-weight:600; color:var(--ink); line-height:1.35; }
  .pd-badge { font-family:var(--mono); font-size:10px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase;
    border-radius:6px; padding:3px 8px; white-space:nowrap; }
  .pd-views { display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:11px; color:var(--bone-dim); }
  .pd-sec { margin-top:13px; }
  .pd-lbl { display:flex; align-items:center; gap:6px; font-family:var(--mono); font-size:10px; letter-spacing:0.1em;
    text-transform:uppercase; color:var(--bone-faint); margin-bottom:6px; }
  .pd-diag { font-size:13px; color:var(--bone-dim); line-height:1.55; }
  .pd-titles { display:flex; flex-direction:column; gap:7px; }
  .pd-title-row { display:flex; align-items:center; gap:9px; background:var(--field); border:1px solid var(--line-soft);
    border-radius:9px; padding:8px 11px; }
  .pd-title-tx { flex:1; min-width:0; font-size:13px; color:var(--ink); font-weight:500; }
  .pd-copy { flex-shrink:0; display:inline-flex; align-items:center; gap:5px; font-family:var(--mono); font-size:10.5px; font-weight:600;
    background:none; border:1px solid var(--line); border-radius:7px; padding:5px 9px; cursor:pointer; color:var(--bone-dim); transition:all .12s; }
  .pd-copy:hover { border-color:var(--gold); color:var(--gold); }
  .pd-copy.done { color:var(--green); border-color:rgba(62,157,94,0.4); }
  .pd-thumb { font-size:12.5px; color:var(--bone-dim); line-height:1.55; background:var(--panel2); border:1px solid var(--line-soft);
    border-radius:10px; padding:11px 13px; }
  .pd-why { font-size:11.5px; color:var(--gold); margin-top:10px; line-height:1.5; }
  .pd-empty { font-size:13px; color:var(--bone-dim); background:var(--field); border:1px solid var(--line); border-radius:12px; padding:14px; }
`;

function Card({ v }) {
  const [copied, setCopied] = useState(-1);
  const tier = TIER[v.tier] || TIER.middel;
  const copy = (txt, i) => {
    try {
      navigator.clipboard.writeText(txt);
      setCopied(i);
      setTimeout(() => setCopied(-1), 1400);
    } catch (e) { /* clipboard blokeret — ignorér */ }
  };
  return (
    <div className="pd-card">
      <div className="pd-top">
        <div className="pd-title">{v.title}</div>
        <span className="pd-views"><Eye size={12} /> {nf(v.views)}</span>
        <span className="pd-badge" style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.bd}` }}>{tier.label}</span>
        <span className="pd-badge" style={{ color: PRIO[v.priority] || "var(--bone-faint)", background: "var(--field)", border: "1px solid var(--line)" }}>
          Prio: {v.priority}
        </span>
      </div>

      <div className="pd-sec">
        <div className="pd-lbl"><Stethoscope size={11} /> Diagnose</div>
        <div className="pd-diag">{v.diagnosis}</div>
      </div>

      <div className="pd-sec">
        <div className="pd-lbl"><Type size={11} /> Nye titler at teste</div>
        <div className="pd-titles">
          {(v.newTitles || []).map((t, i) => (
            <div className="pd-title-row" key={i}>
              <span className="pd-title-tx">{t}</span>
              <button className={`pd-copy ${copied === i ? "done" : ""}`} onClick={() => copy(t, i)}>
                {copied === i ? <><Check size={11} /> Kopieret</> : <><Copy size={11} /> Kopiér</>}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pd-sec">
        <div className="pd-lbl"><ImageIcon size={11} /> Thumbnail-koncept</div>
        <div className="pd-thumb">{v.thumbnailConcept}</div>
      </div>

      {v.rationale && <div className="pd-why">▸ {v.rationale}</div>}
    </div>
  );
}

export default function PackagingDoctor() {
  const list = Array.isArray(PACKAGING_DOCTOR) ? PACKAGING_DOCTOR : [];
  return (
    <div className="pd">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="pd-h"><Stethoscope size={17} strokeWidth={2.2} /> Titel &amp; thumbnail-doktor</div>
      <div className="pd-sub">
        AI-diagnose pr. publiceret video: <b>hvorfor</b> den performer som den gør, plus 3 konkrete nye titel-forslag og et
        thumbnail-koncept du kan bruge direkte (eller give til Gemini). Sorteret efter hvor meget de trænger (underperformere først).
      </div>
      {list.length === 0
        ? <div className="pd-empty">Ingen doktor-analyse endnu.</div>
        : list.map((v) => <Card key={v.case_id} v={v} />)}
    </div>
  );
}
