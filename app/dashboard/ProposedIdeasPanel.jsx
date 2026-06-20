"use client";
import React, { useEffect, useState } from "react";
import { Inbox, RefreshCw, Loader2 } from "lucide-react";

// Read-only visning af winner-loop-forslag i ideas-tabellen (status='proposed').
// Lukker den synlige ende af auto-idé-loop'en: forslag gemt fra Agenter-fanen
// (eller den ugentlige cron) dukker op her, klar til din godkendelse.
export default function ProposedIdeasPanel() {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ideas");
      if (!res.ok) throw new Error();
      const d = await res.json();
      setRows(Array.isArray(d.proposed) ? d.proposed : []);
    } catch (e) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="sc-section-label" style={{ marginTop: 22, justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Inbox size={11} strokeWidth={2.4} /> Auto-forslag fra winner-loop
        </span>
        <button onClick={load} title="Opdatér"
          style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--bone-faint)" }}>
          {loading ? <Loader2 size={12} className="sc-spin" /> : <RefreshCw size={12} />} Opdatér
        </button>
      </div>
      <div className="sc-lede" style={{ marginTop: 0, marginBottom: 8, fontSize: 12 }}>
        Idéer udledt af det der vinder — skrevet i ideas-tabellen som <b>forslag</b>. Auto-produceres ikke; godkend dem i n8n når du er klar.
      </div>

      {loading && <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>Henter forslag…</div>}

      {!loading && rows && rows.length === 0 && (
        <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>
          Ingen forslag endnu. Generér dem på <b>Agenter</b>-fanen (winner-loop) eller vent på den ugentlige auto-kørsel.
        </div>
      )}

      {!loading && rows && rows.length > 0 && (
        <div className="sc-phase">
          <div className="sc-steps" style={{ borderTop: "none" }}>
            {rows.map((r) => (
              <div key={r.id} className="sc-step">
                <div className="sc-step-row">
                  <div className="sc-step-body" style={{ minWidth: 0 }}>
                    <div className="sc-step-title">{r.title}</div>
                    {r.hook && <div style={{ fontSize: 12, color: "var(--bone-dim)", marginTop: 3, lineHeight: 1.45 }}>{r.hook}</div>}
                  </div>
                  <span className="sc-pill static queued">{r.status || "proposed"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
