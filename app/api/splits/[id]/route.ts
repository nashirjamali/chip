import { NextResponse } from "next/server";
import { isSplitExpired } from "@/lib/split";
import { getSplit } from "@/lib/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const split = getSplit(id);

  if (!split) {
    return NextResponse.json({ error: "Split not found" }, { status: 404 });
  }

  if (isSplitExpired(split)) {
    return NextResponse.json({ error: "This link has expired" }, { status: 410 });
  }

  return NextResponse.json(split);
}
