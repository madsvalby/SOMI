// Sera — separat brand fra Paper Empires. html/body kommer fra rod-layout.
export const metadata = {
  title: "Sera — AI Virtual Creator",
  description: "Sera is an AI-generated virtual creator. Not a real person. 18+.",
  openGraph: {
    type: "website",
    title: "Sera — AI Virtual Creator",
    description: "AI-generated virtual creator. Not a real person. 18+.",
  },
  twitter: { card: "summary_large_image", title: "Sera — AI Virtual Creator" },
};

export default function SeraLayout({ children }) {
  return children;
}
