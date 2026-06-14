"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function QrCode({ value, label }: { value: string; label: string }) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: 200,
      color: { dark: "#000f1d", light: "#ffffff" },
    }).then((url) => {
      if (active) setDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [value]);

  if (!dataUrl) return null;

  return (
    <figure className="m-0 text-center">
      <img
        src={dataUrl}
        alt=""
        width={200}
        height={200}
        className="mx-auto border-[3px] border-ink bg-card"
      />
      <figcaption className="mt-2 text-xs text-muted">{label}</figcaption>
    </figure>
  );
}
