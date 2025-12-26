import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const upload = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "store-logos",
    });

    return NextResponse.json({ url: upload.url });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}