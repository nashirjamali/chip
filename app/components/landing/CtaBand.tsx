import Link from "next/link";

export function CtaBand() {
  return (
    <section className="bg-primary py-[var(--space-section)]">
      <div className="mx-auto max-w-6xl px-5 text-center sm:px-8">
        <div className="brutal-lg mx-auto max-w-3xl border-ink bg-card p-8 sm:p-12">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-extrabold leading-[var(--leading-tight)] tracking-[-0.02em] text-balance">
            Fronted the bill? Get your money back tonight.
          </h2>
          <p className="mx-auto mb-8 max-w-[40ch] text-lg text-muted">
            Free for equal splits. Your friends tap a link — you stop being the
            group&apos;s unpaid accountant.
          </p>
          <Link href="/app" className="brutal-btn brutal-btn-secondary text-lg">
            Create your first split
          </Link>
        </div>
      </div>
    </section>
  );
}
