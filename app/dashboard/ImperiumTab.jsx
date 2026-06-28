"use client";
import React, { useState, useEffect } from "react";
import { Rocket, ExternalLink, Check, Sparkles, TrendingUp, Wallet, Target, Star, ArrowUpRight, KeyRound, BarChart3, Eye, MousePointerClick, Mail } from "lucide-react";

const numFmt = new Intl.NumberFormat("da-DK");
const nf = (n) => (n == null ? "0" : numFmt.format(n));

// ─────────────────────────────────────────────────────────────────────────────
// AI-automations-imperiet — 6 venture-planer researchet jun. 2026.
// Hver har en dyb research-rapport + launch-guide + live landing page (Next.js-rute
// i app/imperium/<slug>/). Lead-backend er live (Supabase foundry_orders).
// Rød tråd: self-hosted render + gratis lokal stemmeklon = near-zero marginalkost.
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: "faceless", name: "Faceless Foundry", rank: 1, accent: "#C9A14E", flagship: true,
    oneLine: "Done-for-you faceless dokumentar-videoer med klonet stemme — hele studiet på autopilot.",
    hero: "AI-content der poster sig selv. 30+ branded videoer/md. Nul filmning.",
    price: "€499–1.499/md", market: "$847M AI-video", cagr: "19–21%/år", margin: "90%+",
    audience: "Kanal-ejere & brands der vil have dokumentar-grade YouTube uden at blive demonetiseret",
    bullets: [
      "Self-hosted pipeline — indholdet forlader aldrig dig",
      "Egen klonet, konsistent narrator-stemme inkluderet",
      "Human-in-the-loop: hvert script reviewet (originalt, policy-safe)",
    ],
    needs: ["Domæne", "Stripe", "Entity + DPA", "Voice-consent", "Positionering/pris"],
    badges: ["Landing ✓", "Lead-backend ✓"],
  },
  {
    slug: "listingreel", name: "ListingReel", rank: 2, accent: "#1F9E8F",
    oneLine: "Lav enhver bolig-listing om til en narreret, branded walkthrough-video på minutter.",
    hero: "Hver listing bliver en video. Automatisk.",
    price: "$49–149/md", market: "$59,6B micro-SaaS", cagr: "25–30%/år", margin: "80–95%",
    audience: "Ejendomsmæglere & mæglerkæder der vil have video på hver listing uden videograf",
    bullets: [
      "Øre-pris pr. video — egen render + voice-motor",
      "Én konsistent klonet stemme på hver reel = rigtigt brand",
      "Brokerage-ready: hele teamet på én konto med delt branding",
    ],
    needs: ["EU-entity (ApS)", "Stripe/Paddle", "GDPR + voice-consent", "Domæne", "MLS-API-adgang"],
    badges: ["Landing ✓"],
  },
  {
    slug: "adforge", name: "AdForge", rank: 3, accent: "#E0794E",
    oneLine: "Done-for-you AI UGC-video-annoncer: ubegrænsede varianter til fast månedspris.",
    hero: "Vindende ads bliver trætte. Overproducér trætheden.",
    price: "€499–999/md", market: "$7,1B UGC-ads", cagr: "28%/år", margin: "80–95%",
    audience: "DTC/e-commerce-brands & performance-bureauer (via white-label)",
    bullets: [
      "Flad pris, unlimited varianter — near-zero kost pr. variant",
      "Kun licenserede actors — fuld kommerciel ret på ansigt & stemme",
      "Re-voicer hver ad til nye sprog/markeder gratis",
    ],
    needs: ["Licenseret AI-actor-bibliotek + consent", "Entity/Stripe", "ToS + indemnification", "Domæne"],
    badges: ["Landing ✓"],
  },
  {
    slug: "automation", name: "Northgate Automation", rank: 4, accent: "#3B6FB0",
    oneLine: "Privacy-first, self-hosted AI-automationer (n8n) på kundens egen infrastruktur.",
    hero: "Stop med at lave arbejde en robot burde lave.",
    price: "€3–8K setup + €800–2K/md", market: "$130B automation", cagr: "31%/år", margin: "Per-kunde",
    audience: "SMB'er med følsomme data (GDPR) og manuelle, gentagne workflows",
    bullets: [
      "Data-suverænitet (GDPR) — intet forlader dine servere",
      "Ingen per-task-gebyr — ubegrænsede kørsler på egen infra",
      "Hver automation bundet til ét målbart KPI",
    ],
    needs: ["Entity + bankkonto", "Stripe", "DPA-skabelon", "Første salg"],
    badges: ["Landing ✓", "Guide ✓"],
  },
  {
    slug: "beacon", name: "Beacon", rank: 5, accent: "#7C5CCB",
    oneLine: "GEO/AI-search-visibility: tracker dine citationer i AI-motorer + producerer det content der får dig citeret.",
    hero: "Dine kunder spørger AI. Nævner den dig?",
    price: "$199–3K/md (+$1,5K audit)", market: "$1,48B GEO", cagr: "45–50%/år", margin: "80–95%",
    audience: "Mid-market B2B/SaaS-brands der vil måles og citeres i AI-søgning",
    bullets: [
      "Multi-engine: ChatGPT, Gemini, Perplexity, Claude & Google AI Overviews",
      "Brand-accuracy-alarmer når AI siger noget forkert om dig",
      "Provable lift via hold-out-testing",
    ],
    needs: ["LLM-nøgler (OpenAI/Gemini/Perplexity)", "SERP/AIO-API", "Entity + DPA", "Domæne"],
    badges: ["Landing ✓"],
  },
  {
    slug: "ringback", name: "Ringback AI", rank: 6, accent: "#3FA66A",
    oneLine: "AI-receptionist der besvarer hvert opkald 24/7, booker jobs og fanger hvert lead.",
    hero: "Mist aldrig et kunde-opkald igen.",
    price: "€399–699/md + setup", market: "$3,5B voice agents", cagr: "39%/år", margin: "Høj (GPU-coloc)",
    audience: "Home services (VVS/el/HVAC) & service-virksomheder der taber kunder på ubesvarede opkald",
    bullets: [
      "Tager hvert opkald på første ring, 24/7, naturlig stemme",
      "Booker jobbet, tjekker kalender, bekræfter via SMS",
      "Logger lead (navn/nummer/årsag) og sms'er dig i realtid",
    ],
    needs: ["GPU-server-beslutning", "Telnyx/Twilio", "Deepgram-nøgle", "BAA'er (medical)", "Entity + Stripe"],
    badges: ["Landing ✓", "Web-demo-plan ✓"],
  },
];

