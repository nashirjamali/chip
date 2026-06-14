import type { CreateSplitInput, Participant, ReceiptItem, Split } from "./types";

export function equalSplitShares(totalCents: number, count: number): number[] {
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;
  const shares = Array.from({ length: count }, () => base);
  shares[0] += remainder;
  return shares;
}

export function itemSplitShares(
  items: ReceiptItem[],
  count: number,
  taxCents: number,
  tipCents: number
): number[] {
  const shares = Array.from({ length: count }, () => 0);

  for (const item of items) {
    const assignees =
      item.assignedTo.length > 0
        ? item.assignedTo.filter((i) => i >= 0 && i < count)
        : Array.from({ length: count }, (_, i) => i);

    if (assignees.length === 0) continue;
    const perPerson = Math.floor(item.priceCents / assignees.length);
    let remainder = item.priceCents % assignees.length;
    for (const index of assignees) {
      shares[index] += perPerson + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder -= 1;
    }
  }

  const extras = taxCents + tipCents;
  if (extras > 0) {
    const taxTipShares = equalSplitShares(extras, count);
    for (let i = 0; i < count; i++) {
      shares[i] += taxTipShares[i];
    }
  }

  return shares;
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function createSplit(input: CreateSplitInput): Split {
  const id = crypto.randomUUID().slice(0, 8);
  const count = input.participantCount;
  const taxCents = input.taxCents ?? 0;
  const tipCents = input.tipCents ?? 0;
  const splitMode = input.splitMode ?? "equal";
  const items = input.items ?? [];

  const shares =
    input.shares ??
    (splitMode === "items" && items.length > 0
      ? itemSplitShares(items, count, taxCents, tipCents)
      : equalSplitShares(input.totalCents, count));

  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const participants: Participant[] = shares.map((amountCents, index) => {
    const participantId = crypto.randomUUID().slice(0, 8);
    const name =
      input.participantNames?.[index]?.trim() ||
      (index === 0 ? input.organizerName.trim() : `Friend ${index}`);
    return {
      id: participantId,
      name,
      amountCents,
      status: index === 0 ? "paid" : "pending",
      paymentRef: `${id}-${participantId}`,
    };
  });

  return {
    id,
    organizerName: input.organizerName.trim(),
    organizerWallet: input.organizerWallet,
    totalCents: input.totalCents,
    taxCents,
    tipCents,
    tipPercent: input.tipPercent ?? 0,
    splitMode,
    items,
    participants,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function isSplitExpired(split: Split): boolean {
  return new Date(split.expiresAt) < new Date();
}

export function participantPayUrl(
  origin: string,
  splitId: string,
  participantId: string
): string {
  return `${origin}/s/${splitId}?p=${participantId}`;
}
