import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushReorder } from "@/lib/ideas";

export const dynamic = "force-dynamic";

// Sætter ny rækkefølge på idé-køen. Body: { order: [case_id, ...] } top-først.
// priority = position+1 (top=1) → MASTER henter 'ready' i priority ASC, så
// toppen produceres først. Skriver til Supabase (instant) + n8n (produktion).
export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const order = Array.isArray(body?.order) ? body.order.filter((x) => typeof x === "string" && x) : [];
  if (!order.length) return NextResponse.json({ error: "tom rækkefølge" }, { status: 400 });

  const items = order.map((case_id, i) => ({ case_id, priority: i + 1 }));

  // Supabase: opdatér priority pr. række (id = case_id). Kun eksisterende rækker.
  const admin = createAdminClient();
  const results = await Promise.all(
    items.map((it) => admin.from("ideas").update({ priority: it.priority }).eq("id", it.case_id))
  );
  const dbError = results.find((r) => r.error);
  if (dbError) return NextResponse.json({ error: dbError.error.message }, { status: 500 });

  // n8n: opdatér priority i produktions-tabellen (rører ikke status).
  const n8n = await pushReorder(items);

  return NextResponse.json({ ok: true, updated: items.length, n8n });
}
