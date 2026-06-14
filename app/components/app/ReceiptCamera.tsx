"use client";

import { useEffect, useRef, useState } from "react";

type CameraStatus = "loading" | "ready" | "blocked";

type ReceiptCameraProps = {
  scanning: boolean;
  onCapture: (file: File) => void;
  onCancel: () => void;
};

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function CancelIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="2" y="4" width="18" height="14" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 15 L7 10 L11 14 L15 10 L20 15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CameraHeader() {
  return (
    <div className="app-camera__header">
      <h2 className="app-camera__header-title">Snap the bill</h2>
      <p className="app-camera__header-copy">
        Line up the receipt inside the box
      </p>
    </div>
  );
}

export function ReceiptCamera({
  scanning,
  onCapture,
  onCancel,
}: ReceiptCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const onCaptureRef = useRef(onCapture);
  const onCancelRef = useRef(onCancel);

  const [status, setStatus] = useState<CameraStatus>("loading");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    onCaptureRef.current = onCapture;
    onCancelRef.current = onCancel;
  }, [onCapture, onCancel]);

  useEffect(() => {
    let active = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    async function startCamera() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        if (active) setStatus("blocked");
        return;
      }

      stopStream(streamRef.current);
      streamRef.current = null;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (!active) {
          stopStream(stream);
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }
        setStatus("ready");
      } catch {
        stopStream(streamRef.current);
        streamRef.current = null;
        if (active) setStatus("blocked");
      }
    }

    startCamera();

    return () => {
      active = false;
      document.body.style.overflow = previousOverflow;
      stopStream(streamRef.current);
      streamRef.current = null;
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!scanning && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrlRef.current = null;
      setPreviewUrl(null);
    }
  }, [scanning, previewUrl]);

  function setCapturePreview(url: string) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setPreviewUrl(url);
  }

  function handleShutter() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || scanning || status !== "ready") return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `receipt-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const url = URL.createObjectURL(blob);
        setCapturePreview(url);
        onCaptureRef.current(file);
      },
      "image/jpeg",
      0.92
    );
  }

  function handleFileSelect(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCapturePreview(url);
    onCaptureRef.current(file);
  }

  function handleCancel() {
    onCancelRef.current();
  }

  return (
    <section className="app-camera app-camera--fullscreen">
      <div className="app-camera__viewport">
        {status === "loading" && (
          <p className="app-camera__loading" aria-live="polite">
            Starting camera…
          </p>
        )}
        <video
          ref={videoRef}
          className="app-camera__video"
          playsInline
          muted
          autoPlay
          aria-label="Receipt camera preview"
        />
        <div className="app-camera__frame" aria-hidden />
        {!scanning && <CameraHeader />}
        {previewUrl && scanning && (
          <div className="app-camera__scan" aria-live="polite">
            <img src={previewUrl} alt="" className="app-camera__scan-image" />
            <p className="app-camera__scan-label">Reading receipt…</p>
          </div>
        )}
      </div>

      <div className="app-camera__dock">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          aria-label="Upload image"
          className="app-camera__dock-btn app-camera__upload"
        >
          <GalleryIcon />
        </button>
        <button
          type="button"
          onClick={handleShutter}
          disabled={scanning || status !== "ready"}
          aria-label="Capture receipt"
          className="app-camera__shutter"
        />
        <button
          type="button"
          onClick={handleCancel}
          disabled={scanning}
          aria-label="Cancel"
          className="app-camera__dock-btn app-camera__cancel"
        >
          <CancelIcon />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />
      </div>

      <canvas ref={canvasRef} className="sr-only" />
    </section>
  );
}
