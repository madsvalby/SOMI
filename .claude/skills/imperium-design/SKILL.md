---
name: imperium-design
description: >
  Designer's-eye visual audit + gated fixes for the Imperium 6 venture landing
  pages (the pe-* design system in app/imperium). Captures the real rendered
  pages with gstack's headless Chromium, force-revealing scroll-gated content
  first so the audit sees what users see — not blank phantoms. Use when asked to
  "audit the imperium design", "polish the venture pages", "review faceless/
  adforge/etc design", or "improve the landing-page design".
triggers:
  - imperium design audit
  - venture page design review
  - polish the landing pages
  - pe-* design review
---

# /imperium-design — accurate visual audit for the 6 venture pages

You are a senior product designer with an exacting eye for typography, spacing,
hierarchy, and AI-slop. You audit the **live, rendered** Imperium venture pages,
then fix only what is genuinely wrong — calibrated against the project's own
`pe-*` design system. The pages are already strong; do not invent problems.

## The one rule that makes this skill exist

**The venture pages hide everything below the hero behind `.pe-reveal`
(opacity:0 until an IntersectionObserver fires on scroll).** A naive full-page
screenshot of a headless browser captures those sections as **blank black** and
makes you "find" phantom dead-space / imbalance / missing-content issues that do
not exist for a real user who scrolls. **Every capture in this skill MUST
force-reveal first.** Skip this and your audit is garbage.

The project also documents (see `docs` / git history + the imperium memory):
the app's own preview MCP is unreliable on these animated pages. gstack's
`browse` binary (its own headless Chromium) is the reliable path.

## Setup

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
[ -x "$B" ] || { echo "gstack browse missing — run: cd ~/.claude/skills/gstack && ./setup"; }
OUT="${TMPDIR:-/tmp}/imperium-audit"; mkdir -p "$OUT"
```

Pages live at `app/imperium/<slug>/page.jsx`; shared system in
`app/imperium/imperium.css`. The 6 slugs + accents (calibrate against these —
an off-accent or off-system value is a HIGHER-severity finding):

| slug | accent | note |
|---|---|---|
| faceless | `#C9A14E` gold | flagship |
| listingreel | `#1F9E8F` teal | |
| adforge | `#E0794E` ember | POST source = `ugc` (not slug) |
| automation | `#3B6FB0` blue | |
| beacon | `#7C5CCB` violet | POST source = `geo` (not slug) |
| ringback | `#3FA66A` green | |

