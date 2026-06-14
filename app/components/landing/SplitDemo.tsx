export function SplitDemo() {
  return (
    <section className="border-b-[3px] border-ink bg-bg py-[var(--space-section)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="brutal-lg bg-accent p-6 sm:p-8">
          <div className="mb-6 border-b-[3px] border-ink pb-4">
            <p className="m-0 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
              Saturday ramen · 4 people
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums">
              $86.40
            </p>
          </div>
          <ul className="m-0 list-none space-y-3 p-0">
            {[
              { name: "Alex (you)", amount: "$21.60", status: "Paid", paid: true },
              { name: "Sam", amount: "$21.60", status: "Paid", paid: true },
              { name: "Jordan", amount: "$21.60", status: "Pending", paid: false },
              { name: "Riley", amount: "$21.60", status: "Pending", paid: false },
            ].map((person) => (
              <li
                key={person.name}
                className="flex items-center justify-between border-[3px] border-ink bg-card px-4 py-3"
              >
                <span className="font-medium">{person.name}</span>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums font-semibold">{person.amount}</span>
                  <span
                    className={`border-2 border-ink px-2 py-0.5 text-xs font-bold ${
                      person.paid
                        ? "bg-primary text-ink"
                        : "bg-surface-pink text-ink"
                    }`}
                  >
                    {person.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-extrabold leading-[var(--leading-tight)] tracking-[-0.02em] text-balance">
            Know who paid without the awkward texts
          </h2>
          <p className="mb-6 max-w-[45ch] text-lg text-muted">
            The Fronter sees paid and pending in real time. Friends get a clear
            number and one button — no seed phrases, no network picker, no
            &ldquo;what&apos;s your Venmo again?&rdquo;
          </p>
          <ul className="m-0 space-y-3 p-0">
            {[
              "Links work even if they never installed Chip",
              "Stablecoins settle in seconds, globally",
              "You absorb the rounding — no penny fights",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 border-l-[6px] border-primary pl-4 font-medium"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
