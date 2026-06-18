import { createClient } from "@supabase/supabase-js";

// Service-role klient — bypasser RLS. KUN server-side (cron / pipeline-writes).
// Må ALDRIG importeres i klient-kode eller eksponeres via NEXT_PUBLIC_.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY mangler");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