Target a deployed URL (`https://somi-phi.vercel.app/imperium/<slug>`) or a local
`npm run dev` (http://localhost:3000/imperium/<slug>). Ask which if unset.

## Step 1 — Capture each page correctly (force-reveal)

For every slug under review, and at desktop (1440x900) + mobile (390x844):

```bash
URL="https://somi-phi.vercel.app/imperium/faceless"   # or localhost
"$B" viewport 1440x900
"$B" goto "$URL"; "$B" wait --networkidle
# FORCE-REVEAL: add .in to every reveal element + hard CSS override, kill ambient anim
"$B" js "document.querySelectorAll('.pe-reveal').forEach(e=>e.classList.add('in'));var s=document.createElement('style');s.textContent='.pe-reveal{opacity:1!important;transform:none!important}*{animation-play-state:paused!important}';document.head.appendChild(s);'ok'"
"$B" js "new Promise(r=>setTimeout(r,500))"
"$B" console --errors           # expect none; any error is a finding
"$B" perf                       # watch download/domReady; flag if load > ~2.5s
```

Then capture section-by-section (full-page screenshots of tall pages downscale
too far to judge type): scroll in ~860px steps and clip:

```bash
for Y in 0 860 1720 2580 3440 4300; do
  "$B" js "window.scrollTo(0,$Y)"; "$B" js "new Promise(r=>setTimeout(r,300))"
  "$B" screenshot --clip 0,0,1440,860 "$OUT/${SLUG}_d_$Y.png"
done
```

Repeat at `viewport 390x844` for mobile (use `--clip 0,0,390,844`). Read the
PNGs with the Read tool and judge them.

## Step 2 — Audit against the pe-* system

Score each dimension; cite the file:line + the computed value (`"$B" css <sel>
<prop>`), never a vibe. Calibrate deviations against `imperium.css`.

1. **Typography** — Fraunces serif headlines, Inter body, JetBrains mono eyebrows.
   `--serif/--sans/--mono`. Check `.pe-h1` clamp, line-height 1.03, the `.pe-mark`
   gold underline. Flag: orphan/widow lines, clamp breakpoints that crush at edge
   viewports, off-scale sizes.
2. **Spacing & rhythm** — `.pe-section` 92px, `--tight` 64px; `.pe-hero-copy >*+*`
   clamp stack. Flag genuinely uneven gaps — NOT reveal artifacts (you force-
   revealed, so trust what you see now).
3. **Hierarchy & contrast** — accent used with intent, not everywhere. Quiet
   labels (`--faint #8A95A1`, `--dim #9AA6B2`) must still clear AA (4.5:1 small
   text) on their panel. Compute before claiming a contrast bug.
4. **Color / accent discipline** — every page reuses ONE accent (table above).
   A hardcoded color that isn't the page accent or a `--token` is a finding.
5. **AI-slop check** — generic gradients, centered-everything, emoji bullets,
   meaningless motion, filler copy. The pages avoid this today; keep it that way.
6. **Responsive** — 900px + 540px breakpoints (`imperium.css` media queries).
   Mobile nav collapses to burger (`.pe-nav-cta` hides < 901px; `.pe-burger`
   shows). Check the mockups (`_components/mockups/*`) don't overflow at 390px.
7. **Motion** — reveal timing/stagger (`--i`), `prefers-reduced-motion` honored
   (it is — verify the block at `imperium.css` bottom stays intact after edits).

## Step 3 — Fix, gated (never an unattended commit spree)

- Present findings as a ranked table (severity High/Med/Low, file:line, the fix)
  and STOP for the user to pick. Do not auto-apply.
- Prefer **CSS-only** edits in `imperium.css` (shared = one change fixes all 6).
  A per-page JSX/inline-style change is higher risk — call it out.
- Respect the documented gotchas, or you WILL regress:
  - Spacing reset specificity: `.pe h1/p{margin:0}` (0,1,1) beats class selectors
    (0,1,0). The hero stack uses `.pe .pe-hero-copy >*+*` (0,2,0) to win. Match
    that pattern for any new spacing rule.
  - Mockup `<style>` blocks must stay `dangerouslySetInnerHTML` (raw CSS text
    child → hydration mismatch).
  - OG image routes (`opengraph-image.jsx`) must keep `runtime="edge"`.
  - `Track.jsx` is imported with the explicit `.jsx` extension (case-insensitive
    FS collision with `track.js`).
- After each accepted fix: re-run Step 1 capture for the affected page+viewport,
  read the before/after PNGs, confirm the fix landed and nothing else moved.
- Verify the build before committing: `npm run build` must stay green.
- Commit per logical fix with a clear message. Do not `git add -A`.

## Step 4 — Honesty clause

If the page is already good, **say so and change nothing.** Reporting "audited,
3 real issues, the rest is solid" is a success. Inventing cosmetic churn to look
busy is a failure — and on these reveal-gated pages it usually means you skipped
Step 1's force-reveal and are fixing phantoms.

## Optional: elevate, don't just audit

To push a page from "nice" to "recognizable" (new section, bolder type scale,
a deliberate asymmetry), that is a design *change*, not a fix — propose it
separately with a mockup/variant and get explicit sign-off before building.
gstack's `/design-consultation` (headless) and `/design-shotgun` (variants) are
the right tools for that mode.
