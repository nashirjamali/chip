"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";

export function AppHeader() {
  const pathname = usePathname();
  const isFriendPay =
    pathname.startsWith("/s/") && !pathname.endsWith("/track");

  return (
    <header className="app-header">
      <span className="font-[family-name:var(--font-display)] text-lg font-extrabold text-ink">
        {isFriendPay ? "Chip" : (
          <Link href="/" className="text-ink no-underline">
            Chip
          </Link>
        )}
      </span>
      <div className="flex items-center gap-2">
        {!isFriendPay && <WalletButton />}
        {!isFriendPay && (
          <Link
            href="/"
            className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Home
          </Link>
        )}
      </div>
    </header>
  );
}
