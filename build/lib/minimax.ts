// Server-side MiniMax M3 client (OpenAI-compatible).
// Token plan: https://api.minimax.io/v1 — set MINIMAX_API_KEY in .env.local

const BASE_URL = "https://api.minimax.io/v1";
const MODEL = "MiniMax-M3";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

import { stripAiReasoning } from "@/lib/ai-sanitize";

type MultimodalContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail?: "low" | "default" | "high" } };

export async function minimaxChat(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured");
  }

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: opts?.maxTokens ?? 2048,
      thinking: { type: "disabled" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return stripAiReasoning(data.choices?.[0]?.message?.content?.trim() ?? "");
}

/** Use MiniMax M3 vision to read CV page images and return plain-text CV content. */
export async function minimaxExtractCvFromImages(
  images: string[],
  fileName: string
): Promise<string> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    throw new Error("MINIMAX_API_KEY is not configured");
  }

  const content: MultimodalContentPart[] = [
    {
      type: "text",
      text: `Extract the full CV/resume text from these document page images (file: "${fileName}").
Return only the CV content as clean plain text with clear section labels (Contact, Summary, Experience, Education, Skills).
Do not add commentary, markdown headers, or bullet characters like •.`,
    },
    ...images.map((url) => ({
      type: "image_url" as const,
      image_url: { url, detail: "high" as const },
    })),
  ];

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You extract structured CV/resume text from document images accurately and completely.",
        },
        { role: "user", content },
      ],
      max_tokens: 4096,
      thinking: { type: "disabled" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`MiniMax API error (${res.status}): ${err}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = stripAiReasoning(data.choices?.[0]?.message?.content?.trim() ?? "");
  if (!text) {
    throw new Error("MiniMax returned empty CV text");
  }
  return text;
}

/** Format rough document text into a clean CV using MiniMax. */
export async function minimaxExtractCvFromText(
  rawText: string,
  fileName: string
): Promise<string> {
  return minimaxChat(
    [
      {
        role: "system",
        content:
          "You extract and format CV/resume content from raw document text. Return only the CV as clean plain text.",
      },
      {
        role: "user",
        content: `Format this raw text from "${fileName}" into a clean CV/resume:\n\n${rawText.slice(0, 120_000)}`,
      },
    ],
    { maxTokens: 4096 }
  );
}

export function interviewSystemPrompt(
  company: string,
  role: string,
  difficulty: string
) {
  return `You are a professional job interviewer for ${company}, conducting a mock interview for the ${role} position.
Difficulty: ${difficulty}.
Ask one question at a time. Keep responses concise (2-4 sentences).
After the candidate replies, briefly acknowledge and ask the next relevant question.
Focus on behavioural and role-specific technical questions appropriate for a UK graduate hire.
Do not break character.`;
}
