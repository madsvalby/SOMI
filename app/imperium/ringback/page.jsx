import {
  Check,
  PhoneCall,
  CalendarCheck,
  UserPlus,
  Siren,
  ArrowRight,
} from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Track from "../_components/Track.jsx";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import RingbackMockup from "../_components/mockups/RingbackMockup";

const ACCENT = "#3FA66A";
const GLOW = "rgba(63,166,106,0.18)";
const SOFT = "rgba(63,166,106,0.14)";

export const metadata = {
  alternates: { canonical: "/imperium/ringback" },
  openGraph: { url: "/imperium/ringback", title: "Ringback AI — Never miss another customer call" },
  title: "Ringback AI — Never miss another customer call",
  description:
    "An AI receptionist that answers every call 24/7, books jobs, and captures every lead — so you never lose a customer to a missed call again.",
};

export default function RingbackPage() {
  return (
    <main
      className="pe"
      id="top"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Track slug="ringback" />

      <Nav
        brand="Ringback AI"
        icon={<PhoneCall size={16} strokeWidth={2} />}
        links={[
          { href: "#problem", label: "Missed call" },
          { href: "#how", label: "Receptionist" },
          { href: "#pricing", label: "Pricing" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaLabel="Hear it live"
        ctaHref="#demo"
      />

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <header className="pe-hero">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-split">
            <div className="pe-hero-copy">
              <span className="pe-eyebrow">
                <span className="pe-dot" />
                Answers 24/7 · books jobs · captures every lead
              </span>
              <h1 className="pe-h1">
                Never miss another{" "}
                <span className="pe-mark">customer call.</span>
              </h1>
              <p className="pe-lead">
                Your AI receptionist will answer every call — day or night —
                book the job, and text you the details. Start with a free 2-week
                pilot and stop losing customers to voicemail and competitors.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#demo" className="pe-btn pe-btn-primary">
                  Hear a live demo
                </a>
                <a href="#pricing" className="pe-btn pe-btn-ghost">
                  See pricing
                </a>
              </div>
              <p className="pe-hero-fine">
                From <b>€399/mo</b> · 2-week free pilot · setup in days
              </p>
            </div>
            <div>
              <RingbackMockup />
            </div>
          </div>
        </div>
      </header>

      {/* ── problem stats ────────────────────────────────────────────────── */}
      <section className="pe-section pe-section--tight pe-panel-bg" id="problem">
        <div className="pe-container">
          <h2 className="pe-h2 pe-center pe-reveal">
            A missed call is a lost customer
          </h2>
          <div className="pe-stats" style={{ marginTop: 40 }}>
            <StatCounter
              raw="62%"
              label="of business calls go unanswered"
              i={0}
            />
            <StatCounter raw="62%" label="then call a competitor" i={1} />
            <StatCounter
              raw="~€350"
              label="avg value of one missed call"
              i={2}
            />
            <StatCounter
              raw="€45k+"
              label="/yr lost by a typical contractor"
              i={3}
            />
          </div>
        </div>
      </section>

      {/* ── how it works ─────────────────────────────────────────────────── */}
      <section className="pe-section" id="how">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 12 }}>
            <span className="pe-kicker">How it will work</span>
          </div>
          <h2
            className="pe-h2 pe-center pe-reveal"
            style={{ marginBottom: 14 }}
          >
            Like hiring a receptionist who never sleeps
          </h2>
          <p
            className="pe-lead pe-center pe-reveal pe-measure"
            style={{ marginBottom: 48, marginInline: "auto" }}
          >
            Here's what your AI receptionist will do once it goes live on your
            number — starting with your free 2-week pilot.
          </p>

          <div className="pe-grid-4">
            <article className="pe-card pe-step pe-reveal" style={{ "--i": 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span className="pe-card-num">01</span>
                <PhoneCall size={18} color={ACCENT} />
              </div>
              <h3 className="pe-h3">Answers instantly</h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Every call picked up on the first ring, 24/7 — with a natural,
                human-sounding voice.
              </p>
            </article>

            <article className="pe-card pe-step pe-reveal" style={{ "--i": 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span className="pe-card-num">02</span>
                <CalendarCheck size={18} color={ACCENT} />
              </div>
              <h3 className="pe-h3">Books the job</h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Checks your calendar, books appointments, and confirms by SMS —
                automatically.
              </p>
            </article>

            <article className="pe-card pe-step pe-reveal" style={{ "--i": 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span className="pe-card-num">03</span>
                <UserPlus size={18} color={ACCENT} />
              </div>
              <h3 className="pe-h3">Captures the lead</h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Name, number, and the reason for the call — logged and texted to
                you in real time.
              </p>
            </article>

            <article className="pe-card pe-step pe-reveal" style={{ "--i": 3 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span className="pe-card-num">04</span>
                <Siren size={18} color={ACCENT} />
              </div>
              <h3 className="pe-h3">Escalates emergencies</h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Urgent jobs? It transfers or texts you immediately so you never
                miss the big ones.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── why us / math panel ──────────────────────────────────────────── */}
      <section className="pe-section pe-panel-bg">
        <div className="pe-container">
          <div className="pe-grid-2">
            <div className="pe-reveal">
              <span className="pe-kicker">Why it pays for itself</span>
              <h2 className="pe-h2" style={{ marginTop: 12, marginBottom: 26 }}>
                One saved job covers the month.
              </h2>
              <ul className="pe-feature-list">
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Answers every call</b>
                    <br />
                    <span className="t">
                      First ring, 24/7 — no voicemail, no missed customers, no
                      after-hours gaps.
                    </span>
                  </span>
                </li>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Flat monthly — no per-minute surprises</b>
                    <br />
                    <span className="t">
                      One predictable bill. Start with a free 2-week pilot
                      before you pay a cent.
                    </span>
                  </span>
                </li>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Inbound-first, compliant by design</b>
                    <br />
                    <span className="t">
                      Every call discloses it's AI-assisted. Inbound-only keeps
                      you TCPA-safe.
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="pe-spec pe-reveal" style={{ "--i": 1 }}>
              <span className="pe-spec-label">The cost of one missed call</span>
              <div style={{ marginTop: 14 }}>
                <div className="pe-spec-row">
                  <span className="k">Business calls unanswered</span>
                  <span className="val">62%</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Of those, call a competitor</span>
                  <span className="val">62%</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Avg value of one missed call</span>
                  <span className="val">~€350</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Lost per year, typical contractor</span>
                  <span className="val accent">€45k+</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Ringback Solo</span>
                  <span className="val accent">€399/mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── pricing ──────────────────────────────────────────────────────── */}
      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 12 }}>
            <h2 className="pe-h2">Pricing</h2>
            <p className="pe-lead" style={{ marginTop: 12 }}>
              Flat monthly — no per-minute surprises. Start with a free 2-week
              pilot.
            </p>
          </div>

          <div className="pe-price-grid" style={{ marginTop: 44 }}>
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <span className="pe-price-name">Solo</span>
              <div className="pe-price-amt">
                €399<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} />
                  24/7 call answering
                </li>
                <li>
                  <Check size={16} />
                  Booking + SMS confirm
                </li>
                <li>
                  <Check size={16} />
                  Lead capture + logs
                </li>
                <li>
                  <Check size={16} />1 number
                </li>
              </ul>
              <a href="#demo" className="pe-btn pe-btn-ghost">
                Start free pilot
              </a>
            </div>

            <div
              className="pe-price pe-price--pop pe-reveal"
              style={{ "--i": 1 }}
            >
              <span className="pe-price-tag">Most popular</span>
              <span className="pe-price-name">Pro</span>
              <div className="pe-price-amt">
                €699<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} />
                  Everything in Solo
                </li>
                <li>
                  <Check size={16} />
                  Custom cloned brand voice
                </li>
                <li>
                  <Check size={16} />
                  CRM integration
                </li>
                <li>
                  <Check size={16} />
                  Emergency routing
                </li>
                <li>
                  <Check size={16} />
                  Call dashboard + ROI report
                </li>
              </ul>
              <p className="pe-hero-fine" style={{ marginBottom: 16 }}>
                Cloned voice, CRM, emergency routing &amp; dashboard roll out
                during the pilot — included once your line is live.
              </p>
              <a href="#demo" className="pe-btn pe-btn-primary">
                Book a demo
              </a>
            </div>

            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <span className="pe-price-name">Multi-location</span>
              <div className="pe-price-amt">Custom</div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} />
                  Multiple numbers/sites
                </li>
                <li>
                  <Check size={16} />
                  HIPAA option (dental/medical)
                </li>
                <li>
                  <Check size={16} />
                  Priority support + SLA
                </li>
              </ul>
              <a href="#demo" className="pe-btn pe-btn-ghost">
                Book a call
              </a>
            </div>
          </div>

          <p
            className="pe-hero-fine pe-center"
            style={{ marginTop: 22 }}
          >
            All calls disclose they're AI-assisted, per regulations.
            Inbound-first (TCPA-safe).
          </p>
        </div>
      </section>

      {/* ── lead / demo ──────────────────────────────────────────────────── */}
      <section className="pe-section pe-panel-bg" id="demo">
        <div className="pe-container">
          <div
            className="pe-center pe-reveal"
            style={{ marginBottom: 28, maxWidth: 640, marginInline: "auto" }}
          >
            <span className="pe-kicker">Hear it for yourself</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Book your free demo
            </h2>
            <p className="pe-lead" style={{ marginTop: 12 }}>
              Book a 15-minute demo and we'll show you your own AI receptionist
              answering a call live — no commitment. (A talk-to-the-AI web demo
              is coming soon.)
            </p>
          </div>

          <div className="pe-measure" style={{ marginInline: "auto" }}>
            <LeadForm
              source="voice"
              fields={[
                {
                  name: "email",
                  label: "Your email",
                  type: "email",
                  placeholder: "you@business.com",
                  required: true,
                },
                {
                  name: "biz",
                  label: "Business type",
                  type: "text",
                  placeholder: "e.g. plumbing, dental, salon",
                  required: true,
                },
              ]}
              submitLabel="Book my free demo"
              successMsg="✓ Thanks! We'll be in touch to book your demo."
              note="Book a 15-minute demo and we'll show you your own AI receptionist answering a call live — no commitment."
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="pe-section" id="faq">
        <div className="pe-container">
          <h2
            className="pe-h2 pe-center pe-reveal"
            style={{ marginBottom: 36 }}
          >
            Common questions
          </h2>
          <div className="pe-faq pe-measure pe-reveal" style={{ marginInline: "auto" }}>
            <details>
              <summary>How quickly can it go live?</summary>
              <p>
                Setup takes days, not months. We start with a free 2-week pilot
                on your number so you can hear it handling real calls before you
                commit to anything.
              </p>
            </details>
            <details>
              <summary>Will callers know it's AI?</summary>
              <p>
                Yes — every call discloses that it's AI-assisted, per
                regulations. The voice is natural and human-sounding, and on Pro
                we can clone your own brand voice.
              </p>
            </details>
            <details>
              <summary>Does it book into my calendar?</summary>
              <p>
                It checks your calendar, books the appointment, and confirms by
                SMS automatically — then texts you the caller's name, number,
                and the reason for the call in real time.
              </p>
            </details>
            <details>
              <summary>What happens with emergencies?</summary>
              <p>
                Urgent jobs are flagged and escalated immediately — it transfers
                the call to you or texts you on the spot, so you never miss the
                big ones.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ── final CTA band ───────────────────────────────────────────────── */}
      <section className="pe-cta-band pe-section">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center" style={{ position: "relative" }}>
          <h2 className="pe-h2 pe-reveal">
            Stop losing customers to voicemail.
          </h2>
          <p
            className="pe-lead pe-reveal pe-measure"
            style={{ "--i": 1, marginTop: 14, marginInline: "auto" }}
          >
            Book a free demo and hear your own AI receptionist answer a call
            live. Free 2-week pilot — no commitment.
          </p>
          <div
            className="pe-reveal"
            style={{
              "--i": 2,
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a href="#demo" className="pe-btn pe-btn-primary">
              Book my free demo
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <Footer
        brand="Ringback AI"
        copy="© 2026 · AI receptionist for service businesses"
      />
    </main>
  );
}
