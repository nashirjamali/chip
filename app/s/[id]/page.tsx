"use client";

import { WalletButton } from "@/app/components/app/WalletButton";
import { useChainConfig } from "@/app/components/app/useChainConfig";
import { usdcToUnits } from "@/lib/chain";
import { formatUsd } from "@/lib/split";
import type { Participant, Split } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { erc20Abi } from "viem";
import {
  useAccount,
  useConnect,
  usePublicClient,
  useWriteContract,
} from "wagmi";

function PayPageContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const participantId = searchParams.get("p");
  const chainConfig = useChainConfig();
  const publicClient = usePublicClient();

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContractAsync } = useWriteContract();

  const [split, setSplit] = useState<Split | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const loadSplit = useCallback(async () => {
    const response = await fetch(`/api/splits/${params.id}`);
    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "This link expired or doesn't exist");
      return;
    }

    const data: Split = await response.json();
    setSplit(data);

    const match =
      data.participants.find((p) => p.id === participantId) ??
      data.participants.find((p) => p.status === "pending") ??
      null;

    setParticipant(match);
    if (match?.status === "paid") setPaid(true);
  }, [params.id, participantId]);

  useEffect(() => {
    loadSplit();
  }, [loadSplit]);

  async function confirmPayment(hash: string) {
    if (!participant) return;

    const response = await fetch(`/api/splits/${params.id}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantId: participant.id,
        txHash: hash,
        payerWallet: address,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error ?? "Couldn't confirm payment");
    }

    setPaid(true);
    await loadSplit();
  }

  async function handlePay() {
    if (!participant || !split || !chainConfig) return;
    setError("");
    setPaying(true);

    try {
      if (chainConfig.demoPayments) {
        const response = await fetch(`/api/splits/${params.id}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: participant.id }),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error ?? "Couldn't complete payment");
        }
        setPaid(true);
        await loadSplit();
        return;
      }

      if (!isConnected || !address) {
        const connector = connectors[0];
        if (connector) connect({ connector });
        return;
      }

      const hash = await writeContractAsync({
        address: chainConfig.usdcAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "transfer",
        args: [
          split.organizerWallet as `0x${string}`,
          usdcToUnits(participant.amountCents),
        ],
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      await confirmPayment(hash);
    } catch (err) {
      if (err instanceof Error && err.message !== "User rejected the request.") {
        setError(err.message || "Payment cancelled or failed — try again");
      }
    } finally {
      setPaying(false);
    }
  }

  if (error && !split) {
    return (
      <main className="flex flex-1 flex-col px-4 py-6">
        <p className="app-error">{error}</p>
      </main>
    );
  }

  if (!split || !participant) {
    return (
      <main className="flex flex-1 flex-col px-4 py-6">
        <p className="text-muted">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center px-4 py-6">
        {paid ? (
          <div className="text-center">
            <p className="mb-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-ink">
              You&apos;re settled with {split.organizerName} ✓
            </p>
            <p className="text-sm text-muted">
              {formatUsd(participant.amountCents)} sent — you&apos;re done.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-2 text-center text-sm font-medium text-muted">
              {split.organizerName} is asking for
            </p>
            <p className="mb-1 text-center font-[family-name:var(--font-display)] text-5xl font-extrabold tabular-nums text-ink">
              {formatUsd(participant.amountCents)}
            </p>
            <p className="mb-4 text-center text-sm text-muted">
              of {formatUsd(split.totalCents)} total
            </p>
            {chainConfig?.demoPayments ? (
              <p className="mb-4 text-center text-xs text-muted">
                Demo mode — no real USDC transfer
              </p>
            ) : (
              <p className="mb-4 text-center text-xs text-muted">
                Pays in USDC on Sepolia testnet
              </p>
            )}
            {!isConnected && !chainConfig?.demoPayments && (
              <div className="mb-4 flex justify-center">
                <WalletButton />
              </div>
            )}
            {error && <p className="app-error mb-4">{error}</p>}
          </>
        )}
      </div>

      {!paid && (
        <div className="sticky bottom-0 border-t-[3px] border-ink bg-card p-4">
          <button
            type="button"
            onClick={handlePay}
            disabled={paying}
            className="brutal-btn brutal-btn-primary app-btn-full text-lg"
          >
            {paying
              ? "Processing…"
              : chainConfig?.demoPayments
                ? "Pay"
                : isConnected
                  ? "Pay with USDC"
                  : "Connect wallet"}
          </button>
        </div>
      )}
    </main>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 flex-col px-4 py-6">
          <p className="text-muted">Loading…</p>
        </main>
      }
    >
      <PayPageContent />
    </Suspense>
  );
}
