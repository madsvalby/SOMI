"use client";
import React, { useEffect, useState } from "react";
import { Swords, RefreshCw, Loader2, Crown } from "lucide-react";

const nf = (n) => (n == null ? "—" : new Intl.NumberFormat("da-DK").format(Math.round(n)));
const compact = (n) => {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "K";
  return String(Math.round(n));
};

// Konkurrent-benchmark: Paper Empires målt mod nichens store kanaler.
// Tal er cachede i Supabase (fyldt dagligt af /api/cron/competitors).
export default function CompetitorBenchmark() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/competitors");
      setData(res.ok ? await res.json() : { competitors: [], hasData: false });
    } catch (e) {
      setData({ competitors: [], hasData: false });
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const rows = data?.competitors || [];
  const maxSubs = rows.reduce((m, r) => Math.max(m, r.subs || 0), 0) || 1;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cb-row { display:flex; align-items:center; gap:12px; padding:11px 0; border-top:1px solid var(--line-soft); }
        .cb-row:first-of-type { border-top:none; }
        .cb-rank { font-family:var(--mono); font-size:12px; color:var(--bone-faint); width:20px; flex-shrink:0; }
        .cb-name { flex:1; min-width:0; display:flex; align-items:center; gap:7px; font-size:13.5px; overflow:hidden; }
        .cb-name .nm { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .cb-bar-wrap { flex:1.4; min-width:90px; height:7px; background:var(--field); border-radius:99px; overflow:hidden; }
        .cb-bar { height:100%; border-radius:99px; background:var(--bone-faint); }
        .cb-num { font-family:var(--mono); font-size:12.5px; width:54px; text-align:right; flex-shrink:0; }
        .cb-sub { font-family:var(--mono); font-size:10.5px; color:var(--bone-faint); width:62px; text-align:right; flex-shrink:0; }
        .cb-self { color:var(--gold); font-weight:600; }
        .cb-self .cb-bar { background:linear-gradient(90deg,var(--gold),var(--gold-bright)); }
      ` }} />
      <div className="sc-section-label" style={{ justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Swords size={11} strokeWidth={2.4} /> Konkurrent-benchmark
        </span>
        <button onClick={load} title="Opdatér"
          style={{ background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--bone-faint)" }}>
          {loading ? <Loader2 size={12} className="sc-spin" /> : <RefreshCw size={12} />} Opdatér
        </button>
      </div>

      {loading && <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)" }}>Henter benchmark…</div>}

      {!loading && !rows.length && (
        <div className="sc-alert-ok" style={{ color: "var(--bone-dim)", borderColor: "var(--line)", display: "block", lineHeight: 1.6 }}>
          Ingen tal endnu. Den daglige cron (<code>/api/cron/competitors</code>) henter abonnenter/visninger for
          Coffeezilla, Jake Tran, Patrick Boyle, MagnatesMedia og ColdFusion via YouTube Data API.
          Kræver at <code>YOUTUBE_API_KEY</code> er sat (gratis Data API-nøgle); kør derefter cron'en én gang, så fyldes den.
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="sc-phase" style={{ padding: "4px 16px" }}>
          {rows.map((r, i) => (
            <div className={"cb-row" + (r.isSelf ? " cb-self" : "")} key={r.handle}>
              <span className="cb-rank">{r.isSelf ? <Crown size={13} /> : i + 1}</span>
              <span className="cb-name"><span className="nm">{r.name}</span></span>
              <div className="cb-bar-wrap"><div className="cb-bar" style={{ width: `${Math.max(3, ((r.subs || 0) / maxSubs) * 100)}%` }} /></div>
              <span className="cb-num">{compact(r.subs)}</span>
              <span className="cb-sub">{compact(r.views)} v</span>
            </div>
          ))}
        </div>
      )}
      {!loading && rows.length > 0 && (
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--bone-faint)", marginTop: 6 }}>
          Abonnenter (bar) · samlede visninger (v). {data?.updatedAt ? "Opdateret " + String(data.updatedAt).slice(0, 10) : ""}
        </div>
      )}
    </>
  );
}
