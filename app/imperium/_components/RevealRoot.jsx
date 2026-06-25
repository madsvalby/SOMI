"use client";
import { useEffect } from "react";

// Observerer ALLE .pe-reveal-elementer på siden og tilføjer .in når de scrolles ind.
// Placeres én gang i imperium-layoutet → siderne kan forblive server-komponenter
// og bare tilføje className="pe-reveal" (+ valgfri style={{'--i':n}} for stagger).
export default function RevealRoot() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".pe-reveal"));
    if (!els.length) return;
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
