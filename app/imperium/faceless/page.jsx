import { Check, ShieldCheck, Mic, UserCheck, Server, Clapperboard } from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Track from "../_components/Track.jsx";
import VentureJsonLd from "../_components/VentureJsonLd";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import FacelessMockup from "../_components/mockups/FacelessMockup";

const ACCENT = "#C9A14E";
const GLOW = "rgba(201,161,78,0.18)";
const SOFT = "rgba(201,161,78,0.14)";

export const metadata = {
  alternates: { canonical: "/imperium/faceless" },
  openGraph: { url: "/imperium/faceless", title: "Faceless Foundry — Documentary-grade faceless videos, on autopilot" },
  title: "Faceless Foundry — Documentary-grade faceless videos, on autopilot",
  description:
    "Done-for-you faceless documentary videos with cloned-voice narration. 30+ branded videos a month, zero filming. Privacy-first and self-hosted.",
};

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#why", label: "Why us" },
  { href: "#faq", label: "FAQ" },
];

const STEPS = [
  {
    n: "01",
    t: "Topic & angle",
    d: "You pick the niche; we research and shape a distinctive angle — not a template.",
  },
  {
    n: "02",
    t: "Script & voice",
    d: "An original script, reviewed by a human, narrated in your own cloned voice.",
  },
  {
    n: "03",
    t: "Render & shorts",
    d: "Cinematic visuals, captions, music — plus 3 shorts derived from each long-form.",
  },
  {
    n: "04",
    t: "SEO & upload",
    d: "Title, description, tags and scheduled upload — to your channel, ready to grow.",
  },
];

const WHY = [
  {
    ic: Server,
    b: "Your data stays yours.",
    t: "Self-hosted pipeline — credentials and content never sit on a third-party SaaS.",
  },
  {
    ic: Mic,
    b: "Your own voice.",
    t: "We clone a single, consistent narrator voice — included, not upcharged.",
  },
  {
    ic: UserCheck,
    b: "Human-in-the-loop.",
    t: "Every script is reviewed before production — original, accurate, policy-safe.",
  },
  {
    ic: ShieldCheck,
    b: "We own the stack.",
    t: "Self-hosted render + voice = no per-minute fees we pass to you.",
  },
];

const FAQS = [
  {
    q: "Will this get my channel demonetized?",
    a: "No — that's the whole point. We produce long-form documentaries with original scripts, a distinct voice and a human review step, which is exactly what YouTube's 2025–2026 policy rewards. We avoid the templated, mass-produced output that gets penalized.",
  },
  {
    q: "Whose voice is it?",
    a: "A single, consistent cloned narrator voice that becomes your channel's identity — included in Growth and Custom. We only clone voices with proper consent.",
  },
  {
    q: "Do you upload to my channel?",
    a: "Yes (optional). We can deliver upload-ready files, or schedule and publish directly to your channel with your authorization.",
  },
  {
    q: "What about my data?",
    a: "The pipeline is self-hosted. On the Custom tier it runs entirely on your own infrastructure — full GDPR data sovereignty, nothing on third-party SaaS.",
  },
];

const LEAD_FIELDS = [
  { name: "email", label: "Your email", type: "email", placeholder: "you@company.com", required: true },
  { name: "niche", label: "Niche / topic", type: "text", placeholder: "e.g. financial-crime documentaries", required: true },
  { name: "channel", label: "Channel (optional)", type: "text", placeholder: "YouTube / brand" },
  { name: "volume", label: "Videos / month", type: "select", options: ["12", "30", "60+"] },
];

