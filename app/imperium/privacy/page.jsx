import RevealRoot from "../_components/RevealRoot";
import Nav from "../_components/Nav";
import Footer from "../_components/Footer";

export const metadata = {
  title: "Privacy & terms — Paper Empires",
  description: "How the Paper Empires group handles the data you submit, our cookie-free analytics, and the terms covering our AI-assisted services.",
};

const CONTACT = "hello@paperempires.com"; // TODO (Mads): sæt rigtig kontakt + entitet før offentlig launch

function Block({ title, children }) {
  return (
    <div className="pe-reveal" style={{ marginTop: 36 }}>
      <h2 className="pe-h3" style={{ marginBottom: 10 }}>{title}</h2>
      <div className="pe-body">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main
      className="pe"
      id="top"
      style={{ "--accent": "#C9A14E", "--glow": "rgba(201,161,78,0.18)", "--accent-soft": "rgba(201,161,78,0.14)" }}
    >
      <RevealRoot />
      <Nav brand="Paper Empires" links={[{ href: "/imperium", label: "All ventures" }]} ctaLabel="Back to ventures" ctaHref="/imperium" />

      <section className="pe-section">
        <div className="pe-container pe-measure-wide">
          <span className="pe-eyebrow"><span className="pe-dot" /> Privacy &amp; terms</span>
          <h1 className="pe-h2" style={{ marginTop: 16 }}>Your data, in plain English.</h1>
          <p className="pe-lead" style={{ marginTop: 14 }}>
            This page covers the Paper Empires group and all its ventures (Faceless Foundry, ListingReel,
            AdForge, Northgate Automation, Beacon and Ringback AI). We keep it short and honest.
          </p>

          <Block title="What we collect">
            Only what you give us in a form — typically your email and a few details about your
            business, listing, product or brand. Plus anonymous, aggregate usage events (which page was
            viewed, which call-to-action was clicked) so we can improve the site.
          </Block>

          <Block title="No cookies, no tracking pixels">
            We don&rsquo;t set cookies and we don&rsquo;t use third-party advertising trackers. Our
            analytics are first-party and anonymous: no personal identifiers, and only the referring
            site&rsquo;s host (not the full URL) is recorded.
          </Block>

          <Block title="Why we use it">
            To respond to you and deliver what you asked for — a sample video, a demo, an audit or a
            quote. Your submission is processed on the basis of your consent and our legitimate interest
            in following up on an enquiry you started.
          </Block>

          <Block title="What we never do">
            We never sell your data, and we never share it with third parties for their own marketing.
            AI is used to assist production with human editorial review; your inputs are not used to
            train public models.
          </Block>

          <Block title="Retention & your rights">
            We keep enquiry data only as long as needed to follow up, then delete it. Under GDPR you can
            ask us to access, correct or delete your data, or to stop processing it — just email{" "}
            <a className="pe-accent" href={"mailto:" + CONTACT}>{CONTACT}</a>.
          </Block>

          <Block title="Terms, briefly">
            The ventures shown here are AI-assisted services. On-page demos and example reels are
            illustrative previews, not guarantees of a specific result. Pricing and availability may
            change. Ringback AI&rsquo;s live telephony is offered as a pilot. Nothing here is financial,
            legal or investment advice.
          </Block>

          <p className="pe-hero-fine" style={{ marginTop: 40 }}>
            Questions? <a className="pe-accent" href={"mailto:" + CONTACT}>{CONTACT}</a>
          </p>
        </div>
      </section>

      <Footer brand="Paper Empires" copy="© 2026 · Privacy & terms" />
    </main>
  );
}
