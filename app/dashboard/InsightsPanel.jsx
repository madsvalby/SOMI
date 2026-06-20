"use client";
import React, { useEffect, useState } from "react";
import {
  Activity, Trophy, Scissors, Eye, AlertTriangle, Sparkles, Loader2, TrendingDown, RefreshCw,
} from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("da-DK").format(Math.round(n || 0));

export default function InsightsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiIdeas, setAiIdeas] = useState([]);
  const [aiErr, setAiErr] = useState("");

  const load = async () => {
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("kunne ikke hente analytics");
      setData(await res.json());
    } catch (e) {
      setErr("Kunne ikke hente winner-loop lige nu.");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const suggestFromWinners = async () => {
    if (!data || !data.winners || !data.winners.length) return;
    setAiBusy(true); setAiErr(""); setAiIdeas([]);
    try {
      const titles = data.winners.map((w) => w.title).join(", ");
      const themes = (data.winnerPattern?.themes || []).map((t) => t.word).join(", ");
      const prompt = `You optimize a YouTube documentary channel about financial crime and corporate collapse.
These are the channel's BEST performing videos by views: ${titles}.
Recurring themes in the winners: ${themes || "n/a"}.
Suggest 5 NEW, real, well-documented cases that match what is already winning (same energy, audience and themes) and would make gripping 15-minute documentaries. For each give a short title and a one-line hook (max 12 words) plus a 1-line "why" tying it to the winning pattern. Return ONLY a JSON array, no markdown, shaped exactly like: [{"name":"...","hook":"...","why":"..."}]`;
      const res = await fetch("/api/anthropic", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const d = await res.json();
      let text = (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const s = text.indexOf("["), e = text.lastIndexOf("]");
      if (s >= 0 && e > s) text = text.slice(s, e + 1);
      const arr = JSON.parse(text);
      const clean = Array.isArray(arr) ? arr.filter((x) => x && x.name).slice(0, 6) : [];
      setAiIdeas(clean);
      if (!clean.length) setAiErr("Ingen forslag kom retur. Prøv igen.");
    } catch (e) {
      setAiErr("Kunne ikke hente forslag lige nu.");
    } finally { setAiBusy(false); }
  };

  const m = data?.metrics;

  return (
    <div className="ins">
      <style dangerouslySetInnerHTML={{ __html: `
        .ins-chip { display:inline-flex; align-items:center; gap:6px; font-family:var(--mono); font-size:9.5px; font-weight:600;
          letter-spacing:0.14em; text-transform:uppercase; border-radius:5px; padding:4px 8px; }
        .ins-chip.live { color:var(--green); border:1px solid rgba(62,157,94,0.45); background:rgba(62,157,94,0.08); }
        .ins-chip.armed { color:var(--amber); border:1px solid var(--amber); }
        .ins-metrics { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:12px; margin-top:6px; }
        .ins-metric { background:var(--panel); border:1px solid var(--line); border-radius:14px; padding:14px 16px;
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -18px rgba(16,24,40,0.16); }
        .ins-metric .v { font-family:var(--mono); font-size:24px; font-weight:600; color:var(--num); line-height:1; }
        .ins-metric .l { font-family:var(--mono); font-size:9.5px; letter-spacing:0.12em; text-transform:uppercase; color:var(--bone-dim); margin-top:7px; }
        .ins-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:14px; margin-top:14px; }
        .ins-card { background:var(--panel); border:1px solid var(--line); border-radius:16px; padding:16px 18px;
          box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -16px rgba(16,24,40,0.16); }
        .ins-card-h { display:flex; align-items:center; gap:9px; font-family:var(--serif); font-size:15.5px; font-weight:600; }
        .ins-card-h svg { color:var(--gold); }
        .ins-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-top:1px solid var(--line-soft); font-size:13px; }
        .ins-row:first-of-type { border-top:none; }
        .ins-row .t { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ins-row .n { font-family:var(--mono); font-size:12px; color:var(--bone-dim); flex-shrink:0; display:inline-flex; align-items:center; gap:5px; }
        .ins-act { font-size:12px; color:var(--bone-dim); margin-top:3px; }
        .ins-themes { display:flex; gap:7px; flex-wrap:wrap; margin:12px 0 6px; }
        .ins-theme { font-family:var(--mono); font-size:11px; color:var(--gold); border:1px solid rgba(201,161,78,0.4); border-radius:20px; padding:4px 10px; }
        .ins-note { font-size:12.5px; color:var(--bone-dim); line-height:1.55; }
        .ins-empty { background:var(--panel); border:1px dashed var(--line); border-radius:16px; padding:22px; text-align:center; }
        .ins-empty .big { font-family:var(--serif); font-size:18px; font-weight:600; margin-top:8px; }
        .ins-empty svg { color:var(--gold); }
        .ins-ai { margin-top:14px; background:linear-gradient(180deg,var(--panel2),var(--panel)); border:1px solid var(--line);
          border-radius:16px; padding:16px 18px; box-shadow:0 1px 2px rgba(16,24,40,0.04),0 10px 26px -16px rgba(16,24,40,0.16); }
        .ins-idea { background:var(--field); border:1px solid var(--line); border-radius:11px; padding:12px 14px; margin-top:8px; }
        .ins-idea .nm { font-size:13.5px; font-weight:600; }
        .ins-idea .hk { font-size:12.5px; color:var(--bone-dim); margin-top:3px; line-height:1.45; }
        .ins-idea .wy { font-size:11.5px; color:var(--gold); margin-top:5px; }
        .ins-btn { display:inline-flex; align-items:center; gap:8px; font-family:var(--mono); font-size:12px; letter-spacing:0.05em;
          background:var(--gold); color:var(--ink); border:none; border-radius:8px; padding:9px 14px; cursor:pointer; font-weight:600; }
        .ins-btn:hover { background:var(--gold-bright); }
        .ins-btn:disabled { opacity:0.6; cursor:default; }
        .ins-muted { font-family:var(--mono); font-size:11px; color:var(--bone-faint); }
        .sc-spin { animation:sc-rot 0.8s linear infinite; }
      ` }} />

      <div className="sc-section-label" style={{ justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Activity size={11} strokeWidth={2.4} /> Winner-loop · Analytics</span>
        <span style={{ display: "inline-flex", gap: 8 }}>
          {data && (data.hasData ? <span className="ins-chip live">● Live</span> : <span className="ins-chip armed">Bevæbnet</span>)}
          <button className="ins-muted" style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }} onClick={load} title="Genberegn">
            <RefreshCw size={12} /> Opdatér
          </button>
        </span>
      </div>

      {loading && <p className="ins-muted">Beregner fra stats_daily…</p>}
      {err && <p className="ins-note" style={{ color: "var(--rust)" }}>{err}</p>}

      {!loading && data && (
        <>
          {m && (
            <div className="ins-metrics">
              <div className="ins-metric"><div className="v">{fmt(m.trackedVideos)}</div><div className="l">Videoer sporet</div></div>
              <div className="ins-metric"><div className="v">{fmt(m.videosWithViews)}</div><div className="l">Med views</div></div>
              <div className="ins-metric"><div className="v">{fmt(m.totalViews)}</div><div className="l">Views i alt</div></div>
              <div className="ins-metric"><div className="v">{fmt(m.medianViews)}</div><div className="l">Median-views</div></div>
            </div>
          )}

          {!data.hasData && (
            <div className="ins-empty" style={{ marginTop: 14 }}>
              <Sparkles size={26} />
              <div className="big">Winner-loop'en er bevæbnet</div>
              <p className="ins-note" style={{ maxWidth: "52ch", margin: "8px auto 0" }}>
                Logikken kører allerede — den finder vindere, underperformere og repurpose-muligheder
                automatisk, så snart der er views i <b>stats_daily</b>. Analytics-cron'en fylder den
                løbende; kanalen er stadig ny, så der er ikke nok signal endnu.
              </p>
            </div>
          )}

          {data.hasData && (
            <>
              <div className="ins-grid">
                <div className="ins-card">
                  <div className="ins-card-h"><Trophy size={16} /> Winner-mønster</div>
                  <div className="ins-themes">
                    {(data.winnerPattern?.themes || []).length
                      ? data.winnerPattern.themes.map((t) => <span key={t.word} className="ins-theme">{t.word} ×{t.n}</span>)
                      : <span className="ins-muted">Ikke nok fælles temaer endnu</span>}
                  </div>
                  <p className="ins-note">Vinderne deler ovenstående temaer. Snit-retention: <b>{data.winnerPattern?.avgRetentionSecPerView || 0}s/view</b>.</p>
                  {data.winners.map((w) => (
                    <div className="ins-row" key={w.video_id}>
                      <span className="t">{w.title}</span>
                      <span className="n"><Eye size={11} /> {fmt(w.views)}</span>
                    </div>
                  ))}
                </div>

                <div className="ins-card">
                  <div className="ins-card-h"><Scissors size={16} /> Repurpose-muligheder</div>
                  {data.repurpose.length ? data.repurpose.map((r) => (
                    <div className="ins-row" key={r.video_id} style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                      <span className="t" style={{ width: "100%" }}>{r.title}</span>
                      <span className="ins-act">→ {r.action}</span>
                    </div>
                  )) : <p className="ins-muted">Ingen vindere at klippe endnu.</p>}
                </div>

                <div className="ins-card">
                  <div className="ins-card-h"><TrendingDown size={16} /> Titel / thumbnail-watchlist</div>
                  {data.watchlist.length ? data.watchlist.map((u) => (
                    <div className="ins-row" key={u.video_id} style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                      <span className="t" style={{ width: "100%" }}>{u.title} · {fmt(u.views)} views</span>
                      <span className="ins-act">→ {u.action}</span>
                    </div>
                  )) : <p className="ins-muted">Ingen underperformere lige nu 🎉</p>}
                </div>
              </div>

              <div className="ins-ai">
                <div className="ins-card-h"><Sparkles size={16} /> Nye idéer fra vinderne</div>
                <p className="ins-note" style={{ margin: "6px 0 12px", maxWidth: "60ch" }}>
                  Lad AI'en foreslå nye sager der matcher det der allerede vinder (samme temaer og energi).
                </p>
                <button className="ins-btn" onClick={suggestFromWinners} disabled={aiBusy}>
                  {aiBusy ? <Loader2 size={13} className="sc-spin" /> : <Sparkles size={13} />}
                  {aiBusy ? "Tænker…" : "Foreslå idéer"}
                </button>
                {aiErr && <p className="ins-note" style={{ color: "var(--rust)", marginTop: 10 }}>{aiErr}</p>}
                {aiIdeas.map((idea, i) => (
                  <div className="ins-idea" key={i}>
                    <div className="nm">{idea.name}</div>
                    {idea.hook && <div className="hk">{idea.hook}</div>}
                    {idea.why && <div className="wy">▸ {idea.why}</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
