"use client";
import React, { useEffect, useState } from "react";

const INK = "#23252B";
const MUTE = "#8C8F98";
const GOLD = "#C9A14E";
const LINE = "var(--line, #E7E5DE)";

// Inline **fed** → <strong>
function inline(text, keyBase) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={keyBase + "-" + i} style={{ color: INK }}>{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={keyBase + "-" + i}>{p}</React.Fragment>;
  });
}

// Kompakt markdown-renderer til vores rapport-format (overskrifter, lister, fed, hr)
function renderMarkdown(md) {
  const lines = String(md || "").replace(/\r/g, "").split("\n");
  const out = [];
  let list = null; // { ordered, items: [] }
  const flush = () => {
    if (list) {
      const Tag = list.ordered ? "ol" : "ul";
      out.push(<Tag key={"l" + out.length} style={{ margin: "4px 0 10px", paddingLeft: 20, color: "#3a3d44", lineHeight: 1.55 }}>{list.items}</Tag>);
      list = null;
    }
  };
  lines.forEach((raw, idx) => {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) { flush(); return; }
    if (/^#{1,6}\s/.test(line)) {
      flush();
      const lvl = line.match(/^#+/)[0].length;
      const txt = line.replace(/^#+\s/, "");
      const sizes = { 1: 21, 2: 16.5, 3: 14 };
      out.push(
        <div key={"h" + idx} style={{
          fontFamily: "var(--serif, Fraunces, Georgia, serif)",
          fontSize: sizes[lvl] || 13.5, fontWeight: lvl <= 2 ? 600 : 600,
          color: INK, margin: lvl === 1 ? "2px 0 12px" : "16px 0 6px",
          borderBottom: lvl === 1 ? "1px solid " + LINE : "none", paddingBottom: lvl === 1 ? 8 : 0,
        }}>{inline(txt, "h" + idx)}</div>
      );
      return;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flush();
      out.push(<hr key={"hr" + idx} style={{ border: "none", borderTop: "1px solid " + LINE, margin: "14px 0" }} />);
      return;
    }
    const ol = line.match(/^\s*(\d+)\.\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ol || ul) {
      const ordered = !!ol;
      if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; }
      const txt = ol ? ol[2] : ul[1];
      list.items.push(<li key={"li" + idx} style={{ margin: "2px 0" }}>{inline(txt, "li" + idx)}</li>);
      return;
    }
    flush();
    out.push(<p key={"p" + idx} style={{ margin: "0 0 10px", color: "#3a3d44", lineHeight: 1.6, fontSize: 13.5 }}>{inline(line, "p" + idx)}</p>);
  });
  flush();
  return out;
}

function fmtDate(s) {
  try {
    return new Date(s).toLocaleDateString("da-DK", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) { return String(s || "").slice(0, 10); }
}

export default function ReportsTab() {
  const [items, setItems] = useState(null);
  const [sel, setSel] = useState(0);
  const [err, setErr] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/reports");
        if (r.ok) { const d = await r.json(); setItems(d.items || []); }
        else setErr(true);
      } catch (e) { setErr(true); }
    })();
  }, []);

  if (err) return <div className="sc-lede">Kunne ikke hente rapporter.</div>;
  if (!items) return <div className="sc-lede">Henter rapporter…</div>;
  if (!items.length) {
    return (
      <div className="sc-lede" style={{ padding: "8px 2px" }}>
        Ingen rapporter endnu. <strong>SOMI Edge</strong> leverer den første ugentlige rapport mandag morgen — konkurrent-intel + vores egen performance, på dansk.
      </div>
    );
  }

  const current = items[Math.min(sel, items.length - 1)];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 240px) 1fr", gap: 16, alignItems: "start" }}>
      {/* Liste */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div className="sc-section-label" style={{ marginBottom: 2 }}>Rapporter</div>
        {items.map((r, i) => {
          const active = i === Math.min(sel, items.length - 1);
          return (
            <button key={r.id} onClick={() => setSel(i)} style={{
              textAlign: "left", padding: "9px 11px", borderRadius: 9, cursor: "pointer",
              background: active ? "rgba(201,161,78,0.12)" : "var(--panel, #fff)",
              border: "1px solid " + (active ? GOLD : LINE), color: INK,
            }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {r.title || "SOMI Edge-rapport"}
              </div>
              <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{fmtDate(r.created_at)}</div>
            </button>
          );
        })}
      </div>

      {/* Indhold */}
      <div style={{ background: "var(--panel, #fff)", border: "1px solid " + LINE, borderRadius: 12, padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: MUTE, fontFamily: "var(--mono, monospace)", letterSpacing: "0.05em" }}>
            {fmtDate(current.created_at)} · SOMI Edge
          </div>
          <a href={"/rapport/" + current.id} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, color: GOLD, fontWeight: 600, textDecoration: "none" }}>
            Åbn som side ↗
          </a>
        </div>
        <div>{renderMarkdown(current.body_md)}</div>
      </div>
    </div>
  );
}
