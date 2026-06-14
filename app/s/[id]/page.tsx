"use client";

import { WalletButton } from "@/app/components/app/WalletButton";
import { useChainConfig } from "@/app/components/app/useChainConfig";
import { usdcToUnits } from "@/lib/chain";
import { formatUsd, shortenAddress } from "@/lib/split";
import type { Participant, Split } from "@/lib/types";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { erc20Abi } from "viem";
import {
  useAccount,
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
  const { writeContractAsync } = useWriteContract();

  const [split, setSplit] = useState<Split | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const demoPayments = chainConfig?.demoPayments ?? false;
  const walletReady = demoPayments || isConnected;

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
    if (!participant || !split || !chainConfig || !walletReady) return;
    setError("");
    setPaying(true);

    try {
      if (demoPayments) {
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

      if (!address) return;

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
      <main className="flex flex-1 flex-col justify-center px-4 py-6">
        <div className="brutal bg-card p-4 text-center">
          <p className="m-0 font-semibold text-ink">Link unavailable</p>
          <p className="app-error mt-2 mb-0">{error}</p>
        </div>
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

  if (paid) {
    return (
      <main className="flex flex-1 flex-col justify-center px-4 py-6">
        <div className="text-center">
          <p className="mb-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-ink text-balance">
            You&apos;re settled with {split.organizerName} ✓
          </p>
          <p className="m-0 text-sm text-muted">
            {formatUsd(participant.amountCents)} sent — you&apos;re done.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="brutal mb-6 bg-surface-blue p-4 text-center">
          <p className="mb-2 text-sm font-medium text-muted">
            {split.organizerName} is asking for
          </p>
          <p className="mb-1 font-[family-name:var(--font-display)] text-5xl font-extrabold tabular-nums text-ink">
            {formatUsd(participant.amountCents)}
          </p>
          <p className="m-0 text-sm text-muted">
            of {formatUsd(split.totalCents)} total
          </p>
        </div>

        {!demoPayments && (
          <div className="brutal mb-6 bg-card p-4">
            <p className="app-label mb-1">
              {isConnected ? "Wallet connected" : "Step 1 · Connect wallet"}
            </p>
            {isConnected && address ? (
              <>
                <p className="m-0 text-sm text-muted text-pretty">
                  You&apos;re ready to pay {formatUsd(participant.amountCents)} in
                  USDC on Sepolia.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="m-0 font-mono text-sm font-semibold tabular-nums text-ink">
                    {shortenAddress(address)}
                  </p>
                  <WalletButton connectLabel="Connect wallet" />
                </div>
              </>
            ) : (
              <>
                <p className="m-0 text-sm text-muted text-pretty">
                  Connect a wallet before paying. MetaMask, Coinbase Wallet, and
                  other browser wallets work here.
                </p>
                <div className="mt-4">
                  <WalletButton
                    fullWidth
                    connectLabel="Connect wallet"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {demoPayments && (
          <p className="mb-6 text-center text-xs text-muted">
            Demo mode — no real USDC transfer
          </p>
        )}

        {!demoPayments && walletReady && (
          <p className="mb-6 text-center text-sm font-medium text-ink">
            Step 2 · Pay your share
          </p>
        )}

        {error && <p className="app-error mb-4">{error}</p>}
      </div>

      <div className="sticky bottom-0 border-t-[3px] border-ink bg-card p-4">
        <button
          type="button"
          onClick={handlePay}
          disabled={paying || !walletReady}
          className="brutal-btn brutal-btn-primary app-btn-full text-lg"
        >
          {paying
            ? "Processing…"
            : walletReady
              ? `Pay ${formatUsd(participant.amountCents)}`
              : "Connect wallet to pay"}
        </button>
        {!walletReady && !demoPayments && (
          <p className="m-0 mt-2 text-center text-xs text-muted">
            Connect your wallet above to unlock payment.
          </p>
        )}
      </div>
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
