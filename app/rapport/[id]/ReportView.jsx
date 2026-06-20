"use client";
import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const GOLD = "#C9A14E";
const INK = "#1E2024";
const MUTE = "#8C8F98";
const GRID = "#ECE7DC";
const TEAL = "#3E7C7B";

const nf = new Intl.NumberFormat("da-DK");
const dShort = (d) => { const p = String(d).slice(5).split("-"); return p.length === 2 ? `${p[1]}/${p[0]}` : String(d); };
const fmtDate = (s) => { try { return new Date(s).toLocaleDateString("da-DK", { day: "2-digit", month: "long", year: "numeric" }); } catch (e) { return String(s || "").slice(0, 10); } };

function inline(text, kb) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={kb + i}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={kb + i}>{p}</React.Fragment>
  );
}
function renderMarkdown(md) {
  const lines = String(md || "").replace(/\r/g, "").split("\n");
  const out = []; let list = null;
  const flush = () => { if (list) { const T = list.ordered ? "ol" : "ul"; out.push(<T key={"l" + out.length} className="rv-list">{list.items}</T>); list = null; } };
  lines.forEach((raw, idx) => {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) { flush(); return; }
    if (/^#{1,6}\s/.test(line)) {
      flush();
      const lvl = line.match(/^#+/)[0].length;
      const txt = line.replace(/^#+\s/, "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim();
      const Tag = lvl === 1 ? "h1" : lvl === 2 ? "h2" : "h3";
      out.push(<Tag key={"h" + idx} className={"rv-" + Tag}>{inline(txt, "h" + idx)}</Tag>);
      return;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) { flush(); out.push(<hr key={"hr" + idx} className="rv-hr" />); return; }
    const ol = line.match(/^\s*(\d+)\.\s+(.*)$/), ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ol || ul) {
      const ordered = !!ol;
      if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; }
      list.items.push(<li key={"li" + idx}>{inline(ol ? ol[2] : ul[1], "li" + idx)}</li>);
      return;
    }
    flush();
    out.push(<p key={"p" + idx} className="rv-p">{inline(line, "p" + idx)}</p>);
  });
  flush();
  return out;
}

const tip = { background: "#fff", border: "1px solid " + GRID, borderRadius: 8, fontSize: 12, color: INK };

