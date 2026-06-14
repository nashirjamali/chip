import {
  SettleIllustration,
  ShareIllustration,
  SnapIllustration,
  SplitIllustration,
} from "./StepIllustrations";

const steps = [
  {
    num: "01",
    title: "Snap",
    body: "Point your camera at the receipt. Chip pulls out items, tax, tip, and total.",
    color: "bg-accent",
    Illustration: SnapIllustration,
  },
  {
    num: "02",
    title: "Split",
    body: "Equal split by default. Drag items onto people when someone ordered extra.",
    color: "bg-surface-blue",
    Illustration: SplitIllustration,
  },
  {
    num: "03",
    title: "Share",
    body: "One link for the group chat. WhatsApp, Telegram, iMessage — it just opens.",
    color: "bg-surface-pink",
    Illustration: ShareIllustration,
  },
  {
    num: "04",
    title: "Settle",
    body: "Friends tap Pay. You see who is in and who still owes — live, not someday.",
    color: "bg-primary text-ink",
    Illustration: SettleIllustration,
  },
];

export function Steps() {
  return (
    <section
      id="how-it-works"
      className="border-b-[3px] border-ink bg-surface py-[var(--space-section)]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="mb-4 max-w-[16ch] font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-extrabold leading-[var(--leading-tight)] tracking-[-0.02em] text-balance">
          Four taps from receipt to paid
        </h2>
        <p className="mb-12 max-w-[50ch] text-lg text-muted">
          Chip does one thing perfectly: get everyone settled before the Uber
          arrives.
        </p>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Illustration = step.Illustration;
            return (
              <li
                key={step.num}
                className={`step-card brutal-md flex flex-col p-5 ${step.color}`}
              >
                <Illustration label={step.num} />
                <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-bold">
                  {step.title}
                </h3>
                <p className="m-0 text-[0.95rem] leading-snug opacity-90">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
