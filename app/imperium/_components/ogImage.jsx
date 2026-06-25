import { ImageResponse } from "next/og";

// Delt social-share-kort (1200×630) til alle imperium-ruter.
// satori-safe CSS: eksplicit display:flex på multi-child-containere, linear-gradient (ingen blur/radial),
// system-sans (ingen font-fetch → robust). Per-venture accent/glow gør hvert kort distinkt.
export const OG_SIZE = { width: 1200, height: 630 };

export function ogImage(v) {
  const accent = v.accent;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#0B0F14",
          backgroundImage: `linear-gradient(135deg, ${v.glow}, transparent 55%)`,
          borderTop: `8px solid ${accent}`,
          color: "#F2F2EA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: accent, marginRight: 16 }} />
          <div style={{ fontSize: 26, letterSpacing: 4, color: "#9AA6B2", textTransform: "uppercase" }}>
            Paper Empires
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, maxWidth: 1010 }}>
            {v.name}
          </div>
          <div style={{ width: 120, height: 6, background: accent, borderRadius: 3, marginTop: 28, marginBottom: 28 }} />
          <div style={{ fontSize: 42, color: "#C9CBD0", lineHeight: 1.25, maxWidth: 980 }}>{v.tagline}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 26, color: "#9AA6B2" }}>{v.category}</div>
          <div style={{ fontSize: 28, color: accent, fontWeight: 600 }}>{v.price}</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
