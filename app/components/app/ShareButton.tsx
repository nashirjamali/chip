"use client";

type ShareButtonProps = {
  url: string;
  title: string;
  text: string;
  className?: string;
  children: React.ReactNode;
};

export function ShareButton({
  url,
  title,
  text,
  className,
  children,
}: ShareButtonProps) {
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
  }

  return (
    <button type="button" onClick={handleShare} className={className}>
      {children}
    </button>
  );
}
