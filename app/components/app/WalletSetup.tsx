"use client";

import { WalletButton } from "./WalletButton";

export function WalletSetup() {
  return (
    <section className="flex flex-1 flex-col justify-center px-4 py-8">
      <h1 className="mb-2 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-ink text-balance">
        Where friends send money
      </h1>
      <p className="mb-6 max-w-[36ch] text-sm text-muted text-pretty">
        Connect once so payments land with you. Then snap the bill and share a
        link — friends pay their share in one tap.
      </p>
      <WalletButton fullWidth />
      <p className="mt-4 text-center text-xs text-muted">
        No app install for friends. You only set this up once.
      </p>
    </section>
  );
}
