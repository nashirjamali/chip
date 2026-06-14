"use client";

import { QrCode } from "@/app/components/app/QrCode";
import { ShareButton } from "@/app/components/app/ShareButton";
import { useChainConfig } from "@/app/components/app/useChainConfig";
import {
  formatUsd,
  participantPayUrl,
  shortenAddress,
} from "@/lib/split";
import type { Split } from "@/lib/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TrackPage() {
  const params = useParams<{ id: string }>();
  const chainConfig = useChainConfig();
  const [split, setSplit] = useState<Split | null>(null);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [nudgeError, setNudgeError] = useState("");
  const [nudgedId, setNudgedId] = useState<string | null>(null);
  const [nudgingId, setNudgingId] = useState<string | null>(null);

  const loadSplit = useCallback(async () => {
    const response = await fetch(`/api/splits/${params.id}`);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Split not found");
      return;
    }
    setSplit(await response.json());
  }, [params.id]);

  useEffect(() => {
    setOrigin(window.location.origin);
    loadSplit();
    const interval = setInterval(loadSplit, 5000);
    return () => clearInterval(interval);
  }, [loadSplit]);

  const shareUrl = origin ? `${origin}/s/${params.id}` : "";
  const shareText = split
    ? `${split.organizerName} is collecting ${formatUsd(split.totalCents)} — tap to pay your share`
    : "";

  async function copyShareLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleNudge(participantId: string) {
    setNudgeError("");
    setNudgingId(participantId);

    const response = await fetch(`/api/splits/${params.id}/nudge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId }),
    });

    setNudgingId(null);

    if (!response.ok) {
      const data = await response.json();
      setNudgeError(data.error ?? "Could not send nudge");
      return;
    }

    const data = await response.json();
    setSplit(data.split);
    setNudgedId(participantId);

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chip",
          text: data.message,
          url: data.payUrl,
        });
      } catch {
        await navigator.clipboard.writeText(data.message);
      }
    } else {
      await navigator.clipboard.writeText(data.message);
    }

    setTimeout(() => setNudgedId(null), 2500);
  }

  function canNudge(participant: Split["participants"][number]) {
    if (!participant.lastNudgedAt) return true;
    const elapsed = Date.now() - new Date(participant.lastNudgedAt).getTime();
    return elapsed >= 24 * 60 * 60 * 1000;
  }

  const paidCount =
    split?.participants.filter((p) => p.status === "paid").length ?? 0;
  const totalCount = split?.participants.length ?? 0;
  const allPaid = split ? paidCount === totalCount : false;
  const receivedCents =
    split?.participants
      .filter((p, i) => i !== 0 && p.status === "paid")
      .reduce((sum, p) => sum + p.amountCents, 0) ?? 0;

  if (error) {
    return (
      <main className="flex flex-1 flex-col px-4 py-6">
        <p className="app-error">{error}</p>
      </main>
    );
  }

  if (!split) {
    return (
      <main className="flex flex-1 flex-col px-4 py-6">
        <p className="text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex-1 px-4 py-6">
        <h1 className="mb-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink">
          Who&apos;s paid?
        </h1>
        <p className="mb-2 text-sm text-muted">
          {paidCount} of {totalCount} in · {formatUsd(split.totalCents)} bill
        </p>
        <p className="mb-6 text-xs text-muted">
          Receiving to {shortenAddress(split.organizerWallet)} · Sepolia USDC
        </p>

        <div className="brutal mb-6 bg-surface p-4">
          <p className="mb-1 text-sm font-semibold text-ink">Your wallet</p>
          <p className="m-0 text-sm tabular-nums text-muted">
            {formatUsd(receivedCents)} received · funds land directly in your wallet
          </p>
          {chainConfig && (
            <a
              href={`${chainConfig.explorerUrl}/address/${split.organizerWallet}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-ink underline-offset-4 hover:underline"
            >
              View on Etherscan →
            </a>
          )}
        </div>

        {!allPaid && shareUrl && (
          <div className="brutal mb-6 bg-surface-blue p-4">
            <p className="mb-3 font-semibold text-ink">Share with the group</p>
            <div className="mb-4 flex gap-2">
              <ShareButton
                url={shareUrl}
                title="Chip"
                text={shareText}
                className="brutal-btn brutal-btn-primary flex-1 text-sm"
              >
                Share link
              </ShareButton>
              <button
                type="button"
                onClick={copyShareLink}
                className="brutal-btn brutal-btn-secondary flex-1 text-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <QrCode value={shareUrl} label="Friends can scan to pay" />
          </div>
        )}

        {allPaid && (
          <div className="brutal mb-6 bg-surface p-4 text-center">
            <p className="m-0 font-semibold text-ink">
              Everyone&apos;s in — you&apos;re all settled ✓
            </p>
          </div>
        )}

        {nudgeError && <p className="app-error mb-4">{nudgeError}</p>}

        <ul className="m-0 space-y-3 p-0">
          {split.participants.map((participant, index) => {
            const payUrl =
              origin && index !== 0
                ? participantPayUrl(origin, split.id, participant.id)
                : "";

            return (
              <li key={participant.id} className="brutal bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-semibold text-ink">
                      {participant.name}
                      {index === 0 && (
                        <span className="ml-2 text-xs font-medium text-muted">
                          you
                        </span>
                      )}
                    </p>
                    <p className="m-0 mt-0.5 text-sm tabular-nums text-muted">
                      {formatUsd(participant.amountCents)}
                    </p>
                    {payUrl && participant.status === "pending" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(payUrl);
                        }}
                        className="mt-1 text-xs font-semibold text-ink underline-offset-4 hover:underline"
                      >
                        Copy personal link
                      </button>
                    )}
                    {participant.txHash && chainConfig && (
                      <a
                        href={`${chainConfig.explorerUrl}/tx/${participant.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-xs text-muted underline-offset-4 hover:underline"
                      >
                        View payment
                      </a>
                    )}
                  </div>
                  <span
                    className={`shrink-0 border-2 border-ink px-2 py-0.5 text-xs font-bold ${
                      participant.status === "paid"
                        ? "bg-primary text-ink"
                        : "bg-accent text-ink"
                    }`}
                  >
                    {participant.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>

                {participant.status === "pending" && index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleNudge(participant.id)}
                    disabled={!canNudge(participant) || nudgingId === participant.id}
                    className="brutal-btn brutal-btn-ghost mt-3 w-full text-sm"
                  >
                    {nudgingId === participant.id
                      ? "Sending…"
                      : nudgedId === participant.id
                        ? `Nudge sent to ${participant.name}`
                        : canNudge(participant)
                          ? `Nudge ${participant.name}`
                          : "Nudge again tomorrow"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sticky bottom-0 border-t-[3px] border-ink bg-card p-4">
        <Link href="/app" className="brutal-btn brutal-btn-primary app-btn-full">
          Split another bill
        </Link>
      </div>
    </main>
  );
}
