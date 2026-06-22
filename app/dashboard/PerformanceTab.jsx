"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

// Farver afstemt med temaet (guld-accent, dæmpet)
const GOLD = "#C9A14E";
const INK = "#23252B";
const MUTE = "#8C8F98";
const GRID = "#ECEAE3";
const TEAL = "#3E7C7B";
const BLUE = "#4A6FA5";
const RUST = "#C9392E";
const GREEN = "#3E8E5A";
const PROVIDER_COLORS = [GOLD, TEAL, BLUE, "#9A7BB0", "#B0843E", MUTE];

const nf = new Intl.NumberFormat("da-DK");
const fmt = (n) => (n == null ? "—" : nf.format(n));
const usd = (n) => "$" + (Number(n) || 0).toFixed(2);
const dShort = (d) => {
  const p = String(d).slice(5).split("-"); // MM-DD
  return p.length === 2 ? `${p[1]}/${p[0]}` : String(d);
};

const STATUS = {
  published: { t: "Publiceret", c: GREEN },
  uploadet_privat: { t: "Uploadet (privat)", c: GOLD },
  producerer: { t: "Producerer", c: MUTE },
  til_godkendelse: { t: "Til godkendelse", c: BLUE },
  needs_review: { t: "Kræver review", c: RUST },
};

function card(children, style) {
  return (
    <div style={{ background: "var(--panel, #fff)", border: "1px solid var(--line, #E7E5DE)", borderRadius: 12, padding: "14px 16px 10px", ...style }}>
      {children}
    </div>
  );
}

