import { NextResponse } from "next/server";
import { parseReceiptImage } from "@/lib/ocr";

export async function POST(request: Request) {
  const body = await request.json();
  const image = body.image as string | undefined;
  const mimeType = (body.mimeType as string | undefined) ?? "image/jpeg";

  if (!image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  try {
    const result = await parseReceiptImage(image, mimeType);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not read receipt";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
