"use client";

import { useEffect, useState } from "react";
import type { ChainConfig } from "@/lib/types";

export function useChainConfig() {
  const [config, setConfig] = useState<ChainConfig | null>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => null);
  }, []);

  return config;
}
