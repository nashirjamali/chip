import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { Split } from "./types";

const DATA_DIR = join(process.cwd(), "data");
const DATA_FILE = join(DATA_DIR, "splits.json");

type StoreData = {
  splits: Record<string, Split>;
};

function ensureStore(): StoreData {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    const empty: StoreData = { splits: {} };
    writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
  return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as StoreData;
}

function writeStore(data: StoreData): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function saveSplit(split: Split): void {
  const data = ensureStore();
  data.splits[split.id] = split;
  writeStore(data);
}

export function getSplit(id: string): Split | undefined {
  const data = ensureStore();
  return data.splits[id];
}

export function updateSplit(split: Split): void {
  saveSplit(split);
}

export function markParticipantPaid(
  splitId: string,
  participantId: string,
  txHash?: string
): Split | undefined {
  const split = getSplit(splitId);
  if (!split) return undefined;

  const participant = split.participants.find((p) => p.id === participantId);
  if (!participant) return undefined;

  participant.status = "paid";
  participant.txHash = txHash;
  participant.paidAt = new Date().toISOString();
  saveSplit(split);
  return split;
}

export function recordNudge(
  splitId: string,
  participantId: string
): Split | undefined {
  const split = getSplit(splitId);
  if (!split) return undefined;

  const participant = split.participants.find((p) => p.id === participantId);
  if (!participant) return undefined;

  participant.lastNudgedAt = new Date().toISOString();
  saveSplit(split);
  return split;
}
