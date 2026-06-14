import Link from "next/link";

function PhoneMock() {
  return (
    <div
      className="brutal-lg relative mx-auto w-full max-w-[280px] bg-surface-blue p-4 sm:max-w-[320px]"
      aria-hidden
    >
      <div className="mb-3 flex items-center justify-between border-b-[3px] border-ink pb-2">
        <span className="font-[family-name:var(--font-display)] text-sm font-bold">
          Dinner split
        </span>
        <span className="rounded-full border-2 border-ink bg-accent-hot px-2 py-0.5 text-xs font-semibold text-ink">
          Live
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between border-[3px] border-ink bg-card px-3 py-2">
          <span className="text-sm font-medium">You (Alex)</span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold text-primary">
            Paid ✓
          </span>
        </div>
        <div className="flex items-center justify-between border-[3px] border-ink bg-accent px-3 py-2">
          <span className="text-sm font-medium">Sam</span>
          <span className="font-[family-name:var(--font-display)] text-sm font-bold">
            $12.50
          </span>
        </div>
        <div className="flex items-center justify-between border-[3px] border-ink bg-card px-3 py-2">
          <span className="text-sm font-medium">Jordan</span>
          <span className="text-sm font-medium text-muted">Pending</span>
        </div>
      </div>
      <div className="mt-4 border-[3px] border-ink bg-primary px-3 py-2.5 text-center font-[family-name:var(--font-display)] text-sm font-bold text-ink">
        Pay $12.50 →
      </div>
      <div className="absolute -right-3 -top-3 rotate-6 border-[3px] border-ink bg-accent px-2 py-1 font-[family-name:var(--font-display)] text-xs font-bold shadow-[4px_4px_0_0_var(--ink)]">
        $50.00 bill
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="overflow-hidden border-b-[3px] border-ink bg-bg">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-[var(--space-section)] sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <p className="animate-rise mb-5 inline-block border-[3px] border-ink bg-surface-pink px-3 py-1 font-[family-name:var(--font-display)] text-sm font-bold">
            No spreadsheets. No chasing.
          </p>
          <h1
            className="animate-rise animate-rise-delay-1 mb-6 max-w-[14ch] font-[family-name:var(--font-display)] text-[length:var(--text-display)] font-extrabold leading-[var(--leading-tight)] tracking-[-0.03em] text-balance"
          >
            Split the bill. Get paid.
          </h1>
          <p className="animate-rise animate-rise-delay-2 mb-8 max-w-[42ch] text-lg text-muted">
            Snap a receipt, share one link in the group chat, and watch friends
            pay their share — instantly, borderless, zero wallet jargon.
          </p>
          <div className="animate-rise animate-rise-delay-3 flex flex-wrap gap-4">
            <Link href="/app" className="brutal-btn brutal-btn-primary">
              Split a bill now
            </Link>
            <a href="#how-it-works" className="brutal-btn brutal-btn-ghost">
              See how it works
            </a>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3 border-t-[3px] border-ink pt-8 sm:gap-6">
            <div>
              <dt className="sr-only">Time to share a link</dt>
              <dd className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums sm:text-3xl">
                &lt;30s
              </dd>
              <dd className="mt-1 text-sm text-muted">to share a link</dd>
            </div>
            <div>
              <dt className="sr-only">Install required</dt>
              <dd className="font-[family-name:var(--font-display)] text-2xl font-extrabold sm:text-3xl">
                0
              </dd>
              <dd className="mt-1 text-sm text-muted">apps to install</dd>
            </div>
            <div>
              <dt className="sr-only">Crypto talk</dt>
              <dd className="font-[family-name:var(--font-display)] text-2xl font-extrabold sm:text-3xl">
                0
              </dd>
              <dd className="mt-1 text-sm text-muted">gas-fee lectures</dd>
            </div>
          </dl>
        </div>
        <div className="animate-rise animate-rise-delay-2 flex justify-center lg:justify-end">
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}