export default function FacelessPage() {
  return (
    <main
      className="pe"
      id="top"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Track slug="faceless" />
      <VentureJsonLd slug="faceless" faqs={FAQS} />

      <Nav
        brand="Faceless Foundry"
        icon={<Clapperboard size={16} strokeWidth={2} />}
        links={NAV_LINKS}
        ctaLabel="Get a free sample"
        ctaHref="#sample"
      />

      {/* ── HERO ── */}
      <header className="pe-hero">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-split">
            <div className="pe-hero-copy">
              <span className="pe-eyebrow">
                <span className="pe-dot" />
                Privacy-first · self-hosted · cloned-voice narration
              </span>
              <h1 className="pe-h1">
                AI content that <span className="pe-mark">posts itself.</span>
                <br />
                30+ branded videos a month. Zero filming.
              </h1>
              <p className="pe-lead">
                We run a complete, automated documentary studio for your channel
                — idea, script, cloned-voice narration, visuals, render, SEO and
                upload. Documentary-grade output, not template slop.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#sample" className="pe-btn pe-btn-primary">
                  Get a free sample video
                </a>
                <a href="#how" className="pe-btn pe-btn-ghost">
                  See how it works
                </a>
              </div>
              <p className="pe-hero-fine">
                From <b className="pe-gold">€499/mo</b> · cancel anytime · your
                data stays on your servers
              </p>
            </div>
            <div>
              <FacelessMockup />
              <p className="pe-mock-note">Illustrative preview — sample data.</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── STATS ── */}
      <section className="pe-section pe-section--tight pe-panel-bg">
        <div className="pe-container">
          <div className="pe-stats">
            <StatCounter raw="30+" label="videos / month" i={0} />
            <StatCounter raw="~80%" label="less production time" i={1} />
            <StatCounter raw="100%" label="your own cloned voice" i={2} />
            <StatCounter raw="$0" label="per-render SaaS fees" i={3} />
          </div>
          <p className="pe-stat-note">Illustrative figures, not guarantees.</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pe-section" id="how">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 12 }}>
            <span className="pe-kicker">How it works</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              A real studio, fully automated
            </h2>
            <p className="pe-lead pe-measure pe-center" style={{ margin: "12px auto 0" }}>
              Every video runs through the same battle-tested pipeline — with a
              human review step that keeps it original and policy-safe.
            </p>
          </div>

          <div className="pe-grid-4" style={{ marginTop: 40 }}>
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                className="pe-card pe-step pe-reveal"
                style={{ "--i": i }}
              >
                <div className="pe-card-num">{s.n}</div>
                <h3 className="pe-h3" style={{ marginTop: 12 }}>
                  {s.t}
                </h3>
                <p className="pe-body" style={{ marginTop: 10 }}>
                  {s.d}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="pe-section pe-panel-bg" id="why">
        <div className="pe-container">
          <div className="pe-grid-2">
            <div className="pe-reveal">
              <span className="pe-kicker">Why us</span>
              <h2 className="pe-h2" style={{ marginTop: 12 }}>
                Built to survive the AI crackdown
              </h2>
              <p className="pe-body" style={{ marginTop: 16 }}>
                YouTube now penalizes mass-produced, template content. The cheap
                "spray-and-pray" tools are getting demonetized. We do the
                opposite: long-form documentaries with original scripts, a
                distinct cloned voice, and real editorial structure — the format
                the platform now rewards.
              </p>
              <ul className="pe-feature-list" style={{ marginTop: 26 }}>
                {WHY.map((f) => {
                  const Ic = f.ic;
                  return (
                    <li key={f.b}>
                      <span className="pe-feature-ic">
                        <Ic size={15} />
                      </span>
                      <span className="t">
                        <b>{f.b}</b> {f.t}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pe-spec pe-reveal" style={{ "--i": 1 }}>
              <div className="pe-spec-label">The math</div>
              <div style={{ marginTop: 14 }}>
                <div className="pe-spec-row">
                  <span className="k">Freelancer-built video</span>
                  <span className="val">€70–600</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Our cost per video</span>
                  <span className="val accent">~€3</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Your price (Growth tier)</span>
                  <span className="val">~€50/video</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Capacity</span>
                  <span className="val">50+ /day</span>
                </div>
              </div>
              <p className="pe-hero-fine" style={{ marginTop: 18 }}>
                A documentary studio's output at a fraction of a studio's cost —
                because the factory is already built.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 12 }}>
            <span className="pe-kicker">Pricing</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Simple, productized pricing
            </h2>
            <p className="pe-lead pe-measure pe-center" style={{ margin: "12px auto 0" }}>
              Cancel anytime. No per-render fees. Custom builds run on your own
              infrastructure.
            </p>
          </div>

          <div className="pe-price-grid" style={{ marginTop: 40 }}>
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <div className="pe-price-name">Starter</div>
              <div className="pe-price-amt">
                €499<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li><Check size={16} /> 12 faceless videos / month</li>
                <li><Check size={16} /> 1 channel</li>
                <li><Check size={16} /> Shared documentary voice</li>
                <li><Check size={16} /> SEO + scheduled upload</li>
              </ul>
              <a
                href="#sample"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 22, width: "100%" }}
              >
                Start with a sample
              </a>
            </div>

            <div className="pe-price pe-price--pop pe-reveal" style={{ "--i": 1 }}>
              <span className="pe-price-tag">Most popular</span>
              <div className="pe-price-name">Growth</div>
              <div className="pe-price-amt">
                €1,499<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li><Check size={16} /> ~30 videos / month + shorts</li>
                <li><Check size={16} /> Multi-platform</li>
                <li><Check size={16} /> Your custom cloned voice</li>
                <li><Check size={16} /> Custom branding + thumbnails</li>
                <li><Check size={16} /> Priority production</li>
              </ul>
              <a
                href="#sample"
                className="pe-btn pe-btn-primary"
                style={{ marginTop: 22, width: "100%" }}
              >
                Get a free sample
              </a>
            </div>

            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <div className="pe-price-name">Custom / Self-hosted</div>
              <div className="pe-price-amt">
                €3–6k<small> setup + retainer</small>
              </div>
              <ul className="pe-price-feats">
                <li><Check size={16} /> Bespoke pipeline on <b>your</b> servers</li>
                <li><Check size={16} /> Full data sovereignty (GDPR)</li>
                <li><Check size={16} /> Multi-channel networks</li>
                <li><Check size={16} /> Integrations + SLA</li>
              </ul>
              <a
                href="#sample"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 22, width: "100%" }}
              >
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEAD / SAMPLE ── */}
      <section className="pe-section pe-panel-bg" id="sample">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 28 }}>
            <span className="pe-kicker">Free sample</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              See your topic, in your style — free
            </h2>
            <p className="pe-lead pe-measure pe-center" style={{ margin: "12px auto 0" }}>
              Tell us your niche. We'll generate a real sample documentary clip
              and email it to you. No call required.
            </p>
          </div>

          <div className="pe-measure pe-reveal" style={{ "--i": 1 }}>
            <LeadForm
              source="faceless"
              fields={LEAD_FIELDS}
              submitLabel="Generate my free sample"
              successMsg="✓ Thanks! Your free sample is on the way."
              note="We use AI to assist production with human editorial review. Your data is never shared."
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pe-section pe-faq" id="faq">
        <div className="pe-container pe-measure">
          <div className="pe-center pe-reveal" style={{ marginBottom: 28 }}>
            <span className="pe-kicker">FAQ</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Questions
            </h2>
          </div>
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="pe-reveal"
              style={{ "--i": i, marginBottom: 12 }}
            >
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="pe-cta-band">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center" style={{ padding: "84px 0" }}>
          <h2 className="pe-h2 pe-reveal">Your channel, on autopilot.</h2>
          <p
            className="pe-lead pe-measure pe-center pe-reveal"
            style={{ margin: "14px auto 26px", "--i": 1 }}
          >
            Start with a free sample. See the quality before you commit a cent.
          </p>
          <a
            href="#sample"
            className="pe-btn pe-btn-primary pe-reveal"
            style={{ "--i": 2 }}
          >
            Get a free sample video
          </a>
        </div>
      </section>

      <Footer
        brand="Faceless Foundry"
        copy="© 2026 · Privacy-first AI content studio · AI-assisted with human review"
      />
    </main>
  );
}
