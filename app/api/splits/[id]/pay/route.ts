import { NextResponse } from "next/server";
import { getChainConfig, verifyUsdcPayment } from "@/lib/chain";
import { isSplitExpired } from "@/lib/split";
import { getSplit, markParticipantPaid } from "@/lib/store";
import { paySchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const parsed = paySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const split = getSplit(id);
  if (!split) {
    return NextResponse.json({ error: "Split not found" }, { status: 404 });
  }

  if (isSplitExpired(split)) {
    return NextResponse.json({ error: "This link has expired" }, { status: 410 });
  }

  const participant = split.participants.find(
    (p) => p.id === parsed.data.participantId
  );
  if (!participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  if (participant.status === "paid") {
    return NextResponse.json(split);
  }

  const config = getChainConfig();

  if (!config.demoPayments) {
    if (!parsed.data.txHash) {
      return NextResponse.json(
        { error: "Transaction hash is required" },
        { status: 400 }
      );
    }

    const verification = await verifyUsdcPayment({
      txHash: parsed.data.txHash,
      organizerWallet: split.organizerWallet,
      expectedCents: participant.amountCents,
      payerWallet: parsed.data.payerWallet,
    });

    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }
  }

  const updated = markParticipantPaid(
    id,
    parsed.data.participantId,
    parsed.data.txHash
  );

  return NextResponse.json(updated);
}
