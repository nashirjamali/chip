const RATE_URL = "https://api.frankfurter.dev/v1/latest";

export async function usdRateFor(currencyCode: string): Promise<number> {
  const code = currencyCode.toUpperCase();
  if (code === "USD") return 1;

  const response = await fetch(`${RATE_URL}?base=${code}&symbols=USD`);
  if (!response.ok) {
    throw new Error(`Could not convert ${code} to USD`);
  }

  const data = (await response.json()) as { rates?: { USD?: number } };
  const rate = data.rates?.USD;
  if (rate === undefined || !Number.isFinite(rate)) {
    throw new Error(`Could not convert ${code} to USD`);
  }

  return rate;
}

export function majorToUsdCents(amount: number, rate: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * rate * 100);
}
