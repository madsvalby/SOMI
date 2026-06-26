import {
  Check,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Coins,
  Activity,
  Target,
  Users,
  LifeBuoy,
  BarChart3,
  FileText,
  Workflow,
} from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Track from "../_components/Track.jsx";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import AutomationMockup from "../_components/mockups/AutomationMockup";

const ACCENT = "#3B6FB0";
const GLOW = "rgba(59,111,176,0.20)";
const SOFT = "rgba(59,111,176,0.16)";

export const metadata = {
  alternates: { canonical: "/imperium/automation" },
  openGraph: { url: "/imperium/automation", title: "Northgate Automation — Privacy-first AI automation" },
  title: "Northgate Automation — Privacy-first AI automation",
  description:
    "We build self-hosted AI automations that run on your infrastructure. Your data never leaves your servers. Lead-gen, support, reporting and content — automated.",
};

const WHAT = [
  {
    icon: Users,
    name: "Lead-gen & outreach",
    body:
      "AI scraping, enrichment, personalized outreach and reply-classification. More booked meetings, less manual prospecting.",
  },
  {
    icon: LifeBuoy,
    name: "Customer support",
    body:
      "AI triage + ticket deflection + after-hours answering. 30–60% cost reduction, faster response.",
  },
  {
    icon: BarChart3,
    name: "Reporting & analytics",
    body:
      "Pull data, summarize with AI, deliver scheduled dashboards and digests — no more manual reports.",
  },
  {
    icon: FileText,
    name: "Content operations",
    body:
      "Automated content production & repurposing — powered by our own battle-tested content engine.",
  },
];

const HOW = [
  { n: "01", t: "Free audit", d: "We map your manual workflows + ROI." },
  { n: "02", t: "Build", d: "One high-impact automation, deployed on your infra." },
  { n: "03", t: "Prove", d: "Measure the KPI; you see the result." },
  { n: "04", t: "Expand", d: "Monthly retainer for monitoring + new workflows." },
];

const WHY = [
  {
    icon: ShieldCheck,
    b: "Data sovereignty (GDPR).",
    t: "Nothing leaves your servers — structurally impossible with cloud-only tools.",
  },
  {
    icon: Coins,
    b: "No per-task fees.",
    t: "Unlimited executions on your own infra — we don't mark up usage.",
  },
  {
    icon: Activity,
    b: "Proof, not slides.",
    t: "We run our own automated content factory — you see working systems before you commit.",
  },
  {
    icon: Target,
    b: "One KPI per build.",
    t: "Every automation is tied to a measurable outcome you can see monthly.",
  },
];

