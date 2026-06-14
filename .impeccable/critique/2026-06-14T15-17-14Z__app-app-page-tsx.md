---
target: app page start (illustration and blank space)
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-06-14T15-17-14Z
slug: app-app-page-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Start state is clear; demo notice communicates practice mode when active |
| 2 | Match System / Real World | 4 | "Snap a receipt," "Scan bill," "Enter manually" — plain, dinner-table language |
| 3 | User Control and Freedom | 4 | Home back link, two entry paths, no forced modal |
| 4 | Consistency and Standards | 3 | Brutal buttons match the system; illustration diverges from landing step art (color fills, framed badges, larger presence) |
| 5 | Error Prevention | 3 | n/a on idle start; wallet gate happens before this screen |
| 6 | Recognition Rather Than Recall | 4 | Both actions are labeled; no icon-only traps |
| 7 | Flexibility and Efficiency | 3 | Camera vs manual covers the two real paths |
| 8 | Aesthetic and Minimalist Design | 2 | Large vertical void + small decorative receipt reads as unfilled space, not composed layout |
| 9 | Error Recovery | 3 | n/a on start screen |
| 10 | Help and Documentation | 2 | No contextual hint beyond subcopy; acceptable for a 2-choice screen |
| **Total** | | **31/40** | **Good — solid task UI undermined by empty-state composition** |

## Anti-Patterns Verdict

**LLM assessment:** Not generic AI slop — the brutal CTAs, Bricolage headings, and ink shadows are clearly Chip. The failure mode is narrower: the start illustration reads as a **placeholder dropped into leftover flex space** rather than a composed neobrutalist moment. The reference image was hand-sketched and bold; the shipped SVG is geometric, small (~168px max), and monochrome while the landing illustrations use brand color blocks. That mismatch makes the blank area feel *more* empty, not filled.

**Deterministic scan:** Clean — `detect.mjs` returned 0 findings on `app/app/page.tsx` and `AppStartIllustration.tsx`.

**Visual overlays:** Browser injection unavailable in this session; no live overlay. Assessment based on source review and running dev server at `/app`.

## Overall Impression

The start screen nails the job-to-be-done: two obvious paths, strong primary CTA, on-brand brutal styling. The illustration attempt doesn't solve the blank-space problem — it **highlights** it. Content clusters at the top, a small receipt floats at the bottom, and a wide dead band sits between them on tall viewports. The art needs either more presence and personality, or the layout needs to collapse that void intentionally.

## What's Working

1. **Primary action hierarchy** — "Scan bill" as a large `brutal-lg` blue block with icon + label is unmistakable; camera-first matches PRODUCT.md.
2. **Copy discipline** — "Split the bill" + one-line subcopy stays under cognitive load limits; no crypto jargon.
3. **System vocabulary** — 3px ink borders, hard shadows, and display font on headings align with the rest of the app shell.

## Priority Issues

### [P1] The blank space is layout debt, not filled space
- **What:** `min-h-[calc(100dvh-11rem)]` + `flex-1 items-end` pushes the illustration to the bottom, leaving a large inactive middle on tall phones.
- **Why it matters:** Casey sees a broken layout; Jordan wonders if content failed to load. The void fights the "speed over scope" brand promise.
- **Fix:** Either center the illustration in the remaining space with larger scale (`max-width: 14–16rem`), add a second compositional element (subtle stripe/ornament from `AppOrnaments`), or drop the forced min-height and use balanced vertical rhythm (`justify-between` with intentional padding, not magic `11rem`).
- **Suggested command:** `/impeccable layout`

### [P1] Illustration is too small and timid for its job
- **What:** `max-width: 10.5rem` receipt in a zone that can be 250–400px tall.
- **Why it matters:** The user asked to *fill* blank space; at current size it reads as a footer doodle, not a hero empty-state anchor.
- **Fix:** Scale up 1.4–1.8×, allow slight overflow into the flex gap, or pair with a short empty-state line ("Ready when you are") above the art.
- **Suggested command:** `/impeccable bolder`

### [P2] Style gap vs reference and landing art
- **What:** Reference = hand-drawn, wobbly, bold outline with heavy offset shadow. Shipped = perfect zigzag polygon, incomplete `$` glyph, flat duplicate-path shadow, no brand accent fills.
- **Why it matters:** Misses the playful neobrutalist personality Chip claims; feels programmatic next to `StepIllustrations.tsx` which uses `--surface-blue`, `--accent`, `--primary`.
- **Fix:** Wobble paths slightly, thicken strokes, add one accent fill (e.g. `--surface-blue` receipt body or `--accent` dollar), match landing illustration energy.
- **Suggested command:** `/impeccable delight`

### [P2] Redundant metaphor with no narrative payoff
- **What:** Primary CTA already shows a camera icon; bottom illustration repeats "receipt/bill" without teaching a step (unlike landing badges 1–4).
- **Why it matters:** Extraneous load in a product UI that should disappear into the task.
- **Fix:** Either illustrate the *outcome* (link + friends paying) or integrate art into the Scan button zone; don't duplicate receipt + camera on one screen.
- **Suggested command:** `/impeccable distill`

### [P3] WalletSetup screen has no matching empty-state treatment
- **What:** Pre-wallet `/app` shows centered copy + connect button with its own large blank area; no illustration.
- **Why it matters:** Inconsistent first-run experience depending on wallet state.
- **Fix:** Reuse or adapt start illustration on WalletSetup, or keep start-only but document the intentional split.
- **Suggested command:** `/impeccable onboard`

## Persona Red Flags

**Jordan (First-Timer):** The gap between "Enter manually" and the tiny receipt looks like missing content. No text explains what the illustration means — decorative only.

**Casey (Mobile, one-handed):** On iPhone Pro Max–class heights, CTAs sit high while art anchors the bottom; thumb zone is fine for actions, but the middle third feels like wasted scroll estate. Magic `11rem` offset may break when demo notice appears.

**Alex (Fronter / Power User):** Ignores the illustration entirely — fine. But "Enter manually" as ghost secondary is easy to miss if they're in a dark restaurant; hierarchy is still acceptable.

## Minor Observations

- `$` path in `AppStartIllustration.tsx` is an open curve — may render as a broken symbol at some sizes.
- Shadow uses a filled duplicate path (`translate(7 9)`) instead of the project's `box-shadow` token — slightly different visual weight than buttons/cards.
- `aria-hidden` is correct for decorative art, but the blank region still exists for screen-reader users with no compensating copy.
- `vector-effect: non-scaling-stroke` may thin strokes when SVG scales up — test if you enlarge.

## Questions to Consider

- What if the illustration lived *inside* the Scan CTA background instead of competing in dead space below?
- Does this screen need art at all, or would a drenched `--surface-blue` lower panel feel more Chip and less filler?
- What would "filled" look like at 390×844 vs 430×932 — have you tested both?
