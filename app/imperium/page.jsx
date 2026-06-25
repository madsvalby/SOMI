import { ArrowUpRight, Crown } from "lucide-react";
import RevealRoot from "./_components/RevealRoot";
import Track from "./_components/Track.jsx";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";
import { VENTURES } from "./_data/ventures";

export const metadata = {
  title: "The Paper Empires Group — Six AI ventures, one factory",
  description:
    "Six near-zero-marginal-cost AI content & automation ventures built on one self-hosted render factory and a free local voice clone.",
};

export default function ImperiumHub() {
  return (
    <main
      className="pe"
      id="top"
      style={{
        "--accent": "#C9A14E",
        "--glow": "rgba(201,161,78,0.18)",
        "--accent-soft": "rgba(201,161,78,0.14)",
      }}
    >
      <RevealRoot />
      <Track slug="hub" />

      <Nav
        brand="Paper Empires"
        icon={<Crown size={16} strokeWidth={2} />}
        links={[{ href: "#ventures", label: "Ventures" }]}
        ctaLabel="See the flagship"
        ctaHref="/imperium/faceless"
      />

      <header className="pe-hero">
        <div className="pe-hero-glow" />
        <div className="pe-hero-grid" />
        <div className="pe-container pe-hero-inner">
          <div className="pe-hero-copy pe-measure-wide">
            <span className="pe-eyebrow">
              <span className="pe-dot" />
              The Paper Empires Group
            </span>
            <h1 className="pe-h1">
              Six ventures. <span className="pe-mark">One factory.</span>
            </h1>
            <p className="pe-lead">
              Every venture runs on the same engine: a self-hosted render
              pipeline and a free, locally-cloned voice. No per-minute API
              meters, no per-seat SaaS bills — just{" "}
              <span className="pe-accent">near-zero marginal cost</span>{" "}
              compounding across the whole group.
            </p>
            <div className="pe-hero-cta-row">
              <a href="#ventures" className="pe-btn pe-btn-primary">
                Explore the ventures
              </a>
              <a href="/imperium/faceless" className="pe-btn pe-btn-ghost">
                See the flagship
              </a>
            </div>
            <p className="pe-hero-fine">
              <b>One render factory.</b> Six products. Shared marginal cost
              near zero.
            </p>
          </div>
        </div>
      </header>

      <section className="pe-section" id="ventures">
        <div className="pe-container">
          <div className="pe-center pe-reveal" style={{ marginBottom: 40 }}>
            <span className="pe-kicker">The portfolio</span>
            <h2 className="pe-h2" style={{ marginTop: 12 }}>
              Six ways to sell the same factory.
            </h2>
          </div>

          <div className="pe-grid-3">
            {VENTURES.map((v, idx) => (
              <article
                key={v.slug}
                className="pe-card pe-card--hover pe-reveal"
                style={{
                  "--accent": v.accent,
                  "--glow": v.glow,
                  "--i": idx,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background:
                      "linear-gradient(90deg, var(--accent), transparent)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <span className="pe-card-num">
                    #{v.rank}
                  </span>
                  <span className="pe-tag pe-tag--accent">{v.category}</span>
                </div>

                <h3 className="pe-h3">{v.name}</h3>
                <p className="pe-body" style={{ marginTop: 10 }}>
                  {v.oneLine}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 22,
                    gap: 12,
                  }}
                >
                  <span className="pe-accent" style={{ fontWeight: 600, fontSize: 14 }}>
                    {v.price}
                  </span>
                  <a
                    href={"/imperium/" + v.slug}
                    className="pe-btn pe-btn-ghost pe-btn-sm"
                  >
                    Open
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer
        brand="Paper Empires"
        copy="© 2026 · Near-zero-marginal-cost AI ventures"
      />
    </main>
  );
}
