import { ogImage, OG_SIZE } from "../_components/ogImage";
import { bySlug } from "../_data/ventures";

export const runtime = "edge";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Northgate Automation — Paper Empires";

export default function Image() {
  return ogImage(bySlug("automation"));
}
