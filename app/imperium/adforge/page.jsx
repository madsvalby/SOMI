// AdForge — AI UGC ad-creative venture-landingsside (server-komponent).
// Copy reproduceret tro fra /public/imperium/adforge/index.html.
// Lead source POSTes som "ugc" (afviger bevidst fra slug — leads er allerede tagget sådan).
import { Check, ArrowRight, ShieldCheck, Megaphone } from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import AdforgeMockup from "../_components/mockups/AdforgeMockup";

const ACCENT = "#E0794E";
const GLOW = "rgba(224,121,78,0.18)";
const SOFT = "rgba(224,121,78,0.14)";

export const metadata = {
  title: "AdForge — Unlimited AI UGC ads, flat monthly",
  description:
    "Done-for-you AI UGC video ads for e-commerce brands. Unlimited variants, flat monthly price, platform-compliant. The creative volume your ad account needs — without the per-video cost.",
};

const NAV_LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why flat-rate" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const STEPS = [
  {
    n: "01",
    t: "Send your product",
    d: "Drop a URL + brand assets. We pull features, benefits and audience automatically.",
  },
  {
    n: "02",
    t: "Hook matrix",
    d: "AI writes dozens of hooks × angles × CTAs — the variation that finds winners fast.",
  },
  {
    n: "03",
    t: "Licensed AI actors",
    d: "Fully-licensed synthetic presenters + cloned voiceover, in any language. Human-reviewed.",
  },
  {
    n: "04",
    t: "Compliant delivery",
    d: "Platform AI-labels + C2PA baked in, formatted per platform. Ready to launch in 48h.",
  },
];

const FEATURES = [
  {
    b: "Flat-rate, unlimited.",
    t: "Test as much as you want — our cost per variant is near-zero, so yours is too.",
  },
  {
    b: "Licensed actors only.",
    t: "Full commercial rights on every face & voice, on file. No likeness risk.",
  },
  {
    b: "Any language, free.",
    t: "Self-hosted voice cloning re-voices every ad into new markets at no extra cost.",
  },
  {
    b: "Human-in-the-loop QA.",
    t: "Every batch reviewed before it reaches you.",
  },
];

const FAQ = [
  {
    q: "Is this compliant with ad platforms?",
    a: "Yes. TikTok and Meta now require AI-content disclosure and throttle or remove unlabeled AI ads. Every AdForge delivery ships with the right AIGC labels, C2PA metadata and a per-platform checklist — so your ads stay live.",
  },
  {
    q: "Are the actors licensed?",
    a: "Always. We only use fully-licensed synthetic presenters with full commercial rights on every face and voice, kept on file. No likeness risk for your brand.",
  },
  {
    q: "What about other languages?",
    a: "Included at no extra cost. Our self-hosted voice cloning re-voices every ad into new markets, so you can fan a winning creative out across languages for free.",
  },
  {
    q: "Really unlimited?",
    a: "Really. Our self-hosted production stack means each variant costs us almost nothing — so on a flat plan you get all the variants you can test, no per-video credits and no expiring tokens.",
  },
];

const LEAD_FIELDS = [
  {
    name: "email",
    label: "Work email",
    type: "email",
    placeholder: "you@brand.com",
    required: true,
  },
  {
    name: "niche",
    label: "Product URL / brand",
    type: "text",
    placeholder: "yourstore.com/product",
    required: true,
  },
];

