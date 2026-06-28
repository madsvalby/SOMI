import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Offentlig, læs-kun config til Sera-landingen. Returnerer KUN sikre felter
// (brand + disclosure + link-hub) fra den enkelte vcl_state-række (service_role,
// bypasser RLS). Aldrig KYC/metrics/økonomi. Fejler blødt → fallback.
export const dynamic = "force-dynamic";

const PLATFORM_LABELS = { fanvue: "Fanvue", instagram: "Instagram", fansly: "Fansly" };
const FALLBACK = {
  brand: "Sera",
  disclosure: "AI-generated virtual creator · not a real person · 18+",
  links: [],
};

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("dashboard_state")
      .select("value")
      .eq("key", "vcl_state")
      .limit(1)
      .maybeSingle();
    const v = data && data.value;
    if (!v) return NextResponse.json(FALLBACK);

    const brand = (v.project && (v.project.brand || v.project.name)) || "Sera";
    const disclosure = (v.persona && v.persona.disclosureText) || FALLBACK.disclosure;
    const links = (Array.isArray(v.platforms) ? v.platforms : [])
      .filter((p) => p && p.url && p.key !== "landing" && p.status !== "incompatible")
      .map((p) => ({
        key: p.key,
        label: PLATFORM_LABELS[p.key] || p.label || p.key,
        url: String(p.url).slice(0, 300),
        role: (p.role || "").slice(0, 80),
      }));
    return NextResponse.json({ brand: String(brand).slice(0, 60), disclosure: String(disclosure).slice(0, 160), links });
  } catch (e) {
    return NextResponse.json(FALLBACK);
  }
}
