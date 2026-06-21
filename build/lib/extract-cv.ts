import JSZip from "jszip";
import {
  minimaxExtractCvFromImages,
  minimaxExtractCvFromText,
} from "@/lib/minimax";

/** Extract plain text from an uploaded CV file buffer via MiniMax. */
export async function extractCvFromImages(
  images: string[],
  fileName: string
): Promise<string> {
  if (!images.length) {
    throw new Error("No document images to extract from.");
  }
  return minimaxExtractCvFromImages(images, fileName);
}

/** Pull rough text from a DOCX file (ZIP + XML only — no mammoth). */
async function roughDocxText(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) {
    throw new Error("Invalid DOCX file.");
  }

  return xml
    .replace(/<w:tab[^/]*\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractCvFromFile(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const lower = fileName.toLowerCase();

  if (
    mimeType === "text/plain" ||
    lower.endsWith(".txt") ||
    lower.endsWith(".md")
  ) {
    return buffer.toString("utf-8").trim();
  }

  if (mimeType.startsWith("image/")) {
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return extractCvFromImages([dataUrl], fileName);
  }

  if (
    mimeType.includes("wordprocessingml") ||
    mimeType === "application/msword" ||
    lower.endsWith(".docx") ||
    lower.endsWith(".doc")
  ) {
    const rough = await roughDocxText(buffer);
    if (!rough) {
      throw new Error("Could not read text from this Word document.");
    }
    return minimaxExtractCvFromText(rough, fileName);
  }

  if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
    throw new Error(
      "PDF files must be converted to images in the browser before extraction."
    );
  }

  throw new Error("Unsupported file type. Upload PDF, DOCX, or TXT.");
}
