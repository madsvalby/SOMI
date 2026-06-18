import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fase 3-stub: kaldes dagligt af Vercel Cron (06:00 UTC, se vercel.json).
// TODO: hent YouTube Analytics (views, watch time, subs, RPM) → tabel stats_daily.
export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, note: "youtube analytics cron stub — wire up i Fase 3" });
}
