import { NextResponse } from "next/server";
import { createSplit } from "@/lib/split";
import { saveSplit } from "@/lib/store";
import { createSplitSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSplitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const split = createSplit(parsed.data);
  saveSplit(split);

  return NextResponse.json(split, { status: 201 });
}
