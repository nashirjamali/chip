"use client";

import { QrCode } from "@/app/components/app/QrCode";
import { useEffect, useState } from "react";

type ShareSheetProps = {
  open: boolean;
  onClose: () => void;
  url: string;
  text: string;
  title?: string;
};

function whatsAppShareUrl(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}

function telegramShareUrl(text: string, url: string) {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function ShareSheet({ open, onClose, url, text, title = "Share link" }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  async function copyLink() {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/55"
        onClick={onClose}
        aria-label="Close share"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-sheet-title"
        className="relative w-full max-w-sm brutal bg-card p-4"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="share-sheet-title"
              className="m-0 font-[family-name:var(--font-display)] text-lg font-extrabold text-ink"
            >
              {title}
            </h2>
            <p className="m-0 mt-1 text-sm text-muted">{text}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="brutal-btn brutal-btn-ghost shrink-0 px-2 py-1 text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <a
            href={whatsAppShareUrl(text, url)}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-secondary text-center text-sm"
          >
            WhatsApp
          </a>
          <a
            href={telegramShareUrl(text, url)}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn brutal-btn-secondary text-center text-sm"
          >
            Telegram
          </a>
        </div>

        <button
          type="button"
          onClick={copyLink}
          className="brutal-btn brutal-btn-primary mb-4 w-full text-sm"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>

        <QrCode value={url} label="Scan to pay" />
      </div>
    </div>
  );
}
