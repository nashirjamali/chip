"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/split";

type WalletButtonProps = {
  fullWidth?: boolean;
  connectLabel?: string;
};

export function WalletButton({
  fullWidth,
  connectLabel = "Connect to receive",
}: WalletButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const widthClass = fullWidth ? "w-full" : "";

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className={`brutal-btn brutal-btn-ghost text-sm ${widthClass}`}
      >
        {shortenAddress(address)}
      </button>
    );
  }

  const connector = connectors[0];

  return (
    <button
      type="button"
      disabled={!connector || isPending}
      onClick={() => connector && connect({ connector })}
      className={`brutal-btn ${fullWidth ? "brutal-btn-primary" : "brutal-btn-secondary"} text-sm ${widthClass}`}
    >
      {isPending ? "Connecting…" : connectLabel}
    </button>
  );
}
