"use client";
import React, { useEffect, useRef, useState } from "react";
import { ListOrdered, GripVertical, RefreshCw, Loader2, Check } from "lucide-react";

// Reorderbar kø/næste-liste (ideas-tabellen: proposed/candidate/ready).
// Træk for at ændre rækkefølge → priority skrives til Supabase + n8n, så MASTER
// producerer i den orden (henter 'ready' i priority ASC). Produceret (scripted →
// video) vises i "Live produktion (n8n)"-panelet, ikke her.
const STATUS_LABEL = {
  proposed: "Forslag",
  candidate: "Kandidat",
  ready: "Klar",
};

export default function IdeaQueueBoard({ refreshKey = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const dragIndex = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const load = async () => {
    setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/ideas");
      const d = res.ok ? await res.json() : { queue: [] };
      setItems(Array.isArray(d.queue) ? d.queue : []);
    } catch (e) {
      setItems([]);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [refreshKey]);

  const onDragStart = (i) => { dragIndex.current = i; };
  const onDragOver = (e, i) => {
    e.preventDefault();
    setDragOver(i);
    if (dragIndex.current === null || dragIndex.current === i) return;
    setItems((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIndex.current, 1);
      arr.splice(i, 0, moved);
      dragIndex.current = i;
      return arr;
    });
  };
  const onDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  const onDrop = async () => {
    dragIndex.current = null; setDragOver(null);
    await save();
  };

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const order = items.map((x) => x.case_id || x.id).filter(Boolean);
      const res = await fetch("/api/ideas/reorder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      if (!res.ok) { setMsg("Kunne ikke gemme rækkefølgen."); return; }
      const d = await res.json();
      const reached = d?.n8n?.configured && d?.n8n?.ok;
      setMsg(reached ? "Rækkefølge gemt — opdaterer produktion i n8n ✓" : "Rækkefølge gemt i dashboardet (n8n-webhook ikke koblet på).");
    } catch (e) {
      setMsg("Kunne ikke gemme rækkefølgen.");
    } finally { setSaving(false); }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .iqb-row { display:flex; align-items:center; gap:11px; background:var(--field); border:1px solid var(--line);
          border-radius:12px; padding:11px 13px; margin-top:8px; transition:border-color .12s, box-shadow .12s, opacity .12s; }
        .iqb-row.over { border-color:var(--gold); box-shadow:0 0 0 2px rgba(201,161,78,0.18); }
        .iqb-grip { flex-shrink:0; color:var(--bone-faint); cursor:grab; display:flex; }
        .iqb-grip:active { cursor:grabbing; }
        .iqb-pos { font-family:var(--mono); font-size:12px; color:var(--bone-faint); width:22px; flex-shrink:0; text-align:right; }
        .iqb-body { flex:1; min-width:0; }
        .iqb-t { font-size:13.5px; font-weight:600; line-height:1.35; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .iqb-h { font-size:12px; color:var(--bone-dim); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .iqb-badge { flex-shrink:0; font-family:var(--mono); font-size:9.5px; letter-spacing:0.1em; text-transform:uppercase;
          border-radius:6px; padding:3px 7px; border:1px solid var(--line); color:var(--bone-dim); }
        .iqb-badge.ready { color:var(--green); border-color:rgba(62,157,94,0.45); background:rgba(62,157,94,0.08); }
        .iqb-badge.proposed { color:var(--gold); border-color:rgba(201,161,78,0.45); }
        .iqb-score { flex-shrink:0; font-family:var(--mono); font-size:11px; font-weight:600; color:var(--num);
          border:1px solid var(--line); border-radius:6px; padding:3px 7px; min-width:34px; text-align:center; }
        .iqb-score.hi { color:var(--green); border-color:rgba(62,157,94,0.4); }
        .iqb-score.lo { color:var(--rust); border-color:rgba(176,74,52,0.4); }
        .iqb-headrow { display:flex; align-items:center; gap:11px; padding:2px 13px 4px; }
        .iqb-hl { font-family:var(--mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--bone-faint); }
        .iqb-hl.title { flex:1; padding-left:38px; }
        .iqb-hl.score { width:34px; text-align:center; flex-shrink:0; }
        .iqb-hl.status { width:62px; text-align:center; flex-shrink:0; }
      ` }} />

      <div className="sc-section-label" style={{ marginTop: 22, justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ListOrdered size={11} strokeWidth={2.4} /> Produktions-kø (n8n) — træk for at ændre rækkefølge
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          {saving && <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--bone-faint)", display: "inline-flex", gap: 4, alignItems: "center" }}><Loader2 size={11} className="sc-spin" /> Gemmer</span>}
          <button onClick={load} title="Opdatér"
            style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--bone-faint)" }}>
            {loading ? <Loader2 size={12} className="sc-spin" /> : <RefreshCw size={12} />} Opdatér
          </button>
        </span>
      </div>
      <div className="sc-lede" style={{ marginTop: 0, marginBottom: 8, fontSize: 12 }}>
        Forslag scores automatisk af research-agenten (hver 2. time) — gode sager (70+) bliver <b>klar</b> og produceres. Toppen produceres først; træk for at ændre rækkefølgen.
      </div>

      {loading && <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>Henter kø…</div>}

      {!loading && !items.length && (
        <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>
          Køen er tom. Forslag fra winner-loop (Agenter-fanen) og TREND-agenten lander her.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="iqb-headrow">
          <span className="iqb-hl title">Sag</span>
          <span className="iqb-hl score">Score</span>
          <span className="iqb-hl status">Status</span>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          {items.map((it, i) => (
            <div
              key={it.case_id || it.id || i}
              className={"iqb-row" + (dragOver === i ? " over" : "")}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragEnd={onDragEnd}
            >
              <span className="iqb-grip"><GripVertical size={16} /></span>
              <span className="iqb-pos">{i + 1}</span>
              <div className="iqb-body">
                <div className="iqb-t">{it.title}</div>
                {it.hook && <div className="iqb-h">{it.hook}</div>}
              </div>
              {it.score != null && (
                <span className={"iqb-score" + (it.score >= 70 ? " hi" : " lo")} title="Research-score">{it.score}</span>
              )}
              <span className={"iqb-badge " + (it.status || "")}>{STATUS_LABEL[it.status] || it.status || "—"}</span>
            </div>
          ))}
        </div>
      )}

      {msg && <p className="sc-lede" style={{ marginTop: 8, marginBottom: 0, fontSize: 12, color: "var(--green)" }}>{msg}</p>}
    </>
  );
}
