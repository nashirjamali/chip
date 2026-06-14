"use client";

type AppBackBarProps = {
  onBack: () => void;
  label?: string;
};

export function AppBackBar({ onBack, label = "Back" }: AppBackBarProps) {
  return (
    <div className="app-back-bar">
      <button type="button" onClick={onBack} className="app-back-bar__btn">
        ← {label}
      </button>
    </div>
  );
}
