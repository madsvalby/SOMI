import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildIdeaRows, pushToN8n, WINNER_SOURCE, PROPOSED_STATUS } from "@/lib/ideas";

export const dynamic = "force-dynamic";

// Idé-køen (ideas-tabellen, delt med n8n).
//  GET  → læser køen og deler den i `proposed` (winner-loop-forslag, afventer
//         godkendelse) og `live` (n8n's egne / godkendte idéer).
//  POST → skriver nye winner-loop-forslag ind (status='proposed'). Kræver
//         service_role (ideas har kun "auth read"-RLS), så insert går via admin.
// Dette er app-siden af den lukkede loop: winner-loop → ideas-tabel. Broen
// videre til n8n's produktions-Data-Table er et separat, bevidst næste skridt.

function shape(r) {
  return {
    id: r.id,
    case_id: r.case_id || null,
    title: r.title || r.case_id || "Uden titel",
    hook: r.hook || "",
    source: r.source || "",
    status: r.status || "",
    priority: r.priority == null ? null : Number(r.priority),
  };
}

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("ideas")
    .select("id,case_id,title,hook,source,status,priority");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const all = (data || []).map(shape);
  const byPriority = (a, b) => (b.priority || 0) - (a.priority || 0);
  const isProposed = (r) => r.source === WINNER_SOURCE || r.status === PROPOSED_STATUS;

  return NextResponse.json({
    proposed: all.filter(isProposed).sort(byPriority),
    live: all.filter((r) => !isProposed(r)).sort(byPriority),
    counts: { total: all.length },
  });
}

export async function POST(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const ideas = Array.isArray(body?.ideas) ? body.ideas : [];
  if (!ideas.length) {
    return NextResponse.json({ error: "ingen idéer i request" }, { status: 400 });
  }
  const source = typeof body?.source === "string" && body.source ? body.source : WINNER_SOURCE;

  const admin = createAdminClient();

  // Dedup mod hele køen, så gentagne kald ikke laver dubletter.
  const { data: existing, error: readErr } = await admin.from("ideas").select("title");
  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });

  const { rows, skipped } = buildIdeaRows(ideas, (existing || []).map((e) => e.title), {
    source,
    basePriority: 50,
  });

  if (!rows.length) {
    return NextResponse.json({ ok: true, inserted: 0, skipped, rows: [] });
  }

  // Upsert på id (=case_id) → idempotent, og samme nøgle som SYNC bruger, så
  // n8n-spejlingen senere merger ind i samme række frem for at lave en dublet.
  const { data: inserted, error: insErr } = await admin
    .from("ideas")
    .upsert(rows, { onConflict: "id" })
    .select("id,case_id,title,hook,source,status,priority");
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  // Push videre til n8n's produktions-kø (hvis intake-webhook er konfigureret).
  const n8n = await pushToN8n(rows);

  return NextResponse.json({
    ok: true,
    inserted: (inserted || []).length,
    skipped,
    n8n,
    rows: (inserted || []).map(shape),
  });
}
