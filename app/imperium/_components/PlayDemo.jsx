"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Klikbar play-knap → modal med et auto-scrollende EKSEMPEL-Reels-feed (illustrativt, ingen ekstern video).
// Modalen portales til document.body (så ancestor-transforms som pe-float ikke bryder fixed-positionering)
// og renderes kun når open===true (klient, efter mount) → ingen SSR/hydration-mismatch.
// Fordi overlayet portales UDEN for .pe-roden (hvor --accent/--serif/--mono sættes inline), arver det
// ikke sidens CSS-variabler. Derfor skrives de eksplicit på .pdm-overlay (accent som prop). Load-bearing.
// props: { className, style, label, accent } — className/style styrer trigger-knappens placering i en mockup.
export default function PlayDemo({ className = "", style, label = "Example reels", accent = "#1F9E8F" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const feedRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Fokus-styring + Escape + scroll-lock + focus-trap.
  useEffect(() => {
    if (!open) return;
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
      if (restoreTo) restoreTo.focus();
    };
  }, [open]);

  // Auto-scroll gennem reels-feedet (løkker). Respekterer reduced-motion; manuel scroll virker stadig.
  useEffect(() => {
    if (!open) return;
    const feed = feedRef.current;
    if (!feed) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      const reels = feed.querySelectorAll(".pdm-reel");
      if (reels.length < 2) return;
      const h = feed.clientHeight || 1;
      const cur = Math.round(feed.scrollTop / h);
      const next = (cur + 1) % reels.length;
      feed.scrollTo({ top: next * h, behavior: "smooth" });
    }, 3400);
    return () => clearInterval(id);
  }, [open]);

  const reels = [
    { tag: "OCEANFRONT · 3 BED", price: "$740,000", likes: "1.2k", comments: "86", grad: "linear-gradient(165deg,#2f5560 0%,#13242b 55%,#0a1418 100%)" },
    { tag: "DOWNTOWN LOFT · 2 BED", price: "$520,000", likes: "940", comments: "61", grad: "linear-gradient(165deg,#3a4458 0%,#171d29 55%,#0c0f16 100%)" },
    { tag: "GARDEN VILLA · 4 BED", price: "$1.2M", likes: "2.4k", comments: "133", grad: "linear-gradient(165deg,#3f4a36 0%,#1a2014 55%,#0d1109 100%)" },
  ];

  const Heart = () => (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 20.5C6.5 16.7 3 13.4 3 9.6 3 7 5 5.2 7.3 5.2c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2C20 5.2 21 7 21 9.6c0 3.8-3.5 7.1-9 10.9z" fill="currentColor"/></svg>);
  const Chat = () => (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>);
  const Share = () => (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M22 3 11 14M22 3l-7 18-4-7-7-4 18-7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>);

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
            aria-label="Example reels preview"
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
                <div className="pdm-feed" ref={feedRef} aria-hidden="true">
                  {reels.map((r, i) => (
                    <div className="pdm-reel" key={i} style={{ background: r.grad }}>
                      <div className="pdm-reel-light" />
                      <div className="pdm-topbar"><span>Reels</span><span className="pdm-live">● {i + 1}/{reels.length}</span></div>

                      <div className="pdm-rail">
                        <span className="pdm-act"><Heart /><b>{r.likes}</b></span>
                        <span className="pdm-act"><Chat /><b>{r.comments}</b></span>
                        <span className="pdm-act"><Share /><b>Share</b></span>
                      </div>

                      <div className="pdm-meta">
                        <div className="pdm-handle"><span className="pdm-ava" />@jreyes.realty</div>
                        <div className="pdm-cap">{r.tag}</div>
                        <div className="pdm-price">{r.price} · Book a viewing →</div>
                        <div className="pdm-audio"><span className="pdm-note-ic">♪</span> Original audio · narrated by ListingReel</div>
                      </div>

                      <div className="pdm-wave">
                        {Array.from({ length: 26 }).map((_, k) => (
                          <i key={k} style={{ animationDelay: (k % 7) * 0.1 + "s" }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="pdm-note">Example reels — illustrative preview, auto-generated by ListingReel from listing photos. Scroll or wait to browse.</p>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
              .pdm-overlay, .pdm-overlay * { box-sizing: border-box; }
              .pdm-overlay { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 24px;
                background: rgba(5,8,12,0.82); backdrop-filter: blur(8px); animation: pdm-fade .25s ease; }
              .pdm-stage { position: relative; display: flex; flex-direction: column; align-items: center; gap: 16px; animation: pdm-rise .3s cubic-bezier(.2,.8,.2,1); }
              .pdm-close { position: absolute; top: -10px; right: -10px; width: 38px; height: 38px; border-radius: 50%;
                border: 1px solid #1E2730; background: #11171F; color: #F2F2EA; font-size: 15px; cursor: pointer; z-index: 5; transition: border-color .15s ease; }
              .pdm-close:hover, .pdm-close:focus-visible { border-color: var(--accent); outline: none; }
              .pdm-phone { height: min(72vh, 560px); aspect-ratio: 9 / 19.5; width: auto; border-radius: 32px; border: 8px solid #05080c;
                background: #05080c; box-shadow: 0 50px 100px -40px rgba(0,0,0,0.95), 0 0 0 1px #1E2730; overflow: hidden; }
              .pdm-feed { position: relative; width: 100%; height: 100%; overflow-y: auto; scroll-snap-type: y mandatory;
                scrollbar-width: none; -ms-overflow-style: none; background: #0b0f14; }
              .pdm-feed::-webkit-scrollbar { display: none; }
              .pdm-reel { position: relative; width: 100%; height: 100%; scroll-snap-align: start; scroll-snap-stop: always; overflow: hidden; }
              .pdm-reel-light { position: absolute; inset: 0; pointer-events: none;
                background-image: radial-gradient(150px 110px at 62% 26%, rgba(255,255,255,0.12), transparent 70%),
                  radial-gradient(120px 90px at 24% 64%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 75%),
                  linear-gradient(0deg, rgba(0,0,0,0.55), transparent 50%);
                animation: pdm-kb 9s ease-in-out infinite alternate; }
              .pdm-topbar { position: absolute; top: 12px; left: 14px; right: 14px; z-index: 3; display: flex; align-items: center; justify-content: space-between;
                font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em; color: rgba(255,255,255,0.92); }
              .pdm-topbar > span:first-child { font-family: var(--serif); font-size: 15px; letter-spacing: 0; }
              .pdm-live { color: var(--accent); font-size: 9.5px; }
              .pdm-rail { position: absolute; right: 10px; bottom: 92px; z-index: 3; display: flex; flex-direction: column; gap: 16px; align-items: center; }
              .pdm-act { display: flex; flex-direction: column; align-items: center; gap: 3px; color: #fff; }
              .pdm-act b { font-family: var(--mono); font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.9); }
              .pdm-meta { position: absolute; left: 14px; right: 56px; bottom: 44px; z-index: 3; display: flex; flex-direction: column; gap: 5px; }
              .pdm-handle { display: flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 11px; color: #fff; font-weight: 600; }
              .pdm-ava { width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), #05080c); border: 1px solid rgba(255,255,255,0.5); }
              .pdm-cap { font-family: var(--serif); font-weight: 600; font-size: 19px; line-height: 1.1; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.6); }
              .pdm-price { font-family: var(--mono); font-size: 11px; color: var(--accent); letter-spacing: 0.02em; }
              .pdm-audio { display: flex; align-items: center; gap: 6px; font-family: var(--mono); font-size: 9.5px; color: rgba(255,255,255,0.78); margin-top: 2px; }
              .pdm-note-ic { color: var(--accent); }
              .pdm-wave { position: absolute; left: 14px; right: 56px; bottom: 16px; z-index: 3; display: flex; align-items: flex-end; gap: 2px; height: 18px; }
              .pdm-wave i { flex: 1; background: var(--accent); border-radius: 1px; height: 30%; animation: pdm-wave .9s ease-in-out infinite; }
              .pdm-note { max-width: 300px; text-align: center; font-size: 12px; line-height: 1.5; color: #9AA6B2; }
              @keyframes pdm-fade { from { opacity: 0 } to { opacity: 1 } }
              @keyframes pdm-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
              @keyframes pdm-wave { 0%,100% { height: 22% } 50% { height: 92% } }
              @keyframes pdm-kb { from { transform: scale(1) translateY(0) } to { transform: scale(1.08) translateY(-2%) } }
              @media (prefers-reduced-motion: reduce) {
                .pdm-reel-light, .pdm-wave i { animation: none }
                .pdm-feed { scroll-snap-type: none }
              }
            `}} />
          </div>,
          document.body
        )}
    </>
  );
}
