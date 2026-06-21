import { NextResponse } from "next/server";
import { minimaxChat, type ChatMessage } from "@/lib/minimax";
import { stripAiReasoning } from "@/lib/ai-sanitize";

export type AIAction =
  | "chat"
  | "application"
  | "fullAnalysis"
  | "tailoredCv"
  | "interviewResults"
  | "interviewQuestions"
  | "parseCvProfile";

interface AIRequestBody {
  action: AIAction;
  messages?: ChatMessage[];
  job?: {
    title: string;
    company: string;
    description: string;
    requirements: string[];
    aboutCompany: string;
  };
  cv?: string;
  profileBio?: string;
  difficulty?: string;
  transcript?: { sender: string; text: string }[];
  metrics?: {
    communication: number;
    confidence: number;
    structure: number;
    relevance: number;
    technicalDepth: number;
  };
  durationSeconds?: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AIRequestBody;
    const { action, job, cv, profileBio, difficulty } = body;

    if (action === "chat") {
      const messages = body.messages ?? [];
      const text = await minimaxChat(messages);
      return NextResponse.json({ text });
    }

    if (action === "interviewResults") {
      if (!job) {
        return NextResponse.json({ error: "job required" }, { status: 400 });
      }
      const transcript = body.transcript ?? [];
      const metrics = body.metrics;
      const duration = body.durationSeconds ?? 0;
      const transcriptText =
        transcript.length > 0
          ? transcript.map((m) => `${m.sender === "ai" ? "Interviewer" : "Candidate"}: ${m.text}`).join("\n\n")
          : "No transcript yet — the candidate has not started the mock interview.";

      const text = await minimaxChat(
        [
          {
            role: "system",
            content:
              "You are Visavi's interview coach. Analyse a mock interview session and give actionable feedback in plain text with sections: Overall Performance, Communication & Delivery, Answer Quality, Strengths, Areas to Improve, Recommended Next Steps. Be specific and reference what the candidate actually said. Return only the analysis with no reasoning or thinking tags.",
          },
          {
            role: "user",
            content: `Analyse this mock interview for ${job.title} at ${job.company}.
Duration: ${Math.floor(duration / 60)}m ${duration % 60}s
Live scores (out of 10): Communication ${metrics?.communication?.toFixed(1) ?? "N/A"}, Confidence ${metrics?.confidence?.toFixed(1) ?? "N/A"}, Structure ${metrics?.structure?.toFixed(1) ?? "N/A"}, Relevance ${metrics?.relevance?.toFixed(1) ?? "N/A"}, Technical Depth ${metrics?.technicalDepth?.toFixed(1) ?? "N/A"}

Transcript:
${transcriptText}`,
          },
        ],
        { maxTokens: 2000 }
      );
      return NextResponse.json({ text });
    }

    if (action === "interviewQuestions") {
      if (!job) {
        return NextResponse.json({ error: "job required" }, { status: 400 });
      }
      const text = await minimaxChat(
        [
          {
            role: "system",
            content:
              "You generate realistic interview question banks based on public candidate reports. Return ONLY a valid JSON array, no markdown fences, no commentary. Each item: {\"question\":\"...\",\"category\":\"Behavioural|Technical|Culture|Case Study\",\"source\":\"Glassdoor|Reddit|LinkedIn|Blind|Indeed\",\"frequency\":\"Very common|Common|Occasional\",\"tip\":\"brief prep tip\"}. Generate 10-12 questions.",
          },
          {
            role: "user",
            content: `Generate an interview question bank for ${job.title} at ${job.company}.
Role: ${job.description}
Requirements: ${job.requirements.join(", ")}
Sources to simulate: Glassdoor interview reviews, Reddit (r/cscareerquestions and company threads), LinkedIn posts, Blind, Indeed Q&A.
Make questions realistic and role-specific.`,
          },
        ],
        { maxTokens: 2500 }
      );
      return NextResponse.json({ text: stripAiReasoning(text) });
    }

    if (action === "parseCvProfile") {
      if (!cv?.trim()) {
        return NextResponse.json({ error: "cv required" }, { status: 400 });
      }
      const text = await minimaxChat(
        [
          {
            role: "system",
            content: `Extract structured profile data from a CV/resume. Return ONLY valid JSON, no markdown fences, no commentary.
Schema:
{
  "fullName": "string",
  "location": "string",
  "bio": "2-3 sentence professional summary",
  "university": "string",
  "degree": "string",
  "graduationYear": "string",
  "visaStatus": "string or empty if not mentioned",
  "visaExpiry": "string or empty if not mentioned",
  "skills": [{"name":"string","level":0-100}],
  "experience": [{"title":"string","company":"string","period":"string"}],
  "tags": ["keyword1","keyword2"]
}
Include 8-15 tags: skills, tools, domains, and role keywords from the CV.`,
          },
          {
            role: "user",
            content: `Extract profile fields and tags from this CV:\n\n${cv.slice(0, 120_000)}`,
          },
        ],
        { maxTokens: 2000 }
      );
      return NextResponse.json({ text: stripAiReasoning(text) });
    }

    if (!job) {
      return NextResponse.json({ error: "job required" }, { status: 400 });
    }

    if (action === "application") {
      const text = await minimaxChat([
        {
          role: "system",
          content:
            "Write a tailored UK job application cover letter. Professional tone, 200-280 words, no markdown. Return only the cover letter with no reasoning or thinking tags.",
        },
        {
          role: "user",
          content: `Job: ${job.title} at ${job.company}
Requirements: ${job.requirements.join(", ")}
About role: ${job.description}
About company: ${job.aboutCompany}
Candidate CV:\n${cv ?? profileBio ?? "Economics graduate with React/TypeScript experience"}`,
        },
      ]);
      return NextResponse.json({ text });
    }

    if (action === "fullAnalysis") {
      const text = await minimaxChat([
        {
          role: "system",
          content:
            "You are Visavi's career AI. Give an in-depth job match analysis in plain text with sections: Overall Verdict, Strengths, Gaps, Sponsorship Outlook, Application Strategy. Be specific and concise. Return only the analysis with no reasoning or thinking tags.",
        },
        {
          role: "user",
          content: `Analyse fit for ${job.title} at ${job.company}.
Role: ${job.description}
Requirements: ${job.requirements.join(", ")}
Candidate CV:\n${cv ?? profileBio ?? ""}`,
        },
      ], { maxTokens: 1500 });
      return NextResponse.json({ text });
    }

    if (action === "tailoredCv") {
      const text = await minimaxChat([
        {
          role: "system",
          content:
            "Return two parts separated by '---CHANGES---'. Part 1: tailored CV text for the role. Part 2: bullet list of AI changes made and why. Return only the CV and changes with no reasoning or thinking tags.",
        },
        {
          role: "user",
          content: `Tailor this CV for ${job.title} at ${job.company}.
Role requirements: ${job.requirements.join(", ")}
Base CV:\n${cv ?? ""}`,
        },
      ], { maxTokens: 2500 });
      const cleaned = stripAiReasoning(text);
      const [cvText, changes] = cleaned.split("---CHANGES---");
      return NextResponse.json({
        text: cvText?.trim() ?? cleaned,
        changes: changes?.trim() ?? "Emphasised relevant skills and reordered experience for this role.",
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: !!process.env.MINIMAX_API_KEY,
    model: "MiniMax-M3",
    baseUrl: "https://api.minimax.io/v1",
  });
}