const STYLES = `
  .imp-wrap { margin-top: 26px; }
  .imp-hero { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: 18px;
    background: linear-gradient(135deg, rgba(201,161,78,0.10), rgba(201,161,78,0.02) 55%, var(--panel)); padding: 26px 26px 24px; }
  .imp-hero h2 { font-family: var(--serif); font-size: 26px; font-weight: 600; color: var(--ink); margin: 0 0 8px; letter-spacing: -0.01em; }
  .imp-hero p { color: var(--bone-dim); font-size: 14px; line-height: 1.6; max-width: 760px; margin: 0; }
  .imp-kicker { display: inline-flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .imp-stats { display: flex; flex-wrap: wrap; gap: 22px 34px; margin-top: 20px; padding-top: 18px; border-top: 1px solid var(--line-soft); }
  .imp-stat .v { font-family: var(--serif); font-size: 22px; font-weight: 600; color: var(--ink); display: block; line-height: 1.1; }
  .imp-stat .l { font-size: 11.5px; color: var(--bone-faint); letter-spacing: 0.04em; }

  .imp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px; margin-top: 20px; }
  .imp-card { position: relative; background: var(--panel); border: 1px solid var(--line); border-radius: 16px;
    padding: 0 20px 18px; overflow: hidden; transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease; display: flex; flex-direction: column; }
  .imp-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(15,23,42,0.08); border-color: rgba(15,23,42,0.16); }
  .imp-bar { height: 4px; margin: 0 -20px 16px; }
  .imp-rank { display: inline-flex; align-items: center; justify-content: center; min-width: 26px; height: 26px; padding: 0 7px;
    border-radius: 8px; font-family: var(--mono); font-size: 12px; font-weight: 600; color: #fff; }
  .imp-flag { display: inline-flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--gold); font-weight: 600; }
  .imp-name { font-family: var(--serif); font-size: 19px; font-weight: 600; color: var(--ink); margin: 12px 0 4px; }
  .imp-one { color: var(--bone-dim); font-size: 13px; line-height: 1.5; }
  .imp-hero-line { font-size: 12.5px; font-style: italic; color: var(--bone-faint); margin-top: 8px; line-height: 1.45; }
  .imp-meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 2px; }
  .imp-chip { display: inline-flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 11px; color: var(--bone);
    background: var(--field); border: 1px solid var(--line-soft); border-radius: 7px; padding: 4px 8px; }
  .imp-chip b { color: var(--ink); font-weight: 600; }
  .imp-bullets { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-direction: column; gap: 7px; }
  .imp-bullets li { display: flex; gap: 8px; font-size: 12.5px; color: var(--bone-dim); line-height: 1.45; }
  .imp-need-label { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone-faint); margin: 16px 0 7px; }
  .imp-needs { display: flex; flex-wrap: wrap; gap: 6px; }
  .imp-need { font-size: 11px; color: var(--bone-dim); background: rgba(176,73,44,0.06); border: 1px solid rgba(176,73,44,0.16);
    border-radius: 6px; padding: 3px 7px; }
  .imp-foot { display: flex; align-items: center; gap: 10px; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--line-soft); flex-wrap: wrap; }
  .imp-badges { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
  .imp-badge { font-family: var(--mono); font-size: 10.5px; color: var(--green); background: rgba(62,157,94,0.10);
    border: 1px solid rgba(62,157,94,0.22); border-radius: 6px; padding: 3px 7px; }
  .imp-open { display: inline-flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 11.5px; font-weight: 600;
    color: #fff; border: none; border-radius: 9px; padding: 8px 13px; cursor: pointer; text-decoration: none; transition: filter .15s ease; }
  .imp-open:hover { filter: brightness(1.07); }

  .imp-ex-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; margin-top: 20px; }
  .imp-ex { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--panel); transition: box-shadow .15s ease, transform .15s ease; display: flex; flex-direction: column; }
  .imp-ex:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(15,23,42,0.10); }
  .imp-ex-bar { display: flex; align-items: center; gap: 7px; padding: 9px 12px; background: var(--panel2); border-bottom: 1px solid var(--line-soft); }
  .imp-dot { width: 9px; height: 9px; border-radius: 50%; }
  .imp-ex-url { font-family: var(--mono); font-size: 11px; color: var(--bone-faint); margin-left: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .imp-ex-frame { position: relative; height: 360px; background: #fff; }
  .imp-ex-frame iframe { width: 100%; height: 100%; border: 0; display: block; }
  .imp-ex-foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; }
  .imp-ex-name { font-family: var(--serif); font-size: 15px; font-weight: 600; color: var(--ink); }
  .imp-note { font-size: 12px; color: var(--bone-faint); margin-top: 18px; line-height: 1.55; }

  .imp-funnel { margin-top: 26px; border: 1px solid var(--line); border-radius: 16px; background: var(--panel); padding: 20px 22px 18px; }
  .imp-funnel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .imp-funnel-title { display: inline-flex; align-items: center; gap: 8px; font-family: var(--serif); font-size: 17px; font-weight: 600; color: var(--ink); }
  .imp-funnel-tot { display: flex; gap: 14px; flex-wrap: wrap; }
  .imp-funnel-tot .t { font-family: var(--mono); font-size: 11.5px; color: var(--bone-faint); }
  .imp-funnel-tot .t b { color: var(--ink); font-weight: 600; }
  .imp-funnel-tbl { width: 100%; border-collapse: collapse; margin-top: 16px; }
  .imp-funnel-tbl th { font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bone-faint);
    text-align: right; padding: 0 0 9px; font-weight: 600; border-bottom: 1px solid var(--line-soft); }
  .imp-funnel-tbl th:first-child { text-align: left; }
  .imp-funnel-tbl td { font-size: 13px; color: var(--bone-dim); text-align: right; padding: 9px 0; border-bottom: 1px solid var(--line-soft); }
  .imp-funnel-tbl tr:last-child td { border-bottom: none; }
  .imp-funnel-name { display: inline-flex; align-items: center; gap: 8px; text-align: left; color: var(--ink); font-weight: 600; font-size: 13px; }
  .imp-funnel-name::before { content: ""; width: 9px; height: 9px; border-radius: 3px; background: var(--dot, var(--gold)); flex-shrink: 0; }
  .imp-funnel-tbl td b { color: var(--ink); font-weight: 600; }
  .imp-funnel-cvr { color: var(--green); font-family: var(--mono); font-size: 12px; }
  .imp-funnel-th-ic { display: inline-flex; align-items: center; gap: 4px; justify-content: flex-end; }
  .imp-funnel-empty { font-size: 12.5px; color: var(--bone-faint); margin-top: 14px; line-height: 1.5; }
  .imp-funnel-foot { font-size: 11px; color: var(--bone-faint); margin-top: 12px; line-height: 1.45; }
`;

