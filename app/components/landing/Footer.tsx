import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-ink bg-ink py-10 text-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="m-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">
            Chip
          </p>
          <p className="mt-2 max-w-[30ch] text-sm opacity-80">
            Snap a bill. Split it. Get paid — without the crypto lecture.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm font-medium">
          <Link href="/app" className="text-bg underline-offset-4 hover:underline">
            Open app
          </Link>
          <a href="#how-it-works" className="text-bg underline-offset-4 hover:underline">
            How it works
          </a>
        </nav>
      </div>
    </footer>
  );
}
