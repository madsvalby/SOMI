"use client";
import { useEffect } from "react";
import { track } from "./track";

// Funnel-tracking pr. venture-side. Logger:
//  - "view": én pageview ved mount
//  - "cta":  klik på enhver .pe-btn / .pe-nav-cta (label = knaptekst) via event-delegation (ingen per-knap-edits)
//  - "lead": når en LeadForm-submission lykkes (LeadForm dispatcher window-event "imperium:lead")
// props: { slug }
export default function Track({ slug }) {
  useEffect(() => {
    if (!slug) return;
    track(slug, "view");

    const onClick = (e) => {
      const btn = e.target.closest && e.target.closest(".pe-btn, .pe-nav-cta");
      if (!btn) return;
      const label = (btn.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
      track(slug, "cta", { label });
    };
    const onLead = () => track(slug, "lead");

    document.addEventListener("click", onClick, true);
    window.addEventListener("imperium:lead", onLead);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("imperium:lead", onLead);
    };
  }, [slug]);

  return null;
}
