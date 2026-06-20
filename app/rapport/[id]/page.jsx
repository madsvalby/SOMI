import { createAdminClient } from "@/lib/supabase/admin";
import ReportView from "./ReportView";

export const dynamic = "force-dynamic";

// Offentlig (UUID = nøgle) branded rapport-side — linket sendes i den ugentlige mail.
export default async function ReportPage({ params }) {
  const admin = createAdminClient();
  const { data: report } = await admin
    .from("reports")
    .select("id,title,body_md,created_at,kind")
    .eq("id", params.id)
    .maybeSingle();

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#555", background: "#F6F4EE" }}>
        Rapport ikke fundet.
      </div>
    );
  }

  const { data: series } = await admin
    .from("channel_daily")
    .select("date,subs,views,cost_usd")
    .order("date", { ascending: true });

  return <ReportView report={report} series={series || []} />;
}
