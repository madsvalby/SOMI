import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Daglig dispatcher — holder Vercel-cron-antallet lavt (Hobby = max 2). Kalder
// de enkelte cron-endpoints internt med CRON_SECRET, så de stadig kan testes
// hver for sig. competitors kører dagligt; ideas kun mandag (ugentlig kadence).
export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { origin } = new URL(request.url);
  const headers = process.env.CRON_SECRET ? { authorization: `Bearer ${process.env.CRON_SECRET}` } : {};
  const run = async (path) => {
    try {
      const r = await fetch(`${origin}${path}`, { headers });
      return { path, status: r.status, body: await r.json().catch(() => null) };
    } catch (e) {
      return { path, error: String((e && e.message) || e) };
    }
  };

  const jobs = [run("/api/cron/competitors"), run("/api/cron/reports")];
  if (new Date().getUTCDay() === 1) jobs.push(run("/api/cron/ideas")); // mandag

  const results = await Promise.all(jobs);
  return NextResponse.json({ ok: true, ran: results });
}