const tooltipStyle = { background: "#fff", border: "1px solid " + GRID, borderRadius: 8, fontSize: 12, color: INK, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" };

function ChartCard({ label, note, children }) {
  return card(
    <>
      <div className="sc-section-label" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
      {note && <div style={{ fontSize: 11.5, color: MUTE, marginTop: 4 }}>{note}</div>}
    </>
  );
}

export default function PerformanceTab({ onRefreshed }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState("");

  async function load() {
    try {
      const r = await fetch("/api/performance");
      if (r.ok) setData(await r.json());
      else setErr(true);
    } catch (e) { setErr(true); }
  }

  useEffect(() => { load(); }, []);

  async function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    setNote("");
    try {
      const r = await fetch("/api/performance/refresh", { method: "POST" });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        await load();
        if (onRefreshed) onRefreshed();   // hold Overblik i sync (samme kanal-tal)
        setNote("opdateret " + new Date().toLocaleTimeString("da-DK", { hour: "2-digit", minute: "2-digit" }));
      } else {
        setNote("fejl: " + (j.error || r.status));
      }
    } catch (e) {
      setNote("fejl: " + String(e.message || e));
    } finally {
      setRefreshing(false);
    }
  }

  if (err) return <div className="sc-lede">Kunne ikke hente performance-data.</div>;
  if (!data) return <div className="sc-lede">Henter udvikling…</div>;

  const { series = [], costByProvider = [], videos = [], totals = {}, subsPoints = 0 } = data;
  const lastDate = series.length ? series[series.length - 1].date : null;
  const sd = series.map((s) => ({ ...s, d: dShort(s.date) }));
  const subsData = sd.filter((s) => s.subs != null);
  const viewsData = sd.filter((s) => s.views != null);
  const costData = sd.filter((s) => s.cost != null);
  const buildingNote = subsPoints < 2
    ? "Bygger sig op — tidsserien udvides med ét dagligt snapshot. Trend-kurver kræver et par dages data."
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="sc-section-label" style={{ marginTop: 4, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span><TrendIcon /> Udvikling · kanalens performance over tid</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 400 }}>
          {lastDate && (
            <span style={{ fontSize: 11, color: MUTE, textTransform: "none", letterSpacing: 0 }}>
              Data pr. {dShort(lastDate)}{note ? " · " + note : ""}
            </span>
          )}
          <button onClick={refresh} disabled={refreshing} title="Hent friske kanal-tal nu"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
              padding: "5px 11px", borderRadius: 8, cursor: refreshing ? "default" : "pointer",
              border: "1px solid var(--line, #E7E5DE)", background: "var(--panel, #fff)", color: INK,
              opacity: refreshing ? 0.6 : 1, textTransform: "none", letterSpacing: 0 }}>
            <RefreshIcon /> {refreshing ? "Opdaterer…" : "Opdater"}
          </button>
        </span>
      </div>

      {/* KPI-stribe */}
      <div className="sc-kpis">
        <div className="sc-kpi"><div className="sc-kpi-num">{fmt(totals.subs)}</div><div className="sc-kpi-lbl">Abonnenter</div></div>
        <div className="sc-kpi"><div className="sc-kpi-num">{fmt(totals.views)}</div><div className="sc-kpi-lbl">Visninger</div></div>
        <div className="sc-kpi"><div className="sc-kpi-num">{fmt(totals.videos)}</div><div className="sc-kpi-lbl">Videoer</div></div>
        <div className="sc-kpi"><div className="sc-kpi-num">{usd(totals.spend)}</div><div className="sc-kpi-lbl">Forbrug i alt</div></div>
        <div className="sc-kpi">
          <div className="sc-kpi-num" style={{ color: (totals.profit || 0) >= 0 ? GREEN : RUST }}>{usd(totals.profit)}</div>
          <div className="sc-kpi-lbl">Profit (indtjening − forbrug)</div>
        </div>
      </div>

      {/* To kolonner: subs + views */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <ChartCard label="Abonnent-vækst" note={buildingNote}>
          <AreaChart data={subsData} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gSubs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity={0.35} />
                <stop offset="100%" stopColor={TEAL} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="d" tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={false} width={36} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), "Abonnenter"]} />
            <Area type="monotone" dataKey="subs" stroke={TEAL} strokeWidth={2} fill="url(#gSubs)" dot={{ r: 2.5, fill: TEAL }} />
          </AreaChart>
        </ChartCard>

        <ChartCard label="Visninger over tid" note={buildingNote}>
          <LineChart data={viewsData} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="d" tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
            <YAxis tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={false} width={42} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [fmt(v), "Visninger"]} />
            <Line type="monotone" dataKey="views" stroke={BLUE} strokeWidth={2} dot={{ r: 2.5, fill: BLUE }} />
          </LineChart>
        </ChartCard>
      </div>

      {/* Omkostning pr. dag */}
      <ChartCard label="Omkostning pr. dag (USD)">
        <BarChart data={costData} margin={{ top: 6, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="d" tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={false} width={36} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [usd(v), "Omkostning"]} cursor={{ fill: "rgba(201,161,78,0.08)" }} />
          <Bar dataKey="cost" fill={GOLD} radius={[3, 3, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ChartCard>

      {/* Omkostning pr. leverandør + scorecard side om side */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <ChartCard label="Omkostning pr. leverandør">
          <BarChart data={costByProvider} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid stroke={GRID} horizontal={false} />
            <XAxis type="number" tick={{ fill: MUTE, fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="provider" tick={{ fill: INK, fontSize: 11 }} tickLine={false} axisLine={false} width={130} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [usd(v), "I alt"]} cursor={{ fill: "rgba(201,161,78,0.08)" }} />
            <Bar dataKey="usd" radius={[0, 3, 3, 0]} maxBarSize={22}>
              {costByProvider.map((e, i) => <Cell key={i} fill={PROVIDER_COLORS[i % PROVIDER_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ChartCard>

        {card(
          <>
            <div className="sc-section-label" style={{ marginBottom: 8 }}>Video-scorecard</div>
            <div style={{ maxHeight: 230, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                <thead>
                  <tr style={{ textAlign: "left", color: MUTE, fontSize: 11 }}>
                    <th style={{ padding: "4px 6px", fontWeight: 600 }}>Video</th>
                    <th style={{ padding: "4px 6px", fontWeight: 600 }}>Status</th>
                    <th style={{ padding: "4px 6px", fontWeight: 600, textAlign: "right" }}>Pris</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.slice(0, 40).map((v) => {
                    const st = STATUS[v.status] || { t: v.status || "—", c: MUTE };
                    return (
                      <tr key={v.video_id} style={{ borderTop: "1px solid " + GRID }}>
                        <td style={{ padding: "6px 6px", color: INK, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={v.title}>{v.title}</td>
                        <td style={{ padding: "6px 6px" }}><span style={{ color: st.c, fontSize: 11, fontWeight: 600 }}>{st.t}</span></td>
                        <td style={{ padding: "6px 6px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: INK }}>{usd(v.cost)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 11.5, color: MUTE, marginTop: 6 }}>Per-video visninger/retention tilføjes når YouTube Analytics begynder at flyde.</div>
          </>
        )}
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
