import "./imperium.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://somi-phi.vercel.app"),
  title: "The Paper Empires Group — AI ventures",
  description:
    "Six near-zero-marginal-cost AI content & automation ventures.",
  openGraph: { type: "website", siteName: "Paper Empires" },
  twitter: { card: "summary_large_image" },
};

// html/body kommer fra rod-layout — tilføj IKKE html/body her.
export default function ImperiumLayout({ children }) {
  return children;
}
