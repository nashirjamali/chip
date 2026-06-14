"use client";

import { getPreferredConnector } from "@/lib/wallet-connect";
import { shortenAddress } from "@/lib/split";
import { useAccount, useConnect, useDisconnect } from "wagmi";

type WalletButtonProps = {
  fullWidth?: boolean;
  connectLabel?: string;
};

export function WalletButton({
  fullWidth,
  connectLabel = "Connect to receive",
}: WalletButtonProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  const widthClass = fullWidth ? "w-full" : "";
  const connector = getPreferredConnector(connectors);
  const walletConnectConfigured = connectors.some(
    (c) => c.id === "walletConnect"
  );

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

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        disabled={!connector || isPending}
        onClick={() => connector && connect({ connector })}
        className={`brutal-btn ${fullWidth ? "brutal-btn-primary" : "brutal-btn-secondary"} text-sm ${widthClass}`}
      >
        {isPending ? "Connecting…" : connectLabel}
      </button>
      {!walletConnectConfigured && !connector && (
        <p className="app-error mt-2 mb-0 text-xs">
          WalletConnect is not configured on this server.
        </p>
      )}
      {error && (
        <p className="app-error mt-2 mb-0 text-xs">{error.message}</p>
      )}
    </div>
  );
}
