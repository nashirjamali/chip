import type { ReactNode } from "react";

const stroke = 3;

function BrutalFrame({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div
      className="step-card__illustration relative mb-5 flex h-[7.5rem] items-center justify-center border-[3px] border-ink bg-card shadow-[4px_4px_0_0_var(--ink)]"
      aria-hidden
    >
      {children}
      <span className="step-card__badge absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center border-[3px] border-ink bg-accent font-[family-name:var(--font-display)] text-xs font-extrabold">
        {label}
      </span>
    </div>
  );
}

export function SnapIllustration({ label }: { label: string }) {
  return (
    <BrutalFrame label={label}>
      <svg width="88" height="72" viewBox="0 0 88 72" fill="none" aria-hidden>
        <rect
          x="18"
          y="6"
          width="52"
          height="60"
          rx="0"
          fill="var(--surface-blue)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <rect
          x="26"
          y="14"
          width="36"
          height="44"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <line
          x1="30"
          y1="22"
          x2="54"
          y2="22"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <line
          x1="30"
          y1="30"
          x2="50"
          y2="30"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <line
          x1="30"
          y1="38"
          x2="46"
          y2="38"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <circle
          cx="44"
          cy="52"
          r="8"
          fill="var(--primary)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <circle cx="44" cy="52" r="3" fill="var(--card)" />
        <path
          d="M8 20 L14 14 L20 20 L14 26 Z"
          fill="var(--accent-hot)"
          stroke="var(--ink)"
          strokeWidth={stroke}
          strokeLinejoin="miter"
        />
      </svg>
    </BrutalFrame>
  );
}

export function SplitIllustration({ label }: { label: string }) {
  return (
    <BrutalFrame label={label}>
      <svg width="96" height="72" viewBox="0 0 96 72" fill="none" aria-hidden>
        <rect
          x="8"
          y="10"
          width="80"
          height="52"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <line
          x1="48"
          y1="10"
          x2="48"
          y2="62"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <line
          x1="8"
          y1="36"
          x2="88"
          y2="36"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <rect
          x="14"
          y="16"
          width="28"
          height="14"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <rect
          x="54"
          y="16"
          width="28"
          height="14"
          fill="var(--surface-pink)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <rect
          x="14"
          y="42"
          width="28"
          height="14"
          fill="var(--surface-blue)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <rect
          x="54"
          y="42"
          width="28"
          height="14"
          fill="var(--primary)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <circle cx="24" cy="58" r="5" fill="var(--ink)" />
        <circle cx="48" cy="58" r="5" fill="var(--ink)" />
        <circle cx="72" cy="58" r="5" fill="var(--ink)" />
      </svg>
    </BrutalFrame>
  );
}

export function ShareIllustration({ label }: { label: string }) {
  return (
    <BrutalFrame label={label}>
      <svg width="96" height="72" viewBox="0 0 96 72" fill="none" aria-hidden>
        <rect
          x="10"
          y="18"
          width="52"
          height="36"
          fill="var(--surface-pink)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <path
          d="M10 26 L32 26 L38 18 L38 54 L32 46 L10 46 Z"
          fill="var(--surface-pink)"
          stroke="var(--ink)"
          strokeWidth={stroke}
          strokeLinejoin="miter"
        />
        <line
          x1="20"
          y1="32"
          x2="44"
          y2="32"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <line
          x1="20"
          y1="40"
          x2="36"
          y2="40"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <rect
          x="58"
          y="8"
          width="30"
          height="56"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <rect
          x="64"
          y="14"
          width="18"
          height="4"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
        <path
          d="M62 48 C70 40, 78 40, 86 48"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="square"
          fill="none"
        />
        <circle
          cx="86"
          cy="48"
          r="6"
          fill="var(--primary)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <path
          d="M83 48 L86 45 L89 48 L86 51 Z"
          fill="var(--card)"
        />
      </svg>
    </BrutalFrame>
  );
}

export function SettleIllustration({ label }: { label: string }) {
  return (
    <BrutalFrame label={label}>
      <svg width="88" height="72" viewBox="0 0 88 72" fill="none" aria-hidden>
        <rect
          x="12"
          y="20"
          width="64"
          height="40"
          fill="var(--primary)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <text
          x="44"
          y="46"
          textAnchor="middle"
          fill="var(--card)"
          fontFamily="system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
        >
          Pay
        </text>
        <path
          d="M58 8 L66 16 L50 32 L42 32 L42 24 L50 24 Z"
          fill="var(--accent)"
          stroke="var(--ink)"
          strokeWidth={stroke}
          strokeLinejoin="miter"
        />
        <circle
          cx="22"
          cy="14"
          r="10"
          fill="var(--card)"
          stroke="var(--ink)"
          strokeWidth={stroke}
        />
        <path
          d="M17 14 L20 17 L27 10"
          stroke="var(--ink)"
          strokeWidth={stroke}
          strokeLinecap="square"
          fill="none"
        />
        <rect
          x="6"
          y="56"
          width="76"
          height="10"
          fill="var(--accent-hot)"
          stroke="var(--ink)"
          strokeWidth={2}
        />
      </svg>
    </BrutalFrame>
  );
}
