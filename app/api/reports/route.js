import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Læser de ugentlige agent-rapporter (skrevet af n8n "SOMI Edge ugentlig") til
// "Rapporter"-fanen i dashboardet.
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("reports")
    .select("id,kind,title,body_md,created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  if (error) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: data || [] });
}
