# Chip — Product Specification

> Snap a bill. Split it. Get paid in stablecoins.

**Version:** 0.1 (Draft)
**Date:** June 12, 2026
**Status:** Pre-development

## Register

brand

## Users

- **The Fronter** — pays the whole bill, organizes the group, chases settlement. Context: at dinner, traveling, or any group outing where they fronted payment.
- **The Friend** — owes a share, wants to pay and move on. Context: taps a link from WhatsApp/Telegram/iMessage; may have no wallet and no crypto knowledge.
- **Crypto-curious groups** — travelers, remote teams, international friend groups who need a borderless payment rail.

Primary market: 18–35 urban users in groups that eat out or travel together (Southeast Asia, LATAM first).

## Product Purpose

Let anyone split a bill in under 60 seconds: snap or enter the total, share a link, friends pay their share with one tap. Success is invisible stablecoin settlement — money moves instantly, nobody talks about gas or seed phrases, and the Fronter sees who has paid in real time.

## Brand Personality

Playful, instant, effortless. Venmo-like social energy without region lock or signup friction. Paying a friend should feel like tapping a link, not opening a wallet. Delight in speed and clarity, not crypto novelty.

## Anti-references

- Generic AI/SaaS landing pages and template UI (gradient heroes, eyebrow kickers on every section, card grids for everything, "modern" stock illustrations)
- Crypto wallet and DeFi dashboards (seed phrases, gas fees, network picker jargon in the core flow)
- Splitwise-style debt ledgers and long-running expense tracking

## Design Principles

1. **Speed over scope** — one feature done perfectly; snap → link → paid in under 60 seconds.
2. **Invisible rails** — stablecoins power settlement; users never need crypto vocabulary in the core flow.
3. **Share-native** — payment links work in chat apps without installing Chip.
4. **Status, not spreadsheets** — show who paid and who is pending; no group ledger accounting.
5. **Practice what you preach** — if Chip asks users to move fast, the UI must too (no friction walls before the first split).

## Accessibility & Inclusion

WCAG 2.1 AA target for the mobile web MVP. Respect `prefers-reduced-motion`. Ensure pay and share flows are keyboard- and screen-reader accessible with sufficient color contrast on primary actions and status labels.

---

## 1. Overview

### 1.1 One-liner

Chip is a mobile-first web experience that lets anyone split a bill by snapping a photo and sharing a payment link. Friends pay their share in stablecoins with one tap — no wallet knowledge, no gas talk, no spreadsheets.

**MVP:** The app ships as a **mobile-layout website** (responsive web, not native app store builds) for the best UX on phones. Payments run on **Ethereum Sepolia testnet only**.

### 1.2 The problem

Splitting bills is universally annoying:

- Someone fronts the whole bill and chases friends for days.
- Manual math ("you had the steak, I had the salad") kills the vibe.
- Existing apps (Splitwise, Venmo) only *track* debt or are region-locked; cross-border groups have no good option.
- Crypto payments are instant and borderless, but the UX is hostile to normal people.

### 1.3 The solution

One feature, done perfectly:

1. **Snap** a photo of the receipt — OCR + AI extracts items and total.
2. **Split** — equal split by default, or tap items to assign per person.
3. **Share** — generates a payment link that works in WhatsApp/Telegram/iMessage.
4. **Settle** — friends tap the link and pay their share in USDC. Payer sees who has paid in real time.

The recipient never needs to know it's crypto. It just feels like a link that moves money.

---

## 2. Goals and non-goals

### 2.1 Goals (v1)

- Bill split and settlement in under 60 seconds end to end.
- Zero crypto vocabulary in the core flow (no "gas", "seed phrase", "network").
- Payment links that work for recipients **without** the app installed.
- Real-time payment tracking: who paid, who hasn't.

### 2.2 Non-goals (v1)

- Expense tracking / group ledgers (Splitwise territory).
- Multi-currency or token swaps.
- Fiat on-ramp / off-ramp (link out to partners instead).
- NFTs, tokens, DeFi yield — anything beyond the single split-and-settle feature.
- Recurring payments or subscriptions.

### 2.3 MVP scope

| Constraint | MVP choice | Rationale |
|---|---|---|
| Platform | Mobile-layout website | One codebase, instant access via link, no app install; phone-sized layout gives a native-app feel |
| Network | Ethereum Sepolia testnet only | Safe iteration with test USDC before mainnet |
| Chains | Sepolia only | No multi-chain support in MVP |

---

## 3. Target users

| Persona | Description | Pain today |
|---|---|---|
| **The Fronter** | Pays the whole bill, organizes the group | Chasing people for days, awkward reminders |
| **The Friend** | Owes a share, wants to pay and move on | Bank transfers are slow, apps require signup |
| **Crypto-curious groups** | Travelers, remote teams, international friend groups | No shared payment rail across countries |

Primary market: 18–35 urban users in groups that eat out / travel together, starting with regions where stablecoin adoption is already high (Southeast Asia, LATAM).

---

## 4. Core user flows

### 4.1 Create a split (the Fronter)

1. Open Chip in the mobile web app → camera opens immediately (camera-first, like Snapchat).
2. Snap the receipt → OCR extracts line items, tax, tip, total.
3. Review screen: total is shown, equal split across N people by default.
   - Optional: tap "Assign items" to drag items onto people.
   - Optional: adjust tip percentage.
4. Tap **Get link** → Chip generates a unique payment link + QR code.
5. Share via the native share sheet (WhatsApp, Telegram, iMessage, copy link).

