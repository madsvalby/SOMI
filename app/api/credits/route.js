import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Læser credit-/budget-status (skrevet af n8n "SOMI CREDIT WATCH") og returnerer
// en liste + et samlet alarm-flag, så dashboardet kan vise et advarsels-banner
// når en platform er lavt på credits eller månedens forbrug nærmer sig budgettet.
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("credits")
    .select("platform,used,total,remaining_pct,status,note,updated_at");

  if (error) return NextResponse.json({ items: [], alert: false });

  const LABELS = {
    elevenlabs: "ElevenLabs (VO)",
    spend_month: "Forbrug denne måned",
  };
  const items = (data || []).map((r) => ({
    platform: r.platform,
    label: LABELS[r.platform] || r.platform,
    used: r.used == null ? null : Number(r.used),
    total: r.total == null ? null : Number(r.total),
    remainingPct: r.remaining_pct == null ? null : Number(r.remaining_pct),
    status: r.status || "ok",
    note: r.note || "",
    updatedAt: r.updated_at || null,
  }));

  const warn = items.filter((i) => i.status === "warn" || i.status === "low");
  return NextResponse.json({
    items,
    alert: warn.length > 0,
    worst: warn.some((i) => i.status === "low") ? "low" : warn.length ? "warn" : "ok",
  });
}
