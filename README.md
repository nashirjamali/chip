# Chip

Snap a bill, split it, share a link — friends pay their share in USDC. Mobile-first Next.js app with receipt OCR, per-person payment links, and real-time tracking.

## Features

- Receipt photo OCR or manual bill entry
- Equal split or per-item assignment
- Custom friend names
- Share links via WhatsApp, Telegram, or QR (per friend)
- Sepolia USDC payments with wallet connect
- Live paid/pending tracking for the organizer

## Screenshots

Add images to [`docs/screenshots/`](./docs/screenshots/).

| Create split | Receipt scan |
| --- | --- |
| ![Create split](./docs/screenshots/create-split.png) | ![Receipt scan](./docs/screenshots/receipt-scan.png) |

| Review & share | Track payments |
| --- | --- |
| ![Review and share](./docs/screenshots/review-share.png) | ![Track payments](./docs/screenshots/track-payments.png) |

| Pay page | Nudge & share |
| --- | --- |
| ![Pay page](./docs/screenshots/pay-page.png) | ![Nudge and share](./docs/screenshots/nudge-share.png) |

Suggested filenames:

- `create-split.png` — start screen / connect wallet
- `receipt-scan.png` — camera or manual entry
- `review-share.png` — bill details, friend names, review
- `track-payments.png` — who's paid list
- `pay-page.png` — friend connect wallet and pay
- `nudge-share.png` — WhatsApp, Telegram, QR share sheet

## Requirements

- Node.js 20+
- pnpm (recommended)

## Local development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` for local dev.

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | For OCR | OpenRouter API key for receipt scanning |
| `OPENROUTER_MODEL` | No | Vision model (default: `openai/gpt-4o-mini`) |
| `OPENROUTER_SITE_URL` | No | Sent to OpenRouter as HTTP-Referer |
| `CHIP_DEMO_PAYMENTS` | No | `true` skips on-chain USDC (good for local dev) |
| `SEPOLIA_RPC_URL` | No | Server-side Sepolia RPC |
| `NEXT_PUBLIC_SEPOLIA_RPC_URL` | No | Client-side Sepolia RPC (baked in at build time) |
| `SEPOLIA_USDC_ADDRESS` | No | USDC contract on Sepolia |

Without `OPENROUTER_API_KEY`, receipt OCR won't work — manual entry still does.

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm start    # run production build
pnpm lint     # eslint
```

## Project structure

```
app/
  app/          # create split flow (/app)
  s/[id]/       # friend pay page
  s/[id]/track/ # organizer tracking
  api/          # splits, OCR, payments
lib/            # split logic, OCR, chain, storage
data/           # local split storage (gitignored)
```

## Product spec

See [PRODUCT.md](./PRODUCT.md) for full product requirements and architecture notes.
