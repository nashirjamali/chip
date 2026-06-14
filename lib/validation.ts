import { isAddress } from "viem";
import { z } from "zod";

export const receiptItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  priceCents: z.number().int().positive(),
  assignedTo: z.array(z.number().int().min(0)),
});

export const createSplitSchema = z.object({
  organizerName: z.string().trim().min(1),
  organizerWallet: z.string().refine((v) => isAddress(v), "Invalid wallet address"),
  totalCents: z.number().int().positive(),
  taxCents: z.number().int().min(0).optional(),
  tipCents: z.number().int().min(0).optional(),
  tipPercent: z.number().min(0).max(100).optional(),
  splitMode: z.enum(["equal", "items"]).optional(),
  items: z.array(receiptItemSchema).optional(),
  participantCount: z.number().int().min(2).max(20),
  participantNames: z.array(z.string()).optional(),
  shares: z.array(z.number().int().positive()).optional(),
});

export const paySchema = z.object({
  participantId: z.string().min(1),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/).optional(),
  payerWallet: z
    .string()
    .refine((v) => !v || isAddress(v), "Invalid payer wallet")
    .optional(),
});

export const nudgeSchema = z.object({
  participantId: z.string().min(1),
});
