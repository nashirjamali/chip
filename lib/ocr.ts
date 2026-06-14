import { majorToUsdCents, usdRateFor } from "./currency";
import type { OcrResult } from "./types";

const OCR_PROMPT = `Extract receipt data as JSON only. Detect the currency from symbols and text (ISO 4217 code, e.g. USD, EUR, IDR, THB, JPY).
Read amounts exactly as printed on the receipt. Respect local formatting (e.g. 1.234,56 in Europe, 1,234.56 in US, Rp 150.000 in Indonesia).
Return amounts in the currency's major unit as numbers (not cents): 12.34 for $12.34, 150000 for Rp150.000, 980 for ¥980.
{
  "currencyCode": string,
  "items": [{"name": string, "price": number}],
  "tax": number,
  "tip": number,
  "total": number
}
Include all line items. If tax or tip not shown, use 0.`;

type RawOcrResult = {
  currencyCode?: string;
  items?: { name?: string; price?: number; priceCents?: number }[];
  tax?: number;
  tip?: number;
  total?: number;
  taxCents?: number;
  tipCents?: number;
  totalCents?: number;
};

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

function readMajor(value: number | undefined, legacyCents: number | undefined): number {
  if (value !== undefined && Number.isFinite(value)) return value;
  if (legacyCents !== undefined && Number.isFinite(legacyCents)) return legacyCents / 100;
  return 0;
}

export async function parseReceiptImage(
  imageBase64: string,
  mimeType: string
): Promise<OcrResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Receipt scanning is not configured");
  }

  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_MODEL;

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://chip.app",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Chip",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: OCR_PROMPT },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    throw new Error("Could not read receipt — try entering the total manually");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Could not read receipt — try entering the total manually");
  }

  const parsed = JSON.parse(content) as RawOcrResult;
  const currencyCode = (parsed.currencyCode ?? "USD").toUpperCase();
  const totalMajor = readMajor(parsed.total, parsed.totalCents);

  if (!totalMajor || totalMajor <= 0) {
    throw new Error("Could not find a total on this receipt");
  }

  const items = parsed.items ?? [];
  const taxMajor = readMajor(parsed.tax, parsed.taxCents);
  const tipMajor = readMajor(parsed.tip, parsed.tipCents);
  const rate = await usdRateFor(currencyCode);
  const toCents = (amount: number) => majorToUsdCents(amount, rate);

  return {
    items: items.map((item) => ({
      name: item.name?.trim() || "Item",
      priceCents: toCents(readMajor(item.price, item.priceCents)),
    })),
    taxCents: toCents(taxMajor),
    tipCents: toCents(tipMajor),
    totalCents: toCents(totalMajor),
    currencyCode,
  };
}
