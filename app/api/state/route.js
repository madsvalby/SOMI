import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = new URL(request.url).searchParams.get("key");
  if (key) {
    const { data } = await supabase
      .from("dashboard_state")
      .select("value")
      .eq("user_id", user.id)
      .eq("key", key)
      .maybeSingle();
    return NextResponse.json({ key, value: data ? data.value : null });
  }

  const { data } = await supabase
    .from("dashboard_state")
    .select("key,value")
    .eq("user_id", user.id);
  const map = {};
  (data || []).forEach((r) => {
    map[r.key] = r.value;
  });
  return NextResponse.json(map);
}

export async function POST(request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { key, value } = body || {};
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });

  const { error } = await supabase.from("dashboard_state").upsert(
    { user_id: user.id, key, value, updated_at: new Date().toISOString() },
    { onConflict: "user_id,key" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
