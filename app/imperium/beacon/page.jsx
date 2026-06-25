import { Check, Radar } from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Track from "../_components/Track.jsx";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import BeaconMockup from "../_components/mockups/BeaconMockup";

const ACCENT = "#7C5CCB";
const GLOW = "rgba(124,92,203,0.20)";
const SOFT = "rgba(124,92,203,0.16)";

export const metadata = {
  title: "Beacon — Get your brand cited by AI",
  description:
    "Track and grow your visibility inside ChatGPT, Gemini, Perplexity & Google AI Overviews. Monitoring + done-for-you content that gets you cited. The new search is AI — be the answer.",
};

const NAV_LINKS = [
  { href: "#problem", label: "The shift" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const STATS = [
  { raw: "~50%", label: "of consumers use AI search" },
  { raw: "89%", label: "of B2B buyers use AI in buying" },
  { raw: "~60%", label: "of searches are now zero-click" },
  { raw: "9×", label: "higher convert from AI referrals" },
];

const STEPS = [
  {
    n: "01",
    h: "Baseline",
    p: "We build 75–100 buyer-intent prompts and run them across every major AI engine — repeatedly.",
  },
  {
    n: "02",
    h: "Track",
    p: "Citation rate, share-of-voice vs competitors, per-engine — on a live dashboard, updated continuously.",
  },
  {
    n: "03",
    h: "Produce",
    p: "Our content engine writes the answer-first, statistic-rich pages, FAQ schema & llms.txt that AI cites.",
  },
  {
    n: "04",
    h: "Prove",
    p: "Test-vs-control measurement shows the citation lift — real ROI, not vanity metrics.",
  },
];

const FEATURES = [
  {
    b: "Multi-engine.",
    t: "ChatGPT, Gemini, Perplexity, Claude & Google AI Overviews — the mix keeps shifting; we track all.",
  },
  {
    b: "Brand-accuracy alerts.",
    t: "Flag when AI says something wrong about you — and fix the source.",
  },
  {
    b: "Content at scale.",
    t: "Our pipeline produces citable content (and video answers) at a fraction of agency cost.",
  },
  {
    b: "Provable lift.",
    t: "Hold-out testing ties our work to measurable citation gains.",
  },
];

const WHAT_YOU_GET = [
  { n: "01", t: "Free AI-visibility snapshot (your brand vs 3 competitors)" },
  { n: "02", t: "Paid baseline audit + gap report" },
  { n: "03", t: "Monitoring dashboard (monthly)" },
  { n: "04", t: "Content program that grows your citations" },
];

const FAQ = [
  {
    q: "Which AI engines do you track?",
    a: "ChatGPT, Gemini, Perplexity, Claude and Google AI Overviews. The mix of where buyers ask keeps shifting, so we track all of them and report citation rate and share-of-voice per engine.",
  },
  {
    q: "How do you actually move the numbers?",
    a: "Monitoring tells you where you're invisible. Then our content engine produces the answer-first, statistic-rich pages, FAQ schema and llms.txt that AI engines actually cite — turning recommendations into published, citable content.",
  },
  {
    q: "Is the lift provable?",
    a: "Yes. We use test-vs-control (hold-out) measurement so the citation gains tie back to our work — real ROI, not vanity metrics.",
  },
  {
    q: "What's in the free snapshot?",
    a: "A read on how often ChatGPT, Gemini and Perplexity mention you versus three competitors. We email you the report — no commitment.",
  },
];

export default function BeaconPage() {
  return (
    <main
      className="pe"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Track slug="beacon" />
      <Nav
        brand="Beacon"
        icon={<Radar size={16} strokeWidth={2} />}
        links={NAV_LINKS}
        ctaLabel="Free AI-visibility audit"
        ctaHref="#start"
      />

      <header className="pe-hero" id="top">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-split">
            <div className="pe-hero-copy">
              <div className="pe-eyebrow">
                <span className="pe-dot" /> ChatGPT · Gemini · Perplexity ·
                Google AI Overviews
              </div>
              <h1 className="pe-h1">
                Your customers ask AI. Does it{" "}
                <span className="pe-mark">name you?</span>
              </h1>
              <p className="pe-lead">
                Half of buyers now research in AI chat before Google. Beacon
                tracks every time AI engines mention you and your competitors —
                then our content engine produces what it takes to get you cited.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#start" className="pe-btn pe-btn-primary">
                  Get a free AI-visibility audit
                </a>
                <a href="#how" className="pe-btn pe-btn-ghost">
                  How it works
                </a>
              </div>
              <p className="pe-hero-fine">
                Monitoring from <span className="pe-accent">$199/mo</span> ·
                content programs from <span className="pe-accent">$3k/mo</span>
              </p>
            </div>
            <div>
              <BeaconMockup />
            </div>
          </div>
        </div>
      </header>

      <section className="pe-section pe-section--tight pe-panel-bg">
        <div className="pe-container">
          <h2 className="pe-h3 pe-center pe-reveal">
            Search is moving into the answer box
          </h2>
          <div className="pe-stats">
            {STATS.map((s, i) => (
              <StatCounter key={s.label} raw={s.raw} label={s.label} i={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="pe-section" id="how">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">Measure it. Then move it.</h2>
          <div className="pe-grid-4">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="pe-card pe-step pe-reveal"
                style={{ "--i": i }}
              >
                <div className="pe-card-num">{s.n}</div>
                <h3 className="pe-h3">{s.h}</h3>
                <p className="pe-body">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pe-section pe-panel-bg" id="problem">
        <div className="pe-container">
          <div className="pe-grid-2">
            <div className="pe-reveal">
              <h2 className="pe-h2">Most tools only measure. We also fix it.</h2>
              <p className="pe-body pe-measure" style={{ marginTop: 16 }}>
                The funded GEO platforms give you a dashboard — then leave the
                hard part (producing content AI actually cites) to you. Beacon
                does both: monitoring <em>and</em> a content engine that turns
                recommendations into published, citable pages.
              </p>
              <ul className="pe-feature-list" style={{ marginTop: 26 }}>
                {FEATURES.map((f) => (
                  <li key={f.b}>
                    <span className="pe-feature-ic">
                      <Check size={15} />
                    </span>
                    <span>
                      <b>{f.b}</b>{" "}
                      <span className="t">{f.t}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pe-spec pe-reveal" style={{ "--i": 1 }}>
              <div className="pe-spec-label">What you get</div>
              {WHAT_YOU_GET.map((row) => (
                <div className="pe-spec-row" key={row.n}>
                  <span className="k">
                    <span className="pe-accent">{row.n}</span> · {row.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">Pricing</h2>
          <p className="pe-lead pe-center pe-reveal" style={{ "--i": 1 }}>
            Start with a free snapshot. Land with an audit. Grow with a program.
          </p>
          <div className="pe-price-grid">
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <div className="pe-price-name">Audit</div>
              <div className="pe-price-amt">
                $1,500<small> one-time</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> 75–100 prompt baseline
                </li>
                <li>
                  <Check size={16} /> All major engines
                </li>
                <li>
                  <Check size={16} /> Competitor share-of-voice
                </li>
                <li>
                  <Check size={16} /> Gap report + action plan
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 22, width: "100%" }}
              >
                Start with a snapshot
              </a>
            </div>

            <div className="pe-price pe-price--pop pe-reveal" style={{ "--i": 1 }}>
              <div className="pe-price-tag">Most popular</div>
              <div className="pe-price-name">Monitor + Content</div>
              <div className="pe-price-amt">
                $3,000<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> Live monitoring dashboard
                </li>
                <li>
                  <Check size={16} /> Monthly citable content sprint
                </li>
                <li>
                  <Check size={16} /> Brand-accuracy alerts
                </li>
                <li>
                  <Check size={16} /> Test-vs-control reporting
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-primary"
                style={{ marginTop: 22, width: "100%" }}
              >
                Get a free audit
              </a>
            </div>

            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <div className="pe-price-name">Monitoring only</div>
              <div className="pe-price-amt">
                $199<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> Dashboard + trends
                </li>
                <li>
                  <Check size={16} /> Up to 50 tracked prompts
                </li>
                <li>
                  <Check size={16} /> Weekly refresh
                </li>
                <li>
                  <Check size={16} /> Upgrade to content anytime
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 22, width: "100%" }}
              >
                Start monitoring
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="pe-section pe-panel-bg" id="start">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">
            Free AI-visibility snapshot
          </h2>
          <p className="pe-lead pe-center pe-reveal" style={{ "--i": 1 }}>
            See how often ChatGPT, Gemini &amp; Perplexity mention you vs your
            competitors. We'll email you the report.
          </p>
          <div className="pe-measure pe-reveal" style={{ "--i": 2 }}>
            <LeadForm
              source="geo"
              fields={[
                {
                  name: "email",
                  label: "Work email",
                  type: "email",
                  placeholder: "you@company.com",
                  required: true,
                },
                {
                  name: "niche",
                  label: "Brand / domain",
                  type: "text",
                  placeholder: "yourbrand.com",
                  required: true,
                },
              ]}
              submitLabel="Get my free snapshot"
              successMsg="✓ Thanks! Your free snapshot is on the way."
              note="See how often ChatGPT, Gemini & Perplexity mention you vs your competitors. We'll email you the report."
            />
          </div>
        </div>
      </section>

      <section className="pe-section pe-faq" id="faq">
        <div className="pe-container pe-measure-wide">
          <h2 className="pe-h2 pe-center pe-reveal">Questions, answered</h2>
          <div style={{ marginTop: 32 }}>
            {FAQ.map((f, i) => (
              <details key={f.q} className="pe-reveal" style={{ "--i": i }}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pe-cta-band">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center">
          <h2 className="pe-h2 pe-reveal">Be the answer AI gives.</h2>
          <p className="pe-lead pe-center pe-reveal" style={{ "--i": 1 }}>
            Start with a free snapshot — see exactly where you stand inside the
            engines your buyers already ask.
          </p>
          <div
            className="pe-reveal"
            style={{ "--i": 2, marginTop: 26 }}
          >
            <a href="#start" className="pe-btn pe-btn-primary">
              Get my free snapshot
            </a>
          </div>
        </div>
      </section>

      <Footer
        brand="Beacon"
        copy="© 2026 · AI-search visibility · Monitoring + content"
      />
    </main>
  );
}
