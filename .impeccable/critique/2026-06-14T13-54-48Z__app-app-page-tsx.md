---
target: /app design
total_score: 23
p0_count: 0
p1_count: 3
p2_count: 2
timestamp: 2026-06-14T13-54-48Z
slug: app-app-page-tsx
---
# Design Critique: `/app` (Create Split)

**Target:** `app/app/page.tsx` + `MobileShell`, `AppOrnaments`, `AppHeader`
**Date:** June 14, 2026

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | OCR/loading states exist; no step progress; wallet blocker unclear until submit area |
| 2 | Match System / Real World | 2 | "USDC on Sepolia" and demo env copy leak crypto infra into core flow |
| 3 | User Control and Freedom | 3 | Back to camera, manual fallback, sticky escape paths work |
| 4 | Consistency and Standards | 3 | Brutalist vocabulary matches landing; ornaments add new decorative layer |
| 5 | Error Prevention | 2 | Get link disabled without wallet/name but doesn't say which is missing |
| 6 | Recognition Rather Than Recall | 2 | Item assignment uses `F0`/`F1` chips; assign toggle labels opaque |
| 7 | Flexibility and Efficiency | 2 | Camera-first is fast; wallet wall and no keyboard shortcuts limit power users |
| 8 | Aesthetic and Minimalist Design | 2 | Ornaments + nested brutal cards compete with the single task |
| 9 | Error Recovery | 3 | Plain-language errors; OCR failure falls back to manual entry |
| 10 | Help and Documentation | 2 | No inline help for wallet requirement or item assignment |
| **Total** | | **23/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment:** Not generic AI SaaS slop — the brutalist offset-shadow system is a deliberate brand choice and reads as Chip, not template UI. However, the recent fullscreen ornaments (`Split fast` tag, `$` coin, staggered pop-in blocks) push toward decorative landing-page energy on a task surface. That mismatch is the main "designed but wrong context" tell.

**Deterministic scan:** `detect.mjs` on `app/app/page.tsx`, `MobileShell.tsx`, `AppOrnaments.tsx`, `AppHeader.tsx` — **0 findings** (clean).

**Browser visualization:** Not run — no live browser overlay available in this session.

## Overall Impression

The camera-first entry is right for the product. The flow loses users when crypto vocabulary appears in the hero, when wallet connection is buried mid-form, and when decorative ornaments fight the receipt/split task for attention. Biggest win: make settlement invisible and move wallet connect to the moment it's actually needed — or earlier with clear copy.

## What's Working

1. **Camera-first CTA** — Large snap button with icon, scanning state, and manual fallback matches "snap → split in under 60 seconds."
2. **Sticky bottom primary action** — "Get link" in thumb zone on mobile; good for Casey-at-dinner.
3. **Review before share** — Equal-split preview with per-person amounts builds trust before link generation.

## Priority Issues

**[P1] Crypto jargon in the core create flow**
- **Why:** PRODUCT.md principle #2 — "Invisible rails." Subtitle says "get paid in USDC on Sepolia." Demo banner references `CHIP_DEMO_PAYMENTS=false`. A Fronter at dinner shouldn't think about testnets.
- **Fix:** Hero copy: "Snap, split, share a link." Move chain details to settings/footer/dev-only. Demo banner → neutral info style, not `app-error`.
- **Suggested command:** `/impeccable clarify`

**[P1] Wallet gate appears late**
- **Why:** User can snap receipt, fill name/total/people, then discover wallet is required in a card below the fold. Violates speed promise and peak-end rule.
- **Fix:** Connect wallet on entry (header CTA with one line: "Where payments land") OR defer until "Get link" with inline connect modal — but surface the requirement before OCR investment.
- **Suggested command:** `/impeccable shape` then `/impeccable onboard`

**[P1] Item assignment UX is cryptic and undersized**
- **Why:** `F0`/`F1`/`F2` chips require decoding; touch targets are ~24px tall (below 44px). At 6+ people this becomes a wall of options.
- **Fix:** Label chips "You", "Sam", "Jordan" or person number; increase tap size; cap visible assignees or use a picker.
- **Suggested command:** `/impeccable adapt`

**[P2] Ornaments add extraneous cognitive load on a task screen**
- **Why:** Six animated decorative elements on every app route. Product register: motion should convey state, not decorate.
- **Fix:** Remove or reduce to one subtle brand marker; keep motion state-only on task surfaces.
- **Suggested command:** `/impeccable quieter`

**[P2] No step visibility across modes**
- **Why:** camera → manual/review → submit is three mental modes with no progress indicator.
- **Fix:** Simple 3-step indicator: Snap → Details → Share.
- **Suggested command:** `/impeccable layout`

## Persona Red Flags

**Maya (The Fronter, at dinner):** Reads "USDC on Sepolia" and hesitates. Fills the form after snapping, scrolls to hit Get link, finds wallet card she didn't expect.

**Jordan (Confused first-timer):** Doesn't know what "Connect wallet" means. `F1`/`F2` on item assignment — no idea who that is.

**Casey (Distracted mobile, one thumb):** Item assignment chips too small to tap accurately. Ornaments add visual jitter behind form fields.

**Sam (Accessibility):** Item assignment micro-buttons likely fail 44×44pt. Demo banner uses error styling for non-error info.

## Minor Observations

- `Assign items` toggle "On" / "Equal split" is ambiguous.
- Header packs Chip + Connect wallet + Home — crowded on narrow screens.
- Display font on buttons adds noise per product register.
- Disabled Get link button with no explanation why.

## Questions to Consider

- What if wallet connect were the first screen, framed as "where your friends send money"?
- Does item assignment need to ship on `/app` v1?
- What would a confident minimal version look like — camera, three fields, one button, zero ornaments?
