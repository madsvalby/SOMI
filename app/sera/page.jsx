"use client";
import React, { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SERA — AI virtual creator link-hub. Separat brand fra Paper Empires.
// SFW only · 18+ notice · tydelig AI-disclosure · UTM + dashboard-koblet tracking.
// Links er admin-konfigurerbare via dashboardet (VCL → Platforme → Profil-URL) og
// hentes fra /api/vcl/public. Ingen eksplicit public content.
// ─────────────────────────────────────────────────────────────────────────────

const FALLBACK = {
  brand: "Sera",
  disclosure: "AI-generated virtual creator · not a real person · 18+",
  links: [],
};
const PLACEHOLDERS = [
  { key: "fanvue", label: "Fanvue", role: "Exclusive content" },
  { key: "instagram", label: "Instagram", role: "Daily glimpses" },
];

function withUtm(url) {
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set("utm_source", "sera_hub");
    u.searchParams.set("utm_medium", "link_hub");
    u.searchParams.set("utm_campaign", "landing");
    return u.toString();
  } catch (e) {
    return url;
  }
}

function track(event, extra) {
  try {
    const payload = JSON.stringify({ event, ...(extra || {}) });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/vcl/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/vcl/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
    }
  } catch (e) {
    /* best-effort */
  }
}

export default function SeraLanding() {
  const [gate, setGate] = useState("pending"); // pending | ok | no
  const [cfg, setCfg] = useState(FALLBACK);

  useEffect(() => {
    try {
      if (localStorage.getItem("sera_age_ok") === "1") setGate("ok");
    } catch (e) { /* ignore */ }
    fetch("/api/vcl/public")
      .then((r) => (r.ok ? r.json() : FALLBACK))
      .then((d) => setCfg({ ...FALLBACK, ...(d || {}) }))
      .catch(() => setCfg(FALLBACK));
  }, []);

  useEffect(() => {
    if (gate === "ok") track("view");
  }, [gate]);

  const confirmAge = () => {
    try { localStorage.setItem("sera_age_ok", "1"); } catch (e) { /* ignore */ }
    setGate("ok");
  };

  const links = cfg.links && cfg.links.length ? cfg.links : null;

  return (
    <main className="sera-root">
      <div className="sera-mesh" aria-hidden="true" />
      <div className="sera-grain" aria-hidden="true" />

      {/* 18+ gate */}
      {gate !== "ok" && (
        <div className="sera-gate">
          <div className="sera-gate-card">
            <div className="sera-orb sera-orb--sm" aria-hidden="true"><span>S</span></div>
            {gate === "no" ? (
              <>
                <h1>Come back later</h1>
                <p>This site is for adults only (18+).</p>
                <a className="sera-gate-leave" href="https://www.google.com">Leave</a>
              </>
            ) : (
              <>
                <h1>Are you 18 or older?</h1>
                <p className="sera-gate-sub">
                  <b>Sera</b> is an <b>AI-generated virtual creator</b> — not a real person. This page contains
                  no explicit content, but the hub may link to 18+ platforms.
                </p>
                <div className="sera-gate-btns">
                  <button className="sera-btn sera-btn--primary" onClick={confirmAge}>I'm 18 or older</button>
                  <button className="sera-btn sera-btn--ghost" onClick={() => setGate("no")}>I'm under 18</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hub */}
      {gate === "ok" && (
        <div className="sera-hub">
          <div className="sera-orb" aria-hidden="true"><span>S</span></div>
          <h1 className="sera-name">{cfg.brand || "Sera"}</h1>
          <p className="sera-tag">Synthetic muse · rendered, not born</p>

          <div className="sera-ai-badge" title="AI disclosure">
            <span className="sera-ai-dot" /> {cfg.disclosure || FALLBACK.disclosure}
          </div>

          <div className="sera-links">
            {links
              ? links.map((l) => (
                  <a
                    key={l.key}
                    className="sera-link"
                    href={withUtm(l.url)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    onClick={() => track("click", { platform: l.key })}
                  >
                    <span className="sera-link-l">{l.label}</span>
                    {l.role ? <span className="sera-link-r">{l.role}</span> : null}
                    <span className="sera-link-arrow" aria-hidden="true">→</span>
                  </a>
                ))
              : PLACEHOLDERS.map((l) => (
                  <span key={l.key} className="sera-link sera-link--soon" aria-disabled="true">
                    <span className="sera-link-l">{l.label}</span>
                    <span className="sera-link-r">{l.role}</span>
                    <span className="sera-link-soon">soon</span>
                  </span>
                ))}
          </div>

          <footer className="sera-foot">
            <span className="sera-foot-18">18+</span>
            <span>AI-generated virtual creator. Not a real person. All content is synthetic.</span>
          </footer>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: SERA_CSS }} />
    </main>
  );
}

const SERA_CSS = `
.sera-root { position:relative; min-height:100vh; width:100%; overflow:hidden;
  background:#08060F; color:#F4F2FB;
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  display:flex; align-items:center; justify-content:center; padding:32px 18px; box-sizing:border-box; }
.sera-mesh { position:absolute; inset:-20% -20% -20% -20%; z-index:0; pointer-events:none;
  background:
    radial-gradient(40% 35% at 20% 20%, rgba(167,139,250,.32), transparent 70%),
    radial-gradient(40% 35% at 82% 18%, rgba(34,211,238,.22), transparent 70%),
    radial-gradient(45% 40% at 70% 85%, rgba(244,114,182,.24), transparent 70%),
    radial-gradient(50% 45% at 25% 80%, rgba(99,102,241,.20), transparent 72%);
  filter:blur(20px); animation:sera-drift 18s ease-in-out infinite alternate; }
@keyframes sera-drift { from { transform:translate3d(0,0,0) scale(1); } to { transform:translate3d(0,-3%,0) scale(1.06); } }
.sera-grain { position:absolute; inset:0; z-index:1; pointer-events:none; opacity:.05; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
.sera-hub, .sera-gate { position:relative; z-index:2; width:100%; max-width:420px; }
.sera-gate { display:flex; align-items:center; justify-content:center; }
.sera-gate-card { width:100%; text-align:center; background:rgba(14,11,26,.72); backdrop-filter:blur(14px);
  border:1px solid rgba(255,255,255,.10); border-radius:22px; padding:34px 26px; }
.sera-gate-card h1 { font-size:22px; font-weight:600; margin:14px 0 8px; letter-spacing:-.01em; }
.sera-gate-sub { font-size:13px; line-height:1.6; color:#B7B2CE; margin:0 0 20px; }
.sera-gate-sub b { color:#F4F2FB; }
.sera-gate-btns { display:flex; flex-direction:column; gap:10px; }
.sera-gate-leave { display:inline-block; margin-top:8px; color:#8E89A6; font-size:13px; text-decoration:none; }
.sera-btn { border:none; border-radius:12px; padding:13px 18px; font-size:14px; font-weight:600; cursor:pointer; font-family:inherit; }
.sera-btn--primary { color:#0A0814; background:linear-gradient(135deg,#A78BFA,#22D3EE 55%,#F472B6); }
.sera-btn--ghost { color:#C9C5DD; background:transparent; border:1px solid rgba(255,255,255,.14); }
.sera-hub { text-align:center; display:flex; flex-direction:column; align-items:center; }
.sera-orb { width:96px; height:96px; border-radius:50%; display:grid; place-items:center; margin-bottom:18px;
  background:conic-gradient(from 210deg, #A78BFA, #22D3EE, #F472B6, #A78BFA);
  box-shadow:0 0 0 1px rgba(255,255,255,.18), 0 18px 50px -12px rgba(167,139,250,.6); position:relative; }
.sera-orb::after { content:""; position:absolute; inset:5px; border-radius:50%; background:radial-gradient(circle at 32% 28%, rgba(255,255,255,.5), rgba(8,6,15,.85) 62%); }
.sera-orb span { position:relative; z-index:1; font-weight:700; font-size:38px; letter-spacing:.02em;
  color:#fff; text-shadow:0 1px 10px rgba(0,0,0,.5); }
.sera-orb--sm { width:60px; height:60px; margin:0 auto 4px; }
.sera-orb--sm span { font-size:24px; }
.sera-name { font-size:40px; font-weight:700; letter-spacing:.18em; margin:0; text-transform:uppercase;
  background:linear-gradient(180deg,#FFFFFF,#C9C5DD); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.sera-tag { font-size:13px; color:#A9A4C2; margin:8px 0 18px; letter-spacing:.02em; }
.sera-ai-badge { display:inline-flex; align-items:center; gap:8px; font-size:11.5px; color:#CFCBE2;
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); border-radius:999px; padding:7px 14px; margin-bottom:26px; }
.sera-ai-dot { width:7px; height:7px; border-radius:50%; background:linear-gradient(135deg,#A78BFA,#22D3EE); box-shadow:0 0 8px rgba(167,139,250,.9); flex-shrink:0; }
.sera-links { width:100%; display:flex; flex-direction:column; gap:12px; }
.sera-link { display:flex; align-items:center; gap:12px; text-align:left; text-decoration:none;
  background:rgba(255,255,255,.045); border:1px solid rgba(255,255,255,.12); border-radius:16px; padding:16px 18px;
  color:#F4F2FB; transition:transform .14s ease, border-color .14s ease, background .14s ease; }
.sera-link:hover { transform:translateY(-2px); border-color:rgba(167,139,250,.6); background:rgba(255,255,255,.07); }
.sera-link-l { font-size:15px; font-weight:600; }
.sera-link-r { font-size:12px; color:#A9A4C2; flex:1; }
.sera-link-arrow { font-size:16px; color:#A78BFA; }
.sera-link--soon { cursor:default; opacity:.6; }
.sera-link--soon:hover { transform:none; border-color:rgba(255,255,255,.12); background:rgba(255,255,255,.045); }
.sera-link-soon { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#8E89A6; border:1px solid rgba(255,255,255,.14); border-radius:999px; padding:3px 9px; }
.sera-foot { display:flex; align-items:center; gap:9px; margin-top:30px; font-size:11px; line-height:1.5; color:#8E89A6; }
.sera-foot-18 { flex-shrink:0; font-weight:700; color:#CFCBE2; border:1px solid rgba(255,255,255,.18); border-radius:7px; padding:3px 7px; }
@media (max-width:440px){ .sera-name { font-size:34px; } }
`;