function ProductCard({ p }) {
  const href = `/imperium/${p.slug}`;
  return (
    <div className="imp-card">
      <div className="imp-bar" style={{ background: p.accent }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="imp-rank" style={{ background: p.accent }}>#{p.rank}</span>
        {p.flagship && <span className="imp-flag"><Star size={12} fill="var(--gold)" strokeWidth={0} /> Start her</span>}
      </div>
      <div className="imp-name">{p.name}</div>
      <div className="imp-one">{p.oneLine}</div>
      <div className="imp-hero-line">“{p.hero}”</div>

      <div className="imp-meta">
        <span className="imp-chip"><Wallet size={12} strokeWidth={2} /> <b>{p.price}</b></span>
        <span className="imp-chip"><TrendingUp size={12} strokeWidth={2} /> {p.market} · {p.cagr}</span>
        <span className="imp-chip"><Target size={12} strokeWidth={2} /> margin <b>{p.margin}</b></span>
      </div>

      <ul className="imp-bullets">
        {p.bullets.map((b, i) => (
          <li key={i}><Check size={14} strokeWidth={2.6} style={{ color: p.accent, flexShrink: 0, marginTop: 1 }} />{b}</li>
        ))}
      </ul>

      <div className="imp-need-label"><KeyRound size={10} strokeWidth={2} style={{ verticalAlign: "-1px", marginRight: 4 }} />Hvad Mads skal bruge</div>
      <div className="imp-needs">{p.needs.map((n, i) => <span key={i} className="imp-need">{n}</span>)}</div>

      <div style={{ fontSize: 11.5, color: "var(--bone-faint)", marginTop: 14, lineHeight: 1.45 }}>{p.audience}</div>

      <div className="imp-foot">
        <div className="imp-badges">{p.badges.map((b, i) => <span key={i} className="imp-badge">{b}</span>)}</div>
        <a className="imp-open" style={{ background: p.accent }} href={href} target="_blank" rel="noopener noreferrer">
          Åbn eksempel <ExternalLink size={13} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

function ExampleCard({ p }) {
  const href = `/imperium/${p.slug}`;
  return (
    <div className="imp-ex">
      <div className="imp-ex-bar">
        <span className="imp-dot" style={{ background: "#ED6A5E" }} />
        <span className="imp-dot" style={{ background: "#F4BF4F" }} />
        <span className="imp-dot" style={{ background: "#61C554" }} />
        <span className="imp-ex-url">somi-phi.vercel.app/imperium/{p.slug}</span>
      </div>
      <div className="imp-ex-frame">
        <iframe src={href} title={p.name} loading="lazy" scrolling="yes" />
      </div>
      <div className="imp-ex-foot">
        <div>
          <div className="imp-ex-name">{p.name}</div>
          <div style={{ fontSize: 11.5, color: "var(--bone-faint)" }}>{p.price}</div>
        </div>
        <a className="imp-open" style={{ background: p.accent }} href={href} target="_blank" rel="noopener noreferrer">
          Åbn fuld side <ArrowUpRight size={14} strokeWidth={2.4} />
        </a>
      </div>
    </div>
  );
}

// Read-only funnel-kort: view → cta → lead pr. venture, fra imperium_events via
// /api/imperium-stats. Samme fetch/tilstands-mønster som PerformanceTab (no-store +
// loading/err-lede). Tom-tilstand når ingen events er logget endnu.
function FunnelCard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/imperium-stats", { cache: "no-store" });
        if (!alive) return;
        if (r.ok) setData(await r.json());
        else setErr(true);
      } catch (e) { if (alive) setErr(true); }
    })();
    return () => { alive = false; };
  }, []);

  const ventures = (data && data.ventures) || [];
  const totals = (data && data.totals) || {};
  const anyEvents = totals.events > 0;

  return (
    <div className="imp-funnel">
      <div className="imp-funnel-head">
        <span className="imp-funnel-title"><BarChart3 size={17} strokeWidth={2} style={{ color: "var(--gold)" }} /> Funnel pr. venture</span>
        {data && !err && (
          <div className="imp-funnel-tot">
            <span className="t"><b>{nf(totals.views)}</b> views</span>
            <span className="t"><b>{nf(totals.cta)}</b> CTA-klik</span>
            <span className="t"><b>{nf(totals.leads)}</b> leads</span>
          </div>
        )}
      </div>

      {err ? (
        <p className="imp-funnel-empty">Kunne ikke hente funnel-data.</p>
      ) : !data ? (
        <p className="imp-funnel-empty">Henter funnel…</p>
      ) : !anyEvents ? (
        <p className="imp-funnel-empty">Ingen besøg logget endnu. Tæller view/CTA/lead pr. landingsside, så snart trafik rammer <code>/imperium/&lt;slug&gt;</code>.</p>
      ) : (
        <>
          <table className="imp-funnel-tbl">
            <thead>
              <tr>
                <th>Venture</th>
                <th><span className="imp-funnel-th-ic"><Eye size={11} /> Views</span></th>
                <th><span className="imp-funnel-th-ic"><MousePointerClick size={11} /> CTA</span></th>
                <th><span className="imp-funnel-th-ic"><Mail size={11} /> Leads</span></th>
                <th>CVR</th>
              </tr>
            </thead>
            <tbody>
              {ventures.map((v) => (
                <tr key={v.slug}>
                  <td><span className="imp-funnel-name" style={{ "--dot": v.accent }}>{v.name}</span></td>
                  <td><b>{nf(v.views)}</b></td>
                  <td>{nf(v.cta)}</td>
                  <td><b>{nf(v.leads)}</b></td>
                  <td className="imp-funnel-cvr">{v.views ? v.cvr + "%" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="imp-funnel-foot">Anonyme funnel-tællinger (ingen PII) fra <code>imperium_events</code>. CVR = leads / views. CTA = klik på en hvilken som helst knap på siden.</p>
        </>
      )}
    </div>
  );
}

export default function ImperiumTab({ view = "plans" }) {
  return (
    <div className="imp-wrap">
      <style>{STYLES}</style>

      {view === "examples" ? (
        <>
          <div className="imp-hero">
            <div className="imp-kicker"><Sparkles size={13} /> Eksempler · live landing pages</div>
            <h2>De byggede eksempler</h2>
            <p>De 6 landing pages fra nat-researchen, serveret direkte fra dashboardet. Hver er fuldt designet og koblet
              til en live lead-backend (Supabase) — udfylder du en formular, lander leadet rigtigt. Klik “Åbn fuld side” for at se den i fuld størrelse.</p>
          </div>
          <div className="imp-ex-grid">
            {PRODUCTS.map((p) => <ExampleCard key={p.slug} p={p} />)}
          </div>
          <p className="imp-note">Previewene indlæses som live-iframes fra selve appen (Next.js-ruter — ingen Tailwind-CDN, egen CSS). Kilde-filerne ligger i <code>app/imperium/&lt;slug&gt;/</code>.</p>
        </>
      ) : (
        <>
          <div className="imp-hero">
            <div className="imp-kicker"><Rocket size={13} /> Kommende projekter · AI-automations-imperiet</div>
            <h2>6 venture-planer, klar til launch</h2>
            <p>Research jun. 2026: seks forretningsplaner med dyb markedsanalyse, launch-guides og live landing pages.
              Den røde tråd: <b style={{ color: "var(--ink)" }}>self-hosted render + gratis lokal stemmeklon = near-zero marginalkost</b> på tværs.
              Anbefalet start er <b style={{ color: "var(--ink)" }}>Faceless Foundry</b> — fabrikken er allerede bygget; kun salgs-frontenden mangler. Skalér derfra til ListingReel/AdForge (samme render+voice-stack).</p>
            <div className="imp-stats">
              <div className="imp-stat"><span className="v">6</span><span className="l">Forretningsplaner</span></div>
              <div className="imp-stat"><span className="v" style={{ color: "var(--green)" }}>Live</span><span className="l">Lead-backend (Supabase)</span></div>
              <div className="imp-stat"><span className="v">~€0</span><span className="l">Marginalkost pr. enhed</span></div>
              <div className="imp-stat"><span className="v">#1</span><span className="l">Faceless Foundry — start her</span></div>
            </div>
          </div>
          <div className="imp-grid">
            {PRODUCTS.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
          <FunnelCard />
          <p className="imp-note">Landingssiderne ligger i <code>app/imperium/&lt;slug&gt;/</code> (Next.js, egen CSS — ingen Tailwind-CDN). Go-live kræver Mads' konti (domæner, entity/Stripe, betalte nøgler) — se “Hvad Mads skal bruge” pr. kort.</p>
        </>
      )}
    </div>
  );
}
