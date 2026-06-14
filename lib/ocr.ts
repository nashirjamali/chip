import type { OcrResult } from "./types";

const OCR_PROMPT = `Extract receipt data as JSON only. Return:
{
  "items": [{"name": string, "priceCents": number}],
  "taxCents": number,
  "tipCents": number,
  "totalCents": number
}
Prices in cents (integer). Include all line items. If tip not shown, use 0.`;

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o-mini";

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

  const parsed = JSON.parse(content) as OcrResult;
  if (!parsed.totalCents || parsed.totalCents <= 0) {
    throw new Error("Could not find a total on this receipt");
  }

  return {
    items: (parsed.items ?? []).map((item) => ({
      name: item.name?.trim() || "Item",
      priceCents: Math.round(item.priceCents),
    })),
    taxCents: Math.round(parsed.taxCents ?? 0),
    tipCents: Math.round(parsed.tipCents ?? 0),
    totalCents: Math.round(parsed.totalCents),
  };
}