**Fallback:** manual entry (amount + number of people) if there's no receipt or OCR fails.

### 4.2 Pay a share (the Friend)

1. Tap the link → opens a mobile web page (no app install required).
2. Page shows: who's asking, the bill, their share (e.g. "$12.50 of $50.00").
3. Tap **Pay** →
   - Has a wallet (Phantom, MetaMask, etc.): deep-link, approve, done.
   - No wallet: embedded wallet created from email/passkey in one step, funded via card or Apple Pay through an on-ramp partner.
4. Confirmation screen: "You're settled with Alex ✓".

### 4.3 Track payments (the Fronter)

1. Split detail screen shows each person's status: **Paid / Pending**.
2. Push notification on each incoming payment.
3. One-tap "Nudge" sends a polite reminder to unpaid friends.
4. Funds land directly in the Fronter's balance — withdrawable to any wallet address.

---

## 5. Feature requirements

### 5.1 Must have (v1)

| # | Feature | Notes |
|---|---|---|
| F1 | Receipt OCR | Photo → line items, tax, tip, total. Target ≥90% accuracy on printed receipts |
| F2 | Equal split | Total ÷ N, rounding handled (payer absorbs remainder) |
| F3 | Item assignment | Tap/drag items to people; shared items split among selected |
| F4 | Payment link generation | Short URL + QR code, expires after 7 days |
| F5 | Web pay page | Recipient pays without installing the app |
| F6 | Embedded wallet | Email/passkey signup, no seed phrase shown |
| F7 | USDC settlement | USDC on Ethereum Sepolia testnet only (MVP) |
| F8 | Payment tracking | Real-time paid/pending status, push notifications |
| F9 | Nudge | One-tap reminder, rate-limited to 1 per person per day |
| F10 | Withdraw | Send balance to any external wallet address |

### 5.2 Nice to have (v1.x)

- Fiat display toggle (show local currency alongside USDC).
- Split history list.
- Group presets ("Dinner crew") for repeat splits.
- Tip suggestions based on locale.

### 5.3 Explicitly out of scope

See non-goals (§2.2). Resist scope creep — Chip wins by doing one thing.

---

## 6. Technical architecture (proposed)

### 6.1 Stack (MVP)

| Layer | Choice | Rationale |
|---|---|---|
| App | Next.js, mobile-layout website | Responsive phone-first UI; shareable links, no app store |
| Web pay page | Same Next.js app | One surface for create + pay flows |
| Backend | Node.js (Fastify) + PostgreSQL | Simple, boring, reliable |
| OCR | Vision LLM API (e.g. GPT-4o / Gemini) | Receipt parsing accuracy beats classic OCR |
| Chain | Ethereum Sepolia testnet | MVP testnet only; test USDC before mainnet |
| Embedded wallets | Privy or Dynamic | Email/passkey wallets, no seed phrase UX |
| Payments | USDC (ERC-20) on Sepolia | Direct wallet transfers with per-split payment references |
| On-ramp | Out of scope for MVP | Testnet faucet / test USDC for beta |
| Notifications | Web push + webhook listener on chain events | Real-time paid status |

### 6.2 Payment model

- Each split generates a **payment reference** (memo / metadata) per participant.
- Payments go **directly** to the Fronter's wallet address on Sepolia — Chip is non-custodial and never holds funds.
- A backend indexer watches Sepolia for USDC transfers matching the reference keys to update paid status.
- Link metadata (amounts, names, receipt data) lives in Postgres; money never touches the server.

### 6.3 Key risks

| Risk | Mitigation |
|---|---|
| OCR misreads receipts | Always show editable review screen before link creation |
| Friend has no crypto | Embedded wallet + Sepolia test USDC faucet for MVP beta |
| On-ramp fees discourage small payments | Deferred post-MVP; testnet has no real fees |
| Regulatory (money transmission) | Non-custodial design; testnet-only MVP reduces exposure |
| Sepolia network issues | Queue + retry UX; clear testnet-only messaging |

---

## 7. Business model

- **Free** for equal splits and payments (growth driver).
- **Take rate:** 1% capped at $1 per payment, charged to the payer side, only on splits above $20 (tunable).
- Future: premium group features, FX spread on local-currency display.

No fees on the receiving side ever — the Fronter is the growth engine.

---

## 8. Success metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Time from snap → link shared | < 30 seconds median |
| Link → payment conversion | > 60% |
| Splits fully settled within 24h | > 70% |
| Walletless friend completes payment | > 40% conversion |
| Weekly active splitters | 1,000 |
| Viral coefficient (friends who later create their own split) | > 0.3 |

---

## 9. Milestones

| Phase | Scope | Duration |
|---|---|---|
| **M0 — Prototype** | Mobile-layout web app, manual entry, equal split, link, Sepolia testnet USDC payment | 2 weeks |
| **M1 — Private beta** | Receipt OCR, item assignment, embedded wallets, Sepolia polish | 4 weeks |
| **M2 — Public launch** | On-ramp integration, nudges, mainnet chain selection, optional native apps | 4 weeks |
| **M3 — Growth** | Fiat display, history, group presets | ongoing |

---

## 10. Open questions

1. Post-MVP mainnet chain: Solana vs Base vs Ethereum L2 — MVP is Sepolia testnet only; mainnet decision before M2.
2. Should the Fronter be able to receive into a bank account (off-ramp) at launch, or is wallet withdrawal enough?
3. Tip handling across locales (US tipping vs service-charge countries).
4. Brand domain: `chipin.app`, `getchip.app`, or `paychip.app` — check availability.
