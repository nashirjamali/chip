import { NextResponse } from "next/server";
import { getChainConfig } from "@/lib/chain";

export async function GET() {
  return NextResponse.json(getChainConfig());
}
