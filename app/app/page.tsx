"use client";

import { AppBackBar } from "@/app/components/app/AppBackBar";
import { ReceiptCamera } from "@/app/components/app/ReceiptCamera";
import { WalletSetup } from "@/app/components/app/WalletSetup";
import { useChainConfig } from "@/app/components/app/useChainConfig";
import {
  equalSplitShares,
  formatUsd,
  itemSplitShares,
} from "@/lib/split";
import type { ReceiptItem } from "@/lib/types";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";

type Mode = "start" | "camera" | "review" | "manual";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function personLabel(
  index: number,
  organizerName: string,
  friendNames: string[]
) {
  if (index === 0) return organizerName.trim() || "You";
  return friendNames[index - 1]?.trim() || `Friend ${index}`;
}

function parseFriendNames(input: string) {
  return input
    .split(/[\s,]+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function friendNamesForCount(input: string, count: number) {
  if (!Number.isFinite(count) || count < 2) return [];
  const parsed = parseFriendNames(input);
  return Array.from({ length: count - 1 }, (_, index) => parsed[index] ?? "");
}

function buildParticipantNames(
  count: number,
  organizerName: string,
  friendNames: string[]
) {
  return Array.from({ length: count }, (_, index) =>
    index === 0
      ? organizerName.trim()
      : friendNames[index - 1]?.trim() || `Friend ${index}`
  );
}

export default function CreateSplitPage() {
  const router = useRouter();
  const { address } = useAccount();
  const chainConfig = useChainConfig();
  const [mode, setMode] = useState<Mode>("start");
  const [organizerName, setOrganizerName] = useState("");
  const [total, setTotal] = useState("");
  const [taxCents, setTaxCents] = useState(0);
  const [tipPercent, setTipPercent] = useState(18);
  const [participantCount, setParticipantCount] = useState("2");
  const [friendNamesInput, setFriendNamesInput] = useState("");
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [assignItems, setAssignItems] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [sourceCurrency, setSourceCurrency] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const count = parseInt(participantCount, 10);
  const friendNames = useMemo(
    () => friendNamesForCount(friendNamesInput, count),
    [friendNamesInput, count]
  );
  const totalCents = Math.round(parseFloat(total) * 100) || 0;
  const subtotalCents = items.reduce((sum, item) => sum + item.priceCents, 0);
  const tipCents = assignItems && items.length > 0
    ? Math.round(subtotalCents * (tipPercent / 100))
    : Math.max(0, totalCents - taxCents - (items.length > 0 ? subtotalCents : 0));

  const preview = useMemo(() => {
    if (!Number.isFinite(totalCents) || totalCents <= 0 || count < 2) return null;

    const shares =
      assignItems && items.length > 0
        ? itemSplitShares(items, count, taxCents, tipCents)
        : equalSplitShares(totalCents, count);

    return { totalCents, count, shares };
  }, [totalCents, count, assignItems, items, taxCents, tipCents]);

  const showReview =
    preview && organizerName.trim().length > 0 && (mode === "review" || mode === "manual");

  async function handleReceiptSelect(file: File | undefined) {
    if (!file) return;
    setError("");
    setScanning(true);

    try {
      const image = await fileToBase64(file);
      const response = await fetch("/api/receipt/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mimeType: file.type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Could not read receipt");
      }

      const data = await response.json();
      const parsedItems: ReceiptItem[] = (data.items ?? []).map(
        (item: { name: string; priceCents: number }, index: number) => ({
          id: `item-${index}`,
          name: item.name,
          priceCents: item.priceCents,
          assignedTo: [],
        })
      );

      setItems(parsedItems);
      setTaxCents(data.taxCents ?? 0);
      setTotal((data.totalCents / 100).toFixed(2));
      setSourceCurrency(
        data.currencyCode && data.currencyCode !== "USD" ? data.currencyCode : null
      );
      setTipPercent(
        data.tipCents && data.totalCents
          ? Math.round((data.tipCents / data.totalCents) * 100)
          : 18
      );
      setMode("review");
      setAssignItems(parsedItems.length > 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not read receipt"
      );
      setSourceCurrency(null);
      setMode("manual");
    } finally {
      setScanning(false);
    }
  }

  function toggleItemAssignment(itemId: string, personIndex: number) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const has = item.assignedTo.includes(personIndex);
        return {
          ...item,
          assignedTo: has
            ? item.assignedTo.filter((i) => i !== personIndex)
            : [...item.assignedTo, personIndex],
        };
      })
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!address) {
      setError("Connect where payments land before sharing a link");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/splits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizerName,
        organizerWallet: address,
        totalCents,
        taxCents,
        tipCents,
        tipPercent,
        splitMode: assignItems && items.length > 0 ? "items" : "equal",
        items: assignItems ? items : [],
        participantCount: count,
        participantNames: buildParticipantNames(count, organizerName, friendNames),
        shares: preview?.shares,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Something went wrong — try again");
      return;
    }

    const split = await response.json();
    router.push(`/s/${split.id}/track`);
  }

  function submitHint() {
    if (loading) return null;
    if (!organizerName.trim()) return "Add your name to continue";
    if (!total || totalCents <= 0) return "Enter the bill total";
    if (count < 2) return "Need at least 2 people";
    if (!address) return "Connect where payments land";
    return null;
  }

  const handleCameraCancel = useCallback(() => {
    setMode("start");
  }, []);

  const handleBackToStart = useCallback(() => {
    setMode("start");
    setItems([]);
    setError("");
  }, []);

  const handleBackHome = useCallback(() => {
    router.push("/");
  }, [router]);

  if (!address) {
    return (
      <main className="flex flex-1 flex-col">
        <AppBackBar onBack={handleBackHome} label="Home" />
        <WalletSetup />
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      {mode === "camera" ? (
        <ReceiptCamera
          scanning={scanning}
          onCapture={handleReceiptSelect}
          onCancel={handleCameraCancel}
        />
      ) : (
        <>
          {mode === "start" ? (
            <AppBackBar onBack={handleBackHome} label="Home" />
          ) : (
            <AppBackBar onBack={handleBackToStart} />
          )}
      <div className="flex-1 px-4 py-6">
        {mode === "start" ? (
          <div className="flex min-h-[calc(100dvh-11rem)] flex-1 flex-col py-4">
            <div className="shrink-0">
              <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink text-balance">
                Split the bill
              </h1>
              <p className="mb-6 text-sm text-muted text-pretty">
                Snap a receipt or enter the total — share one link, get paid.
              </p>

              {chainConfig?.demoPayments && (
                <p className="app-notice mb-6">
                  Practice mode — payments are simulated until you go live.
                </p>
              )}

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setMode("camera")}
                  className="brutal-lg flex w-full flex-col items-center justify-center gap-3 bg-surface-blue px-4 py-10 text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center border-[3px] border-ink bg-card">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
                      <rect x="4" y="8" width="24" height="18" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="16" cy="17" r="5" stroke="currentColor" strokeWidth="2.5" />
                      <path d="M12 8 L14 5 H18 L20 8" stroke="currentColor" strokeWidth="2.5" />
                    </svg>
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-ink">
                    Scan bill
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceCurrency(null);
                    setMode("manual");
                  }}
                  className="brutal-btn brutal-btn-ghost app-btn-full"
                >
                  Enter manually
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
        <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink text-balance">
          {mode === "review" ? "Check the details" : "Enter the bill"}
        </h1>
        <p className="mb-6 text-sm text-muted text-pretty">
          {mode === "review"
            ? "Edit anything before you share the link."
            : "Add the total and headcount."}
        </p>

        {mode === "review" && sourceCurrency && (
          <p className="app-notice mb-4">
            Converted from {sourceCurrency} to USD for splitting.
          </p>
        )}

        {chainConfig?.demoPayments && (
          <p className="app-notice mb-4">
            Practice mode — payments are simulated until you go live.
          </p>
        )}

        <form id="split-form" onSubmit={handleSubmit} className="space-y-5">
          {(mode === "manual" || mode === "review") && (
            <>
              <div>
                <label htmlFor="organizer" className="app-label">
                  Your name
                </label>
                <input
                  id="organizer"
                  type="text"
                  className="app-input"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Alex"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="total" className="app-label">
                  Bill total
                </label>
                <div className="app-input-group">
                  <span className="app-input-group__prefix" aria-hidden>
                    $
                  </span>
                  <input
                    id="total"
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    className="app-input app-input-group__field tabular-nums"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="50.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="count" className="app-label">
                  How many people?
                </label>
                <input
                  id="count"
                  type="number"
                  min="2"
                  max="20"
                  inputMode="numeric"
                  className="app-input tabular-nums"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(e.target.value)}
                  required
                />
              </div>

              {count >= 2 && (
                <div>
                  <label htmlFor="friend-names" className="app-label">
                    Friend names
                  </label>
                  <input
                    id="friend-names"
                    type="text"
                    className="app-input"
                    value={friendNamesInput}
                    onChange={(e) => setFriendNamesInput(e.target.value)}
                    placeholder="Alex, Sam or Alex Sam"
                    autoComplete="off"
                  />
                </div>
              )}

              {items.length > 0 && (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <label className="app-label mb-0">Who had what?</label>
                    <button
                      type="button"
                      onClick={() => setAssignItems((v) => !v)}
                      className={`brutal-btn text-sm ${assignItems ? "brutal-btn-primary" : "brutal-btn-ghost"}`}
                    >
                      {assignItems ? "By item" : "Split evenly"}
                    </button>
                  </div>

                  {assignItems && (
                    <ul className="m-0 space-y-3 p-0">
                      {items.map((item) => (
                        <li key={item.id} className="brutal bg-card p-3">
                          <div className="mb-3 flex justify-between text-sm">
                            <span className="font-semibold">{item.name}</span>
                            <span className="tabular-nums">{formatUsd(item.priceCents)}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Array.from({ length: count }, (_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => toggleItemAssignment(item.id, i)}
                                aria-pressed={item.assignedTo.includes(i)}
                                className={`app-person-chip ${
                                  item.assignedTo.includes(i)
                                    ? "app-person-chip--active"
                                    : ""
                                }`}
                              >
                                {personLabel(i, organizerName, friendNames)}
                              </button>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}

          {showReview && preview && (
            <div className="brutal bg-surface p-4">
              <p className="mb-1 font-[family-name:var(--font-display)] text-base font-bold text-ink">
                Review
              </p>
              <p className="mb-3 text-sm text-muted">
                {assignItems && items.length > 0
                  ? "Split by item — tax and tip divided equally."
                  : "Equal split — leftover cents stay on you."}
              </p>
              <ul className="m-0 space-y-2 p-0">
                {preview.shares.map((cents, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-[2px] border-ink bg-card px-3 py-2 text-sm"
                  >
                    <span>{personLabel(index, organizerName, friendNames)}</span>
                    <span className="font-semibold tabular-nums">
                      {formatUsd(cents)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && <p className="app-error">{error}</p>}
        </form>
          </>
        )}
      </div>
        </>
      )}

      {(mode === "manual" || mode === "review") && (
        <div className="sticky bottom-0 border-t-[3px] border-ink bg-card p-4">
          <button
            type="submit"
            form="split-form"
            disabled={loading || !showReview}
            className="brutal-btn brutal-btn-primary app-btn-full"
          >
            {loading ? "One sec…" : "Get link"}
          </button>
          {submitHint() && (
            <p className="mt-2 text-center text-xs text-muted">{submitHint()}</p>
          )}
        </div>
      )}
    </main>
  );
}