export default function AutomationPage() {
  return (
    <main
      className="pe"
      id="top"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Track slug="automation" />

      <Nav
        brand="Northgate Automation"
        icon={<Workflow size={16} strokeWidth={2} />}
        links={[
          { href: "#what", label: "What we automate" },
          { href: "#why", label: "Why self-hosted" },
          { href: "#pricing", label: "Pricing" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaLabel="Free automation audit"
        ctaHref="#audit"
      />

      {/* ─── HERO ─── */}
      <header className="pe-hero">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-split">
            <div className="pe-hero-copy">
              <span className="pe-eyebrow">
                <span className="pe-dot" />
                Self-hosted · your data never leaves your servers
              </span>
              <h1 className="pe-h1">
                Stop doing work{" "}
                <span className="pe-mark">a robot should do.</span>
              </h1>
              <p className="pe-lead">
                We design and run AI automations on{" "}
                <span className="pe-accent">your own infrastructure</span> —
                lead-gen, customer support, reporting and content. Same power as
                Zapier/Make, none of the data leaving your business.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#audit" className="pe-btn pe-btn-primary">
                  Get a free automation audit
                  <ArrowRight size={16} />
                </a>
                <a href="#what" className="pe-btn pe-btn-ghost">
                  See what we automate
                </a>
              </div>
              <p className="pe-hero-fine">
                Setup from <b>€3,000</b> · retainers from <b>€800/mo</b> ·
                GDPR-ready by design
              </p>
            </div>
            <div>
              <AutomationMockup />
            </div>
          </div>
        </div>
      </header>

      {/* ─── STATS ─── */}
      <section className="pe-section pe-section--tight pe-panel-bg">
        <div className="pe-container">
          <div className="pe-stats">
            <StatCounter raw="31%" label="AI-automation CAGR" i={0} />
            <StatCounter raw="<20%" label="SMBs have adopted (the gap)" i={1} />
            <StatCounter raw="$3.50" label="return per $1 (support AI)" i={2} />
            <StatCounter raw="100%" label="on your servers" i={3} />
          </div>
          <p className="pe-stat-note">Illustrative industry figures, not performance guarantees.</p>
        </div>
      </section>

      {/* ─── WHAT WE AUTOMATE ─── */}
      <section className="pe-section" id="what">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 14 }}>
            <span className="pe-kicker">What we automate</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              We start with one high-ROI workflow.
            </h2>
          </div>
          <p
            className="pe-body pe-center pe-measure pe-reveal"
            style={{ margin: "0 auto 40px", "--i": 1 }}
          >
            We prove it, then expand. Every build ties to one measurable KPI.
          </p>

          <div className="pe-grid-4">
            {WHAT.map((c, idx) => {
              const Icon = c.icon;
              return (
                <article
                  key={c.name}
                  className="pe-card pe-card--hover pe-reveal"
                  style={{ "--i": idx }}
                >
                  <span className="pe-feature-ic" style={{ marginBottom: 14 }}>
                    <Icon size={15} />
                  </span>
                  <h3 className="pe-h3">{c.name}</h3>
                  <p className="pe-body" style={{ marginTop: 10 }}>
                    {c.body}
                  </p>
                </article>
              );
            })}
          </div>

          {/* How we work — 01-04 */}
          <div className="pe-spec pe-reveal" style={{ marginTop: 40 }}>
            <div className="pe-spec-label">How we work</div>
            <div className="pe-grid-4" style={{ marginTop: 18 }}>
              {HOW.map((s) => (
                <div key={s.n} className="pe-card pe-step">
                  <span className="pe-card-num">{s.n}</span>
                  <h3 className="pe-h3" style={{ marginTop: 8, fontSize: 18 }}>
                    {s.t}
                  </h3>
                  <p className="pe-body" style={{ marginTop: 8 }}>
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY SELF-HOSTED ─── */}
      <section className="pe-section pe-panel-bg" id="why">
        <div className="pe-container">
          <div className="pe-grid-2" style={{ alignItems: "center" }}>
            <div className="pe-reveal">
              <span className="pe-kicker">Why self-hosted</span>
              <h2 className="pe-h2" style={{ marginTop: 12 }}>
                Why self-hosted matters
              </h2>
              <p className="pe-lead" style={{ marginTop: 16 }}>
                Cloud automation tools (Zapier, Make) route your customer data
                and credentials through their servers. For anyone handling
                sensitive data, that's a compliance liability. We build on{" "}
                <span className="pe-accent">self-hosted n8n</span> — the logic,
                the data and the keys stay on your infrastructure.
              </p>
              <ul className="pe-feature-list" style={{ marginTop: 26 }}>
                {WHY.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.b}>
                      <span className="pe-feature-ic">
                        <Icon size={15} />
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
              <div className="pe-spec-label">How we work</div>
              <div style={{ marginTop: 10 }}>
                {HOW.map((s) => (
                  <div className="pe-spec-row" key={s.n}>
                    <span className="k">
                      <span className="pe-gold" style={{ fontWeight: 600 }}>
                        {s.n} ·
                      </span>{" "}
                      {s.t}
                    </span>
                    <span className="val">{s.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 14 }}>
            <span className="pe-kicker">Pricing</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Setup fee + monthly retainer.
            </h2>
          </div>
          <p
            className="pe-body pe-center pe-reveal"
            style={{ margin: "0 auto 40px", "--i": 1 }}
          >
            No per-task fees. Cancel anytime.
          </p>

          <div className="pe-price-grid">
            {/* Starter */}
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <span className="pe-price-name">Starter automation</span>
              <div className="pe-price-amt">
                €3,000 <small>setup</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> 1 high-ROI workflow
                </li>
                <li>
                  <Check size={15} /> Deployed on your n8n
                </li>
                <li>
                  <Check size={15} /> Training + docs
                </li>
                <li>
                  <Check size={15} /> + €800/mo retainer
                </li>
              </ul>
              <a href="#audit" className="pe-btn pe-btn-ghost">
                Start with an audit
              </a>
            </div>

            {/* Growth — most popular */}
            <div className="pe-price pe-price--pop pe-reveal" style={{ "--i": 1 }}>
              <span className="pe-price-tag">Most popular</span>
              <span className="pe-price-name">Growth package</span>
              <div className="pe-price-amt">
                €8,000 <small>setup</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> 3–5 connected workflows
                </li>
                <li>
                  <Check size={15} /> AI agents + integrations
                </li>
                <li>
                  <Check size={15} /> Dashboards + monitoring
                </li>
                <li>
                  <Check size={15} /> + €2,000/mo retainer
                </li>
              </ul>
              <a href="#audit" className="pe-btn pe-btn-primary">
                Get a free audit
              </a>
            </div>

            {/* Enterprise */}
            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <span className="pe-price-name">Enterprise</span>
              <div className="pe-price-amt">Custom</div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={15} /> Deep system integration
                </li>
                <li>
                  <Check size={15} /> Compliance + DPA + SLA
                </li>
                <li>
                  <Check size={15} /> Dedicated support
                </li>
                <li>
                  <Check size={15} /> Value-based pricing option
                </li>
              </ul>
              <a href="#audit" className="pe-btn pe-btn-ghost">
                Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEAD / AUDIT ─── */}
      <section className="pe-section pe-panel-bg" id="audit">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 28 }}>
            <span className="pe-kicker">Free automation audit</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Free automation audit
            </h2>
            <p
              className="pe-body pe-measure"
              style={{ margin: "14px auto 0" }}
            >
              Tell us your biggest manual time-sink. We'll map it and show you
              exactly what to automate — and what it saves.
            </p>
          </div>

          <div className="pe-measure pe-reveal" style={{ margin: "0 auto" }}>
            <LeadForm
              source="automation"
              fields={[
                {
                  name: "email",
                  label: "Work email",
                  type: "email",
                  placeholder: "you@company.com",
                  required: true,
                },
                {
                  name: "company",
                  label: "Company",
                  type: "text",
                  placeholder: "Company name",
                  required: true,
                },
                {
                  name: "painpoint",
                  label: "Biggest manual time-sink",
                  type: "textarea",
                  placeholder: "e.g. we manually qualify 100 leads/week",
                },
              ]}
              submitLabel="Get my free audit"
              successMsg="✓ Thanks! We'll come back with your audit."
              note="GDPR-ready by design · your data never leaves your servers."
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="pe-section" id="faq">
        <div className="pe-container pe-measure-wide" style={{ margin: "0 auto" }}>
          <div className="pe-center pe-reveal" style={{ marginBottom: 32 }}>
            <span className="pe-kicker">FAQ</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Common questions
            </h2>
          </div>

          <div className="pe-faq pe-reveal">
            <details>
              <summary>Is my data really private?</summary>
              <p>
                Yes — that's the whole point. Every automation runs on
                self-hosted n8n on your own infrastructure. The logic, the data
                and the API keys stay on your servers; nothing routes through a
                third-party cloud. It's structurally impossible for your
                customer data to leave your business.
              </p>
            </details>
            <details>
              <summary>What can you automate first?</summary>
              <p>
                We start with one high-ROI workflow tied to a single measurable
                KPI — usually lead-gen & outreach, customer-support triage, or
                automated reporting. The free audit maps your manual workflows
                and picks the one with the fastest payback.
              </p>
            </details>
            <details>
              <summary>Do I need n8n already?</summary>
              <p>
                No. We deploy self-hosted n8n on your infrastructure as part of
                the build, then hand over training and docs. There are no
                per-task fees — you get unlimited executions on your own
                servers.
              </p>
            </details>
            <details>
              <summary>How fast to first result?</summary>
              <p>
                After the free audit we build one high-impact automation,
                deploy it on your infra, and measure the KPI so you see the
                result — proof, not slides — before committing to a monthly
                retainer for monitoring and new workflows.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="pe-cta-band pe-section">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center pe-reveal">
          <h2 className="pe-h2">
            Stop doing work <span className="pe-accent">a robot should do.</span>
          </h2>
          <p
            className="pe-body pe-measure"
            style={{ margin: "16px auto 28px" }}
          >
            Get a free automation audit — we map your biggest manual time-sink
            and show you exactly what it saves.
          </p>
          <a href="#audit" className="pe-btn pe-btn-primary">
            Get my free audit
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <Footer
        brand="Northgate Automation"
        copy="© 2026 · Privacy-first AI automation · Self-hosted"
      />
    </main>
  );
}
