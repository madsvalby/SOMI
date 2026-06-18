"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0f", padding: 20 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 360, background: "#141416", border: "1px solid #26262b", borderRadius: 14, padding: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.26em", color: "#C9A14E", textTransform: "uppercase", marginBottom: 8 }}>SOMI Command</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontWeight: 600, color: "#e9e3d6", margin: "0 0 4px" }}>Log ind</h1>
        <p style={{ fontSize: 13, color: "#9a948a", margin: "0 0 20px" }}>Kun adgang for dig.</p>
        <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#9a948a", textTransform: "uppercase" }}>E-mail</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
          style={{ width: "100%", margin: "6px 0 14px", padding: "11px 12px", background: "#0d0d0f", border: "1px solid #26262b", borderRadius: 8, color: "#e9e3d6", fontSize: 14 }} />
        <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#9a948a", textTransform: "uppercase" }}>Adgangskode</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
          style={{ width: "100%", margin: "6px 0 18px", padding: "11px 12px", background: "#0d0d0f", border: "1px solid #26262b", borderRadius: 8, color: "#e9e3d6", fontSize: 14 }} />
        {error && <div style={{ color: "#c8714f", fontSize: 12.5, marginBottom: 14 }}>{error}</div>}
        <button type="submit" disabled={busy}
          style={{ width: "100%", padding: "11px 14px", background: "#C9A14E", color: "#1a1206", border: "none", borderRadius: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.05em", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
          {busy ? "LOGGER IND…" : "LOG IND"}
        </button>
      </form>
    </div>
  );
}
