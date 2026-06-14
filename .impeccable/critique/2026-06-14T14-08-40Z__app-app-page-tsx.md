---
target: /app design layout — camera vs photo upload
total_score: 27
p0_count: 0
p1_count: 2
p2_count: 2
timestamp: 2026-06-14T14-08-40Z
slug: app-app-page-tsx
---
# Design Critique: `/app` (Create Split)

**Target:** `app/app/page.tsx` + `MobileShell`, `AppHeader`, `WalletSetup`, `AppStepIndicator`
**Date:** June 14, 2026
**Focus:** Layout + camera experience (live viewfinder vs photo upload)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Step indicator + scanning state; no camera-permission or capture feedback |
| 2 | Match System / Real World | 2 | "Snap" UI promises a camera; delivers hidden file input / picker |
| 3 | User Control and Freedom | 3 | Manual fallback, back to camera, wallet disconnect, sticky CTA |
| 4 | Consistency and Standards | 3 | Brutalist vocabulary holds; display font on task headings is slightly off-register |
| 5 | Error Prevention | 3 | Wallet-first gate + submit hints reduce late surprises |
| 6 | Recognition Rather Than Recall | 2 | Camera icon/label misleads; person chips now readable ("You", "Friend 1") |
| 7 | Flexibility and Efficiency | 2 | Wallet wall before snap slows repeat users; no gallery vs camera choice |
| 8 | Aesthetic and Minimalist Design | 3 | Ornaments trimmed to stripe; layout still form-centric not camera-centric |
| 9 | Error Recovery | 3 | OCR failure → manual entry; plain-language errors |
| 10 | Help and Documentation | 2 | No guidance when camera denied or desktop has no rear camera |
| **Total** | | **27/40** | **Acceptable — improved foundation, camera gap remains** |

## Anti-Patterns Verdict

**LLM assessment:** Not generic AI slop. The brutalist offset-shadow system reads as intentional Chip identity, not template UI. The main tell now is **affordance dishonesty**: a large camera icon and "Tap to snap receipt" copy, but the implementation is a disguised `<input type="file">`. On desktop that's a file picker; on mobile `capture="environment"` may open the OS camera, but the user never sees an in-app viewfinder. That breaks the Snapchat-style promise in PRODUCT.md §4.1 ("camera opens immediately").

**Deterministic scan:** `detect.mjs` on `app/app/page.tsx`, `MobileShell.tsx`, `AppHeader.tsx`, `WalletSetup.tsx`, `AppStepIndicator.tsx` — **0 findings** (clean).

**Browser visualization:** Not run — no browser automation available in this session. No live overlay.

## Overall Impression

The last pass fixed real problems: wallet-first onboarding, step progress, plain copy, larger assignment chips, quieter ornaments. Score moves from 23 → 27. The single biggest gap now is **the core interaction**: Chip says "snap" but behaves like "upload." For a dinner-table Fronter, that mismatch is felt immediately — especially on desktop or when the OS opens a gallery instead of the camera. The layout is still a form page with a camera-shaped button, not a camera page with a shutter.

## What's Working

1. **Wallet-first gate** — "Where friends send money" before OCR investment removes the mid-form wallet surprise from the prior critique.
2. **Step indicator** — Receive → Snap → Details → Share gives location in the flow; post-connect steps collapse cleanly.
3. **Quieter shell** — Top stripe only; task surface no longer fights decorative ornaments.

## Priority Issues

**[P1] No live camera — upload disguised as snap**
- **Why:** PRODUCT.md: "camera opens immediately (camera-first, like Snapchat)." Current code uses a button → hidden file input with `capture="environment"`. No `getUserMedia`, no `<video>` preview, no shutter control. Desktop always shows a file picker; mobile behavior is OS-dependent and invisible to the user.
- **Fix:** Replace the static card with a full-height camera viewfinder (`navigator.mediaDevices.getUserMedia`), bottom thumb-zone shutter, optional flash/grid overlay, and a secondary "Choose from photos" action. Fall back to file input only when camera API unavailable or permission denied.
- **Suggested command:** `/impeccable craft camera viewfinder`

**[P1] Layout is form-first, not camera-first**
- **Why:** Even on the Snap step, the hierarchy is heading → subtitle → centered card → manual link. The camera affordance occupies ~40% of a scrollable column inside `max-width: 40rem`, not the viewport. A Fronter holding a receipt one-handed expects the lens to dominate the screen.
- **Fix:** On `mode === "camera"`, switch to a camera layout: edge-to-edge viewfinder, minimal chrome (step dots only), shutter fixed at bottom safe-area, "Enter manually" as a text escape below shutter. Defer hero copy or collapse to one line over the preview.
- **Suggested command:** `/impeccable layout` then `/impeccable adapt`

**[P2] Wallet-before-camera conflicts with product spec**
- **Why:** PRODUCT.md says camera opens on entry; current flow blocks on wallet connect. The tradeoff (avoid wasted OCR before wallet) is valid, but it adds a step before the hero action and duplicates wallet UI (full-page setup + header button).
- **Fix:** Either (a) allow snap before wallet, hold link generation until connected, or (b) keep wallet-first but auto-advance to camera immediately after connect with no intermediate hero screen.
- **Suggested command:** `/impeccable shape` then `/impeccable onboard`

**[P2] Duplicate wallet entry points**
- **Why:** After `WalletSetup`, the header still shows `WalletButton` + "Home" on the snap screen. Connected users see a truncated address chip competing with the task.
- **Fix:** On create flow post-connect, hide header wallet CTA or move to overflow menu; keep disconnect only in settings/profile pattern.
- **Suggested command:** `/impeccable distill`

**[P3] Scanning state lacks visual feedback**
- **Why:** Button text changes to "Reading receipt…" but there's no captured-image preview or progress indicator. User can't confirm the right photo was taken.
- **Fix:** After capture, show thumbnail + "Reading…" overlay before transitioning to Details.
- **Suggested command:** `/impeccable animate`

## Persona Red Flags

**Maya (The Fronter, at dinner):** Connects wallet, taps the big camera button, and on her laptop gets a file finder — not a camera. Trust in "snap" drops. On phone she may get the OS camera but leaves Chip entirely, breaking the in-app flow.

**Casey (Distracted mobile user):** Shutter isn't in the thumb zone; it's a tall card in the scroll middle. Interrupts mid-flow and returns to a form, not a camera — no visual cue she's still in "snap" mode.

**Jordan (Confused first-timer):** Camera icon sets expectation of live preview. Tapping and seeing a system dialog (or nothing on denied permission) with no explanation → abandons.

## Minor Observations

- `← Back to camera` copy is right, but returns to the upload card, not a camera.
- Step labels hide "Receive" after connect — good — but four-dot density may crowd on 320px widths.
- Display font (`Bricolage`) on h1/h3 in a task flow is borderline per product register; body font would be quieter.
- Practice-mode notice is well-styled now; consider dismiss after first view.

## Questions to Consider

- What if the snap step were literally 90% viewport with zero hero text until after capture?
- Should wallet connect happen *after* the photo is taken but *before* link share — splitting "snap fast" from "receive money"?
- What would Snapchat-for-receipts look like with only one button visible: a shutter?
