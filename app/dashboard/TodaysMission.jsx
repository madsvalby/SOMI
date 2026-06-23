"use client";
import React, { useEffect, useState } from "react";
import { Target, Scissors, TrendingDown, Inbox, ClipboardCheck, ArrowRight, Check } from "lucide-react";

const nf = (n) => new Intl.NumberFormat("da-DK").format(Math.round(Number(n) || 0));

// Today's Mission — dagligt fokus-kort. Udleder de 1-3 vigtigste handlinger
// deterministisk af data vi allerede har (winner-loop, idé-kø, produktions-kø).
// Ingen ny opsætning. onGoto(tabId) navigerer til den relevante fane.
export default function TodaysMission({ analytics, liveVideos = [], onGoto }) {
  const [proposedCount, setProposedCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/ideas");
        if (r.ok) { const d = await r.json(); setProposedCount((d.proposed || []).length); }
      } catch (e) { /* idé-kø ikke tilgængelig — spring missionen over */ }
    })();
  }, []);

  const missions = [];

  if (proposedCount > 0) {
    missions.push({
      icon: Inbox, tone: "var(--gold)", goto: "ko",
      text: `Godkend ${proposedCount} forslag i idé-køen`,
      detail: "Winner-loop'en har lagt nye sager klar — godkend dem så de kan produceres.",
    });
  }

  const pending = liveVideos.filter((v) => v.status === "til_godkendelse" || v.status === "needs_review");
  if (pending.length) {
    missions.push({
      icon: ClipboardCheck, tone: "var(--amber, #C9A14E)", goto: "ko",
      text: `${pending.length} ${pending.length === 1 ? "video venter" : "videoer venter"} på godkendelse/review`,
      detail: pending.slice(0, 2).map((v) => v.case).join(" · "),
    });
  }

  const rep = analytics?.repurpose?.[0];
  if (rep) {
    missions.push({
      icon: Scissors, tone: "var(--green)", goto: "opslag",
      text: `Ompak vinderen "${rep.title}" til 3 shorts`,
      detail: `${nf(rep.views)} visninger — høst dem på kort form.`,
    });
  }

  const wl = analytics?.watchlist?.[0];
  if (wl) {
    missions.push({
      icon: TrendingDown, tone: "var(--rust)", goto: "agenter",
      text: `Test ny titel + thumbnail på "${wl.title}"`,
      detail: "Underperformer — se doktorens diagnose + nye titel/thumbnail-forslag.",
    });
  }

  const top = missions.slice(0, 3);

  return (
    <div className="tm">
      <style dangerouslySetInnerHTML={{ __html: `
        .tm { background:linear-gradient(180deg,var(--panel2,var(--panel)),var(--panel)); border:1px solid var(--line);
          border-radius:18px; padding:18px 20px; margin-bottom:18px;
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 18px 40px -28px rgba(16,24,40,0.22); }
        .tm-h { display:flex; align-items:center; gap:9px; font-family:var(--serif); font-size:16px; font-weight:600; }
        .tm-h svg { color:var(--gold); }
        .tm-sub { font-size:12px; color:var(--bone-dim); margin:3px 0 12px 0; }
        .tm-list { display:flex; flex-direction:column; gap:9px; }
        .tm-item { display:flex; align-items:flex-start; gap:11px; background:var(--field); border:1px solid var(--line);
          border-radius:12px; padding:12px 14px; cursor:pointer; transition:border-color .12s, transform .12s; }
        .tm-item:hover { border-color:var(--gold); transform:translateY(-1px); }
        .tm-ic { flex-shrink:0; margin-top:1px; }
        .tm-body { flex:1; min-width:0; }
        .tm-t { font-size:13.5px; font-weight:600; line-height:1.4; }
        .tm-d { font-size:12px; color:var(--bone-dim); margin-top:3px; line-height:1.45; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .tm-go { flex-shrink:0; color:var(--bone-faint); margin-top:2px; }
        .tm-item:hover .tm-go { color:var(--gold); }
        .tm-empty { display:flex; align-items:center; gap:9px; font-size:13px; color:var(--bone-dim);
          background:var(--field); border:1px solid var(--line); border-radius:12px; padding:13px 15px; }
        .tm-empty svg { color:var(--green); flex-shrink:0; }
      ` }} />
      <div className="tm-h"><Target size={17} strokeWidth={2.2} /> Today's Mission</div>
      <div className="tm-sub">De vigtigste handlinger lige nu — udledt af winner-loop, idé-køen og produktions-køen.</div>

      {top.length > 0 ? (
        <div className="tm-list">
          {top.map((m, i) => {
            const Ic = m.icon;
            return (
              <div className="tm-item" key={i} onClick={() => onGoto && onGoto(m.goto)} role="button" tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onGoto && onGoto(m.goto)}>
                <Ic size={17} className="tm-ic" style={{ color: m.tone }} />
                <div className="tm-body">
                  <div className="tm-t">{m.text}</div>
                  {m.detail && <div className="tm-d">{m.detail}</div>}
                </div>
                <ArrowRight size={15} className="tm-go" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="tm-empty">
          <Check size={17} strokeWidth={2.5} />
          Intet brændende lige nu. Hold kadencen (long hver 2.–3. dag, short dagligt) — winner-loop'en tænder automatisk når der kommer views.
        </div>
      )}
    </div>
  );
}
