import { NextResponse } from "next/server";
import { participantPayUrl } from "@/lib/split";
import { getSplit, recordNudge } from "@/lib/store";
import { nudgeSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const parsed = nudgeSchema.safeParse(body);

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

  const participant = split.participants.find(
    (p) => p.id === parsed.data.participantId
  );
  if (!participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  if (participant.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  if (participant.lastNudgedAt) {
    const elapsed = Date.now() - new Date(participant.lastNudgedAt).getTime();
    if (elapsed < DAY_MS) {
      return NextResponse.json(
        { error: "You can nudge this person again tomorrow" },
        { status: 429 }
      );
    }
  }

  const updated = recordNudge(id, parsed.data.participantId);
  const origin = new URL(request.url).origin;
  const payUrl = participantPayUrl(origin, id, participant.id);
  const message = `Hey ${participant.name}, ${split.organizerName} is waiting on ${(participant.amountCents / 100).toFixed(2)} for the bill. Pay here: ${payUrl}`;

  return NextResponse.json({
    split: updated,
    message,
    payUrl,
  });
}
