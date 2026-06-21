import { NextResponse } from "next/server";
import { extractCvFromFile, extractCvFromImages } from "@/lib/extract-cv";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await req.json()) as {
        images?: string[];
        fileName?: string;
      };

      if (!body.images?.length || !body.fileName) {
        return NextResponse.json(
          { error: "images and fileName required" },
          { status: 400 }
        );
      }

      const text = await extractCvFromImages(body.images, body.fileName);

      if (!text.trim()) {
        return NextResponse.json(
          { error: "Could not extract text from this file." },
          { status: 422 }
        );
      }

      return NextResponse.json({ text, fileName: body.fileName });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractCvFromFile(buffer, file.name, file.type);

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from this file." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text, fileName: file.name });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
