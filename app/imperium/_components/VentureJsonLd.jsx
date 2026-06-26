import { bySlug } from "../_data/ventures";

// Genbrugbar JSON-LD for venture-siderne: Organization + Service + Offer (+ valgfri
// FAQPage). Giver rich-results i Google og bedre forståelse i AI-engines (on-brand
// for Beacon). FAQPage tilføjes kun når `faqs` gives — og SKAL matche synligt indhold.
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app").replace(/\/$/, "");
const CUR = { "€": "EUR", $: "USD", "£": "GBP" };

function parsePrice(price) {
  const m = (price || "").match(/([€$£])\s?([\d.,]+)/);
  if (!m) return null;
  return { priceCurrency: CUR[m[1]] || "USD", price: m[2].replace(/[.,]/g, "") };
}

export default function VentureJsonLd({ slug, faqs }) {
  const v = bySlug(slug);
  if (!v) return null;
  const url = `${BASE}/imperium/${slug}`;
  const offer = parsePrice(v.price);

  const graph = [
    {
      "@type": "Organization",
      "@id": `${BASE}/imperium#org`,
      name: "Paper Empires",
      url: `${BASE}/imperium`,
    },
    {
      "@type": "Service",
      name: v.name,
      serviceType: v.category,
      description: v.oneLine,
      url,
      provider: { "@id": `${BASE}/imperium#org` },
      ...(offer
        ? { offers: { "@type": "Offer", price: offer.price, priceCurrency: offer.priceCurrency, url } }
        : {}),
    },
  ];

  if (Array.isArray(faqs) && faqs.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
