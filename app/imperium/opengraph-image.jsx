import { ogImage, OG_SIZE } from "./_components/ogImage";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "The Paper Empires Group — six AI ventures";

export default function Image() {
  return ogImage({
    name: "Paper Empires",
    tagline: "Six ventures. One factory — near-zero marginal cost.",
    accent: "#C9A14E",
    glow: "rgba(201,161,78,0.18)",
    category: "The AI ventures group",
    price: "Six ventures",
  });
}
