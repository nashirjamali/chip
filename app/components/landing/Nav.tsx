import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="brutal bg-accent px-3 py-1.5 font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight text-ink no-underline"
        >
          Chip
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-4">
          <a
            href="#how-it-works"
            className="hidden font-medium text-ink underline-offset-4 hover:underline sm:inline"
          >
            How it works
          </a>
          <Link href="/app" className="brutal-btn brutal-btn-primary text-sm sm:text-base">
            Start splitting
          </Link>
        </nav>
      </div>
    </header>
  );
}
