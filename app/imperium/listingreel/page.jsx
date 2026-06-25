import { Check, Home } from "lucide-react";
import RevealRoot from "../_components/RevealRoot";
import Track from "../_components/Track.jsx";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";
import StatCounter from "../_components/StatCounter";
import LeadForm from "../_components/LeadForm";
import ListingreelMockup from "../_components/mockups/ListingreelMockup";

const ACCENT = "#1F9E8F";
const GLOW = "rgba(31,158,143,0.18)";
const SOFT = "rgba(31,158,143,0.14)";

export const metadata = {
  title: "ListingReel — Every listing becomes a video. Automatically.",
  description:
    "Turn any property listing into a narrated, branded walkthrough video — in minutes, automatically. Built for real-estate agents. From $49/mo.",
};

export default function ListingReelPage() {
  return (
    <main
      className="pe"
      id="top"
      style={{ "--accent": ACCENT, "--glow": GLOW, "--accent-soft": SOFT }}
    >
      <RevealRoot />
      <Track slug="listingreel" />

      <Nav
        brand="ListingReel"
        icon={<Home size={16} strokeWidth={2} />}
        links={[
          { href: "#how", label: "How it works" },
          { href: "#why", label: "Why agents love it" },
          { href: "#pricing", label: "Pricing" },
          { href: "#faq", label: "FAQ" },
        ]}
        ctaLabel="Make a free reel"
        ctaHref="#start"
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
                Photos in · narrated branded video out · auto-posted
              </span>
              <h1 className="pe-h1">
                Every listing becomes a video.{" "}
                <span className="pe-mark">Automatically.</span>
              </h1>
              <p className="pe-lead">
                Upload your listing photos and details — ListingReel writes the
                script, narrates it in your own voice, and assembles a branded
                walkthrough Reel ready to post. No editor, no videographer, no
                $500 invoice.
              </p>
              <div className="pe-hero-cta-row">
                <a href="#start" className="pe-btn pe-btn-primary">
                  Make my first reel free
                </a>
                <a href="#pricing" className="pe-btn pe-btn-ghost">
                  See pricing
                </a>
              </div>
              <p className="pe-hero-fine">
                From <span className="pe-accent">$49/mo</span> · vs $250–1,000
                per video from a videographer
              </p>
            </div>
            <div>
              <ListingreelMockup />
            </div>
          </div>
        </div>
      </header>

      {/* ── STATS ── */}
      <section className="pe-section pe-section--tight pe-panel-bg">
        <div className="pe-container">
          <div className="pe-stats">
            <StatCounter
              raw="$250–1k"
              label="cost of one listing video"
              i={0}
            />
            <StatCounter raw="~2 min" label="to make one with ListingReel" i={1} />
            <StatCounter raw="2×" label="engagement of static posts" i={2} />
            <StatCounter raw="100%" label="your voice & branding" i={3} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pe-section" id="how">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 44 }}>
            <span className="pe-kicker">How it works</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Three steps, zero editing
            </h2>
          </div>

          <div className="pe-grid-3">
            <article
              className="pe-card pe-step pe-reveal"
              style={{ "--i": 0 }}
            >
              <div className="pe-card-num">01</div>
              <h3 className="pe-h3" style={{ marginTop: 12 }}>
                Add the listing
              </h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Upload photos + paste the address and key facts (or connect your
                portal).
              </p>
            </article>

            <article
              className="pe-card pe-step pe-reveal"
              style={{ "--i": 1 }}
            >
              <div className="pe-card-num">02</div>
              <h3 className="pe-h3" style={{ marginTop: 12 }}>
                We build the reel
              </h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                AI writes a punchy walkthrough script, narrates it in your cloned
                voice, and assembles a branded video.
              </p>
            </article>

            <article
              className="pe-card pe-step pe-reveal"
              style={{ "--i": 2 }}
            >
              <div className="pe-card-num">03</div>
              <h3 className="pe-h3" style={{ marginTop: 12 }}>
                Post everywhere
              </h3>
              <p className="pe-body" style={{ marginTop: 10 }}>
                Download or auto-publish to Instagram, TikTok, Facebook &
                YouTube — on brand, every time.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="pe-section pe-panel-bg" id="why">
        <div className="pe-container">
          <div className="pe-grid-2" style={{ alignItems: "center" }}>
            <div className="pe-reveal">
              <span className="pe-kicker">Why agents love it</span>
              <h2 className="pe-h2" style={{ marginTop: 12 }}>
                Your brand. Your voice. On autopilot.
              </h2>
              <p className="pe-lead" style={{ marginTop: 16 }}>
                Record a 60-second voice sample once. From then on, every listing
                is narrated in your own voice with your logo and colors — the
                consistency that builds a recognizable agent brand, without the
                work.
              </p>

              <ul className="pe-feature-list" style={{ marginTop: 26 }}>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Pennies per video.</b>{" "}
                    <span className="t">
                      We run our own render + voice engine, so we can price
                      per-listing where others can&apos;t.
                    </span>
                  </span>
                </li>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>One consistent voice.</b>{" "}
                    <span className="t">
                      Your cloned narrator on every reel = a real brand, not
                      random AI voices.
                    </span>
                  </span>
                </li>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Brokerage-ready.</b>{" "}
                    <span className="t">
                      Add your whole team under one account with shared branding.
                    </span>
                  </span>
                </li>
                <li>
                  <span className="pe-feature-ic">
                    <Check size={15} />
                  </span>
                  <span>
                    <b>Set &amp; forget.</b>{" "}
                    <span className="t">
                      New listing in → finished reel out → posted. You just close
                      deals.
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="pe-spec pe-reveal" style={{ "--i": 1 }}>
              <div className="pe-spec-label">A typical agent</div>
              <div style={{ marginTop: 14 }}>
                <div className="pe-spec-row">
                  <span className="k">4 listings/month, videographer</span>
                  <span className="val">~$2,000</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Same with ListingReel (Pro)</span>
                  <span className="val accent">$149</span>
                </div>
                <div className="pe-spec-row">
                  <span className="k">Monthly saving</span>
                  <span className="val accent">~$1,850</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pe-section" id="pricing">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 14 }}>
            <span className="pe-kicker">Pricing</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Pricing
            </h2>
          </div>
          <p className="pe-body pe-center" style={{ marginBottom: 44 }}>
            Cancel anytime. Overage just $9/extra listing.
          </p>

          <div className="pe-price-grid">
            <div className="pe-price pe-reveal" style={{ "--i": 0 }}>
              <div className="pe-price-name">Starter</div>
              <div className="pe-price-amt">
                $49<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> 5 listing reels / mo
                </li>
                <li>
                  <Check size={16} /> Your cloned voice
                </li>
                <li>
                  <Check size={16} /> Branded template
                </li>
                <li>
                  <Check size={16} /> Download + share
                </li>
              </ul>
              <a href="#start" className="pe-btn pe-btn-ghost">
                Start free
              </a>
            </div>

            <div className="pe-price pe-price--pop pe-reveal" style={{ "--i": 1 }}>
              <span className="pe-price-tag">Most popular</span>
              <div className="pe-price-name">Pro</div>
              <div className="pe-price-amt">
                $149<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> 20 listing reels / mo
                </li>
                <li>
                  <Check size={16} /> Auto-post to socials
                </li>
                <li>
                  <Check size={16} /> Custom branding
                </li>
                <li>
                  <Check size={16} /> Priority rendering
                </li>
              </ul>
              <a href="#start" className="pe-btn pe-btn-primary">
                Start free
              </a>
            </div>

            <div className="pe-price pe-reveal" style={{ "--i": 2 }}>
              <div className="pe-price-name">Brokerage</div>
              <div className="pe-price-amt">
                $399<small>/mo</small>
              </div>
              <ul className="pe-price-feats">
                <li>
                  <Check size={16} /> Multi-agent team
                </li>
                <li>
                  <Check size={16} /> Shared brand kit
                </li>
                <li>
                  <Check size={16} /> Admin dashboard
                </li>
                <li>
                  <Check size={16} /> Onboarding + support
                </li>
              </ul>
              <a href="#start" className="pe-btn pe-btn-ghost">
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEAD ── */}
      <section className="pe-section pe-panel-bg" id="start">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 36 }}>
            <span className="pe-kicker">Try it free</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Make your first reel — free
            </h2>
            <p className="pe-lead pe-center" style={{ marginTop: 14 }}>
              Send us one listing and we&apos;ll send back a finished branded
              reel. No card needed.
            </p>
          </div>

          <div className="pe-measure">
            <LeadForm
              source="listingreel"
              fields={[
                {
                  name: "email",
                  label: "Your email",
                  type: "email",
                  placeholder: "you@realty.com",
                  required: true,
                },
                {
                  name: "niche",
                  label: "Listing URL / brokerage",
                  type: "text",
                  placeholder: "link to a listing",
                  required: true,
                },
              ]}
              submitLabel="Make my free reel"
              successMsg="✓ Thanks! Your free reel is on the way."
              note="Send us one listing and we'll send back a finished branded reel. No card needed."
            />
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pe-section" id="faq">
        <div className="pe-container pe-measure-wide">
          <div className="pe-center pe-reveal" style={{ marginBottom: 36 }}>
            <span className="pe-kicker">FAQ</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Questions, answered
            </h2>
          </div>

          <div className="pe-faq pe-reveal">
            <details>
              <summary>Do I need any editing skills?</summary>
              <p>
                None. You add the listing photos and key facts — ListingReel
                writes the script, narrates it, and assembles a finished branded
                reel for you. There&apos;s nothing to edit and no software to
                learn.
              </p>
            </details>
            <details>
              <summary>Whose voice narrates?</summary>
              <p>
                Yours. Record a 60-second voice sample once and every listing is
                narrated in your own cloned voice — one consistent narrator
                across every reel, not random AI voices.
              </p>
            </details>
            <details>
              <summary>Can my whole team use it?</summary>
              <p>
                Yes. The Brokerage plan adds your whole team under one account
                with a shared brand kit, an admin dashboard, and onboarding +
                support.
              </p>
            </details>
            <details>
              <summary>Where does it post?</summary>
              <p>
                Anywhere your buyers are. Download the finished reel or
                auto-publish straight to Instagram, TikTok, Facebook &amp;
                YouTube — on brand, every time.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="pe-cta-band pe-section">
        <div className="pe-hero-glow" />
        <div className="pe-container pe-center">
          <h2 className="pe-h2 pe-reveal">
            Every listing becomes a video.{" "}
            <span className="pe-accent">Automatically.</span>
          </h2>
          <div
            className="pe-reveal"
            style={{ marginTop: 28, "--i": 1 }}
          >
            <a href="#start" className="pe-btn pe-btn-primary">
              Make my first reel free
            </a>
          </div>
        </div>
      </section>

      <Footer
        brand="ListingReel"
        copy="© 2026 · Listing videos on autopilot"
      />
    </main>
  );
}
