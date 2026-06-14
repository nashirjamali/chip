import {
  createPublicClient,
  decodeEventLog,
  erc20Abi,
  formatUnits,
  http,
  isAddress,
  parseUnits,
} from "viem";
import { sepolia } from "viem/chains";
import type { ChainConfig } from "./types";

const SEPOLIA_USDC =
  process.env.SEPOLIA_USDC_ADDRESS ??
  "0x1c7D4B196Cb0C7B29D5D7D6D2c0dD41e7D72cb";

export function getChainConfig(): ChainConfig {
  const demoPayments = process.env.CHIP_DEMO_PAYMENTS === "true";
  return {
    chainId: sepolia.id,
    chainName: sepolia.name,
    usdcAddress: SEPOLIA_USDC,
    explorerUrl: "https://sepolia.etherscan.io",
    demoPayments,
  };
}

export function usdcToUnits(cents: number): bigint {
  return parseUnits((cents / 100).toFixed(2), 6);
}

export function usdcFromUnits(value: bigint): number {
  return Math.round(parseFloat(formatUnits(value, 6)) * 100);
}

function getPublicClient() {
  const rpcUrl =
    process.env.SEPOLIA_RPC_URL ?? "https://rpc.sepolia.org";
  return createPublicClient({
    chain: sepolia,
    transport: http(rpcUrl),
  });
}

export async function verifyUsdcPayment(params: {
  txHash: string;
  organizerWallet: string;
  expectedCents: number;
  payerWallet?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!/^0x[a-fA-F0-9]{64}$/.test(params.txHash)) {
    return { ok: false, error: "Invalid transaction hash" };
  }

  if (!isAddress(params.organizerWallet)) {
    return { ok: false, error: "Invalid organizer wallet" };
  }

  const client = getPublicClient();
  const config = getChainConfig();

  try {
    const receipt = await client.getTransactionReceipt({
      hash: params.txHash as `0x${string}`,
    });

    if (receipt.status !== "success") {
      return { ok: false, error: "Transaction failed on chain" };
    }

    const expected = usdcToUnits(params.expectedCents);
    let matched = false;

    for (const log of receipt.logs) {
      if (log.address.toLowerCase() !== config.usdcAddress.toLowerCase()) {
        continue;
      }

      try {
        const decoded = decodeEventLog({
          abi: erc20Abi,
          data: log.data,
          topics: log.topics,
        });

        if (decoded.eventName !== "Transfer") continue;

        const { from, to, value } = decoded.args;
        if (to.toLowerCase() !== params.organizerWallet.toLowerCase()) continue;
        if (value !== expected) continue;
        if (
          params.payerWallet &&
          from.toLowerCase() !== params.payerWallet.toLowerCase()
        ) {
          continue;
        }

        matched = true;
        break;
      } catch {
        continue;
      }
    }

    if (!matched) {
      return {
        ok: false,
        error: "No matching USDC transfer found in transaction",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Could not verify transaction on Sepolia" };
  }
}