export default function ReportView({ report, series }) {
  const sd = (series || []).map((s) => ({ ...s, d: dShort(s.date), subs: s.subs == null ? null : Number(s.subs), cost: s.cost_usd == null ? 0 : Number(s.cost_usd) }));
  const subsData = sd.filter((s) => s.subs != null);
  const costData = sd.filter((s) => s.cost != null);
  const hasCharts = subsData.length > 0 || costData.length > 1;

  return (
    <div className="rv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap');
        .rv-root { min-height:100vh; background:#F1EDE4; padding:40px 16px 80px; font-family:Inter, system-ui, sans-serif; color:#2c2f35; }
        .rv-doc { max-width:840px; margin:0 auto; background:#fff; border:1px solid #E7E0D2; border-radius:16px; box-shadow:0 10px 40px rgba(40,33,20,0.08); overflow:hidden; }
        .rv-band { background:linear-gradient(120deg,#15171C,#23262E); color:#fff; padding:30px 44px 26px; }
        .rv-eyebrow { font-size:11px; letter-spacing:0.22em; text-transform:uppercase; color:${GOLD}; font-weight:600; }
        .rv-band h1 { font-family:Fraunces, Georgia, serif; font-size:27px; line-height:1.18; margin:10px 0 6px; font-weight:600; color:#fff; }
        .rv-band .rv-date { font-size:12.5px; color:#B9BCC4; font-family:'Inter',sans-serif; }
        .rv-gold-rule { height:3px; background:${GOLD}; }
        .rv-body { padding:30px 44px 40px; }
        .rv-charts { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:18px; margin:0 0 26px; }
        .rv-chartcard { border:1px solid ${GRID}; border-radius:12px; padding:14px 16px 8px; background:#FCFBF8; }
        .rv-chartlbl { font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:${MUTE}; font-weight:600; margin-bottom:8px; }
        .rv-h1 { font-family:Fraunces,Georgia,serif; font-size:23px; font-weight:600; color:${INK}; margin:6px 0 14px; padding-bottom:10px; border-bottom:1px solid ${GRID}; }
        .rv-h2 { font-family:Fraunces,Georgia,serif; font-size:18px; font-weight:600; color:${INK}; margin:24px 0 8px; }
        .rv-h3 { font-size:14.5px; font-weight:600; color:${INK}; margin:16px 0 5px; }
        .rv-p { font-size:14.5px; line-height:1.7; margin:0 0 12px; color:#3a3d44; }
        .rv-list { margin:4px 0 14px; padding-left:22px; line-height:1.7; font-size:14.5px; color:#3a3d44; }
        .rv-list li { margin:4px 0; }
        .rv-hr { border:none; border-top:1px solid ${GRID}; margin:20px 0; }
        .rv-doc strong { color:${INK}; }
        .rv-foot { text-align:center; font-size:11.5px; color:${MUTE}; margin-top:18px; }
        @media print { .rv-root { background:#fff; padding:0; } .rv-doc { box-shadow:none; border:none; } }
      `}</style>

      <div className="rv-doc">
        <div className="rv-band">
          <div className="rv-eyebrow">Paper Empires · SOMI Edge</div>
          <h1>{report.title || "Ugentlig rapport"}</h1>
          <div className="rv-date">{fmtDate(report.created_at)}</div>
        </div>
        <div className="rv-gold-rule" />
        <div className="rv-body">
          {hasCharts && (
            <div className="rv-charts">
              {subsData.length > 0 && (
                <div className="rv-chartcard">
                  <div className="rv-chartlbl">Abonnent-vækst</div>
                  <div style={{ width: "100%", height: 170 }}>
                    <ResponsiveContainer>
                      <AreaChart data={subsData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                        <defs><linearGradient id="rgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={TEAL} stopOpacity={0.35} /><stop offset="100%" stopColor={TEAL} stopOpacity={0.03} /></linearGradient></defs>
                        <CartesianGrid stroke={GRID} vertical={false} />
                        <XAxis dataKey="d" tick={{ fill: MUTE, fontSize: 10 }} tickLine={false} axisLine={{ stroke: GRID }} />
                        <YAxis tick={{ fill: MUTE, fontSize: 10 }} tickLine={false} axisLine={false} width={30} allowDecimals={false} />
                        <Tooltip contentStyle={tip} formatter={(v) => [nf.format(v), "Abonnenter"]} />
                        <Area type="monotone" dataKey="subs" stroke={TEAL} strokeWidth={2} fill="url(#rgS)" dot={{ r: 2.5, fill: TEAL }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {costData.length > 1 && (
                <div className="rv-chartcard">
                  <div className="rv-chartlbl">Omkostning pr. dag (USD)</div>
                  <div style={{ width: "100%", height: 170 }}>
                    <ResponsiveContainer>
                      <BarChart data={costData} margin={{ top: 6, right: 8, left: -12, bottom: 0 }}>
                        <CartesianGrid stroke={GRID} vertical={false} />
                        <XAxis dataKey="d" tick={{ fill: MUTE, fontSize: 10 }} tickLine={false} axisLine={{ stroke: GRID }} />
                        <YAxis tick={{ fill: MUTE, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                        <Tooltip contentStyle={tip} formatter={(v) => ["$" + Number(v).toFixed(2), "Omkostning"]} cursor={{ fill: "rgba(201,161,78,0.08)" }} />
                        <Bar dataKey="cost" fill={GOLD} radius={[3, 3, 0, 0]} maxBarSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
          <div>{renderMarkdown(report.body_md)}</div>
          <div className="rv-foot">Genereret automatisk af SOMI Edge · Paper Empires</div>
        </div>
      </div>
    </div>
  );
}
