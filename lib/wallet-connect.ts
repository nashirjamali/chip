import type { Connector } from "wagmi";

export function hasInjectedProvider() {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { ethereum?: unknown }).ethereum);
}

export function getPreferredConnector(connectors: readonly Connector[]) {
  const injected = connectors.find((c) => c.type === "injected");
  const walletConnect = connectors.find((c) => c.id === "walletConnect");

  if (hasInjectedProvider() && injected) return injected;
  return walletConnect ?? injected ?? connectors[0];
}
