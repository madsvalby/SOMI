"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Klikbar play-knap → modal med et auto-afspillende EKSEMPEL-reel (illustrativt, ingen ekstern video).
// Modalen portales til document.body (så ancestor-transforms som pe-float ikke bryder fixed-positionering)
// og renderes kun når open===true (klient, efter mount) → ingen SSR/hydration-mismatch.
// Fordi overlayet portales UDEN for .pe-roden (hvor --accent/--serif/--mono sættes inline), arver det
// ikke sidens CSS-variabler. Derfor skrives de eksplicit på .pdm-overlay (accent som prop). Load-bearing.
// props: { className, style, label, accent } — className/style styrer trigger-knappens placering i en mockup.
export default function PlayDemo({ className = "", style, label = "Example reel", accent = "#1F9E8F" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    // Gem fokus (trigger) og flyt fokus ind i dialogen.
    const restoreTo = triggerRef.current;
    const overlay = overlayRef.current;
    const focusables = () =>
      overlay
        ? Array.from(overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'))
            .filter((el) => !el.disabled && el.offsetParent !== null)
        : [];
    const first = overlay && overlay.querySelector(".pdm-close");
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      // Simpel focus-trap: cyklus mellem fokuserbare elementer i overlayet.
      const items = focusables();
      if (items.length === 0) { e.preventDefault(); return; }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === firstEl || !overlay.contains(active)) { e.preventDefault(); lastEl.focus(); }
      } else {
        if (active === lastEl || !overlay.contains(active)) { e.preventDefault(); firstEl.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      // Før fokus tilbage til trigger ved luk.
      if (restoreTo) restoreTo.focus();
    };
  }, [open]);

  const scenes = [
    { cap: "WELCOME HOME", grad: "linear-gradient(160deg,#3a4a5e,#141c26)" },
    { cap: "OPEN-PLAN LIVING", grad: "linear-gradient(160deg,#4a5340,#161c14)" },
    { cap: "CHEF'S KITCHEN", grad: "linear-gradient(160deg,#5a4438,#1c1410)" },
    { cap: "OCEAN VIEW · 3 BED", grad: "linear-gradient(160deg,#2f5560,#101c20)" },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={"pe-play-trigger " + className}
        style={style}
        aria-label={"Play " + label}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </button>

      {mounted && open &&
        createPortal(
          <div
            ref={overlayRef}
            className="pdm-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Example reel preview"
            style={{
              "--accent": accent,
              "--serif": "'Fraunces', Georgia, serif",
              "--mono": "'JetBrains Mono', ui-monospace, monospace",
            }}
            onClick={() => setOpen(false)}
          >
            <div className="pdm-stage" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="pdm-close" aria-label="Close" onClick={() => setOpen(false)}>✕</button>

              <div className="pdm-phone">
                <div className="pdm-screen">
                  <div className="pdm-progress">
                    {scenes.map((_, i) => (
                      <span key={i}><i style={{ animationDelay: i * 2 + "s" }} /></span>
                    ))}
                  </div>
                  {scenes.map((s, i) => (
                    <div key={i} className="pdm-scene" style={{ background: s.grad, animationDelay: i * 2 + "s" }}>
                      <span className="pdm-cap">{s.cap}</span>
                    </div>
                  ))}
                  <div className="pdm-endcard"><b>$740,000</b><span>Book a viewing →</span></div>
                  <div className="pdm-brand">J. REYES · REALTY</div>
                  <div className="pdm-wave" aria-hidden="true">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <i key={i} style={{ animationDelay: (i % 7) * 0.1 + "s" }} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="pdm-note">Example reel — illustrative preview, auto-generated by ListingReel from listing photos.</p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .pdm-overlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 24px;
                background: rgba(5,8,12,0.82); backdrop-filter: blur(8px); animation: pdm-fade .25s ease; }
              .pdm-stage { position: relative; display: flex; flex-direction: column; align-items: center; gap: 16px; animation: pdm-rise .3s cubic-bezier(.2,.8,.2,1); }
              .pdm-close { position: absolute; top: -10px; right: -10px; width: 38px; height: 38px; border-radius: 50%;
                border: 1px solid var(--line,#1E2730); background: var(--panel,#11171F); color: var(--bone,#F2F2EA);
                font-size: 15px; cursor: pointer; z-index: 2; transition: border-color .15s ease; }
              .pdm-close:hover { border-color: var(--accent,#C9A14E); }
              .pdm-phone { width: 264px; max-width: 78vw; border-radius: 30px; border: 8px solid #05080c; background: #05080c;
                box-shadow: 0 50px 100px -40px rgba(0,0,0,0.95), 0 0 0 1px var(--line,#1E2730); overflow: hidden; }
              .pdm-screen { position: relative; aspect-ratio: 9/19.5; overflow: hidden; background: #0b0f14; }
              .pdm-scene { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0;
                animation: pdm-scene 8s linear infinite; }
              .pdm-cap { font-family: var(--serif,'Fraunces',serif); font-weight: 600; color: #fff; font-size: 26px; line-height: 1.1;
                text-align: center; padding: 0 18px; text-shadow: 0 2px 18px rgba(0,0,0,0.6); letter-spacing: -0.01em; }
              .pdm-progress { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 3; display: flex; gap: 5px; }
              .pdm-progress span { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.25); overflow: hidden; }
              .pdm-progress i { display: block; height: 100%; width: 100%; background: var(--accent,#1F9E8F);
                transform: scaleX(0); transform-origin: left; animation: pdm-bar 8s linear infinite; }
              .pdm-endcard { position: absolute; inset: 0; z-index: 4; display: flex; flex-direction: column; align-items: center;
                justify-content: center; gap: 6px; background: rgba(5,8,12,0.55); opacity: 0; animation: pdm-end 8s linear infinite; }
              .pdm-endcard b { font-family: var(--serif,'Fraunces',serif); font-size: 34px; color: #fff; }
              .pdm-endcard span { font-family: var(--mono,monospace); font-size: 12px; letter-spacing: 0.08em; color: var(--accent,#1F9E8F); }
              .pdm-brand { position: absolute; bottom: 44px; left: 14px; z-index: 3; font-family: var(--mono,monospace);
                font-size: 9.5px; letter-spacing: 0.1em; color: rgba(255,255,255,0.75); }
              .pdm-wave { position: absolute; bottom: 16px; left: 14px; right: 14px; z-index: 3; display: flex; align-items: flex-end;
                gap: 2px; height: 20px; }
              .pdm-wave i { flex: 1; background: var(--accent,#1F9E8F); border-radius: 1px; height: 30%; animation: pdm-wave .9s ease-in-out infinite; }
              .pdm-note { max-width: 280px; text-align: center; font-size: 12px; line-height: 1.5; color: var(--dim,#9AA6B2); }
              @keyframes pdm-fade { from { opacity: 0 } to { opacity: 1 } }
              @keyframes pdm-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
              @keyframes pdm-scene { 0%,2% { opacity: 0 } 4%,22% { opacity: 1 } 25%,100% { opacity: 0 } }
              @keyframes pdm-bar { 0% { transform: scaleX(0) } 25%,100% { transform: scaleX(1) } }
              @keyframes pdm-end { 0%,88% { opacity: 0 } 94%,100% { opacity: 1 } }
              @keyframes pdm-wave { 0%,100% { height: 22% } 50% { height: 95% } }
              @media (prefers-reduced-motion: reduce) {
                .pdm-scene, .pdm-progress i, .pdm-endcard, .pdm-wave i { animation: none }
                .pdm-scene:first-of-type { opacity: 1 }
              }
            `}} />
          </div>,
          document.body
        )}
    </>
  );
}
