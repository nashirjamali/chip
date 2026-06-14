type Step = "receive" | "snap" | "details" | "share";

const STEPS: { id: Step; label: string }[] = [
  { id: "receive", label: "Receive" },
  { id: "snap", label: "Snap" },
  { id: "details", label: "Details" },
  { id: "share", label: "Share" },
];

const ORDER: Step[] = ["receive", "snap", "details", "share"];

function stepIndex(step: Step) {
  return ORDER.indexOf(step);
}

export function AppStepIndicator({
  current,
  walletDone,
}: {
  current: Step;
  walletDone: boolean;
}) {
  const visible = walletDone ? STEPS.filter((s) => s.id !== "receive") : STEPS;
  const currentIdx = stepIndex(current);

  return (
    <nav aria-label="Progress" className="app-steps">
      <ol className="app-steps__list">
        {visible.map((step) => {
          const idx = stepIndex(step.id);
          const isActive = step.id === current;
          const isDone = idx < currentIdx;

          return (
            <li
              key={step.id}
              className={`app-steps__item${isActive ? " app-steps__item--active" : ""}${isDone ? " app-steps__item--done" : ""}`}
            >
              <span className="app-steps__dot" aria-hidden />
              <span className="app-steps__label">{step.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