export default function AdforgePage() {
  return (
    <main
      className="pe"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Nav
        brand="AdForge"
        icon={<Megaphone size={16} strokeWidth={2} />}
        links={NAV_LINKS}
        ctaLabel="Get test variants"
        ctaHref="#start"
      />

      {/* HERO */}
      <header className="pe-hero" id="top">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-split">
            <div className="pe-hero-copy">
              <div className="pe-eyebrow">
                <span className="pe-dot" />
                Unlimited variants · flat monthly · platform-compliant
              </div>
              <h1 className="pe-h1">
                Winning ads fatigue. Out-produce the{" "}
                <span className="pe-mark">fatigue.</span>
              </h1>
              <p className="pe-lead">
                AI-made UGC video ads for your e-commerce brand — as many
                variants as you can test, for one flat monthly price. No
                per-video credits. No expiring tokens. Just fresh creative on
                tap.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#start" className="pe-btn pe-btn-primary">
                  Get 5 free test variants <ArrowRight size={16} />
                </a>
                <a href="#pricing" className="pe-btn pe-btn-ghost">
                  See pricing
                </a>
              </div>
              <p className="pe-hero-fine">
                From <b>€499/mo</b> · unlimited variants · 48h turnaround
              </p>
            </div>
            <div>
              <AdforgeMockup />
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <section className="pe-section pe-section--tight pe-panel-bg">
        <div className="pe-container">
          <div className="pe-stats">
            <StatCounter raw="78%" label="of marketers use AI video" i={0} />
            <StatCounter
              raw="15–30"
              label="variants/mo a live account needs"
              i={1}
            />
            <StatCounter raw="31%" label="lower CPA in AI-UGC tests" i={2} />
            <StatCounter raw="∞" label="variants on a flat plan" i={3} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pe-section" id="how">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">
            From product URL to scroll-stopping ads
          </h2>
          <div className="pe-grid-4" style={{ marginTop: 48 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="pe-card pe-step pe-reveal"
                style={{ "--i": i }}
              >
                <div className="pe-card-num">{s.n}</div>
                <h3 className="pe-h3" style={{ marginTop: 12 }}>
                  {s.t}
                </h3>
                <p className="pe-body" style={{ marginTop: 8 }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FLAT-RATE */}
      <section className="pe-section pe-panel-bg" id="why">
        <div className="pe-container">
          <div className="pe-grid-2">
            <div className="pe-reveal">
              <h2 className="pe-h2">Compliance is built in, not bolted on</h2>
              <p className="pe-lead" style={{ marginTop: 16 }}>
                The whole market charges per video. We don&apos;t. Serious ad
                accounts burn through 15–30 fresh creatives a month, and
                credit-metered tools punish you for testing. Our self-hosted
                production stack means variants cost us almost nothing — so we
                give you all you can use.
              </p>
              <ul className="pe-feature-list" style={{ marginTop: 28 }}>
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
              <div className="pe-spec-label">The math</div>
              <div style={{ marginTop: 14 }}>
                <div className="pe-spec-row">
                  <span className="k">Human UGC creator</span>
                  <span className="val">€150–1,200/video</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Credit tools (e.g. ~€11/clip)</span>
                  <span className="val">+ expiring credits</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">AdForge</span>
                  <span className="val accent">flat · unlimited</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Turnaround</span>
                  <span className="val">48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">
            Flat pricing, unlimited output
          </h2>
          <div className="pe-price-grid" style={{ marginTop: 48 }}>
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <div className="pe-price-name">Brand</div>
              <div className="pe-price-amt">
                €499<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> Unlimited variants · 1 brand
                </li>
                <li>
                  <Check size={15} /> Up to 3 products
                </li>
                <li>
                  <Check size={15} /> 48h turnaround
                </li>
                <li>
                  <Check size={15} /> Compliant delivery
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 24, width: "100%" }}
              >
                Get test variants
              </a>
            </div>

            <div
              className="pe-price pe-price--pop pe-reveal"
              style={{ "--i": 1 }}
            >
              <div className="pe-price-tag">Most popular</div>
              <div className="pe-price-name">Scale</div>
              <div className="pe-price-amt">
                €999<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> Everything in Brand
                </li>
                <li>
                  <Check size={15} /> Unlimited products
                </li>
                <li>
                  <Check size={15} /> Multi-language fan-out
                </li>
                <li>
                  <Check size={15} /> Priority 24h turnaround
                </li>
                <li>
                  <Check size={15} /> Dedicated strategist
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-primary"
                style={{ marginTop: 24, width: "100%" }}
              >
                Get test variants
              </a>
            </div>

            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <div className="pe-price-name">Agency / White-label</div>
              <div className="pe-price-amt">Custom</div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> Wholesale per-video or flat
                </li>
                <li>
                  <Check size={15} /> Your brand on delivery
                </li>
                <li>
                  <Check size={15} /> Bulk client throughput
                </li>
                <li>
                  <Check size={15} /> API/folder delivery
                </li>
              </ul>
              <a
                href="#start"
                className="pe-btn pe-btn-ghost"
                style={{ marginTop: 24, width: "100%" }}
              >
                Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD */}
      <section className="pe-section pe-panel-bg" id="start">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">
            See your product as 5 ad variants — free
          </h2>
          <p
            className="pe-lead pe-center pe-reveal"
            style={{ margin: "12px auto 0" }}
          >
            Send your product and we&apos;ll make 5 platform-ready ad variants,
            no charge.
          </p>
          <div className="pe-measure" style={{ margin: "36px auto 0" }}>
            <LeadForm
              source="ugc"
              fields={LEAD_FIELDS}
              submitLabel="Get my 5 free variants"
              successMsg="✓ Thanks! Your 5 free variants are on the way."
              note="All ads ship with required AI-content disclosure & C2PA metadata."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pe-section" id="faq">
        <div className="pe-container pe-measure-wide">
          <h2 className="pe-h2 pe-center pe-reveal">Questions, answered</h2>
          <div className="pe-faq" style={{ marginTop: 36 }}>
            {FAQ.map((f) => (
              <details key={f.q} className="pe-reveal">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pe-cta-band pe-section">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center">
          <h2 className="pe-h2 pe-reveal">Out-produce the fatigue.</h2>
          <p
            className="pe-lead pe-center pe-reveal"
            style={{ margin: "12px auto 28px" }}
          >
            Unlimited AI UGC ad-creative, flat monthly, platform-compliant.
            Start with 5 free variants.
          </p>
          <a href="#start" className="pe-btn pe-btn-primary pe-reveal">
            <ShieldCheck size={16} /> Get my 5 free variants
          </a>
        </div>
      </section>

      <Footer
        brand="AdForge"
        copy="© 2026 · AI UGC ad-creative · Platform-compliant"
      />
    </main>
  );
}
