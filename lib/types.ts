export type PaymentStatus = "pending" | "paid";

export type ReceiptItem = {
  id: string;
  name: string;
  priceCents: number;
  assignedTo: number[];
};

export type Participant = {
  id: string;
  name: string;
  amountCents: number;
  status: PaymentStatus;
  paymentRef: string;
  txHash?: string;
  paidAt?: string;
  lastNudgedAt?: string;
};

export type Split = {
  id: string;
  organizerName: string;
  organizerWallet: string;
  totalCents: number;
  taxCents: number;
  tipCents: number;
  tipPercent: number;
  splitMode: "equal" | "items";
  items: ReceiptItem[];
  participants: Participant[];
  createdAt: string;
  expiresAt: string;
};

export type CreateSplitInput = {
  organizerName: string;
  organizerWallet: string;
  totalCents: number;
  taxCents?: number;
  tipCents?: number;
  tipPercent?: number;
  splitMode?: "equal" | "items";
  items?: ReceiptItem[];
  participantCount: number;
  participantNames?: string[];
  shares?: number[];
};

export type OcrResult = {
  items: { name: string; priceCents: number }[];
  taxCents: number;
  tipCents: number;
  totalCents: number;
  currencyCode?: string;
};

export type ChainConfig = {
  chainId: number;
  chainName: string;
  usdcAddress: string;
  explorerUrl: string;
  demoPayments: boolean;
};
