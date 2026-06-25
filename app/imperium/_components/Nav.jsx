"use client";
import { useState } from "react";

// Sticky topnav for hver venture-side + hub.
// props: { brand, links:[{href,label}], ctaLabel, ctaHref, icon }
// icon = en React-node (fx en lucide-ikon) der vises som logo-glyf i brand-boksen.
export default function Nav({ brand, links = [], ctaLabel, ctaHref, icon = null }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="pe-nav">
      <div className="pe-container">
        <div className="pe-nav-inner">
          <a href="#top" className="pe-brand" onClick={() => setOpen(false)}>
            <span className="pe-brand-mark" aria-hidden="true">{icon}</span>
            {brand}
          </a>

          <div className="pe-nav-links">
            {links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          {ctaHref && ctaLabel && (
            <a href={ctaHref} className="pe-nav-cta pe-btn pe-btn-primary">
              {ctaLabel}
            </a>
          )}

          <button
            type="button"
            className="pe-burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <div className={"pe-mobile-menu" + (open ? " open" : "")}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        {ctaHref && ctaLabel && (
          <a
            href={ctaHref}
            className="pe-btn pe-btn-primary"
            style={{ marginTop: 12 }}
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </nav>
  );
}
