import type { Job } from "@/types";
import { stripAiReasoning } from "@/lib/ai-sanitize";
import { parseCvProfileJson } from "@/lib/parse-cv-profile";

async function postAI(body: Record<string, unknown>) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "AI request failed");
  return {
    text: stripAiReasoning(data.text ?? ""),
    changes: data.changes ? stripAiReasoning(data.changes) : undefined,
  };
}

export async function generateApplicationText(job: Job, cv: string) {
  const { text } = await postAI({
    action: "application",
    job: {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      aboutCompany: job.aboutCompany,
    },
    cv,
  });
  return text;
}

export async function generateFullAnalysis(job: Job, cv: string) {
  const { text } = await postAI({
    action: "fullAnalysis",
    job: {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      aboutCompany: job.aboutCompany,
    },
    cv,
  });
  return text;
}

export async function generateTailoredCv(job: Job, cv: string) {
  return postAI({
    action: "tailoredCv",
    job: {
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements,
      aboutCompany: job.aboutCompany,
    },
    cv,
  });
}

export async function sendChat(messages: { role: string; content: string }[]) {
  const { text } = await postAI({ action: "chat", messages });
  return text;
}

export async function parseCvProfile(cvText: string) {
  const { text } = await postAI({ action: "parseCvProfile", cv: cvText });
  return parseCvProfileJson(text);
}

function jobPayload(job: Job) {
  return {
    title: job.title,
    company: job.company,
    description: job.description,
    requirements: job.requirements,
    aboutCompany: job.aboutCompany,
  };
}

export interface InterviewQuestion {
  question: string;
  category: string;
  source: string;
  frequency: string;
  tip?: string;
}

export async function generateInterviewResults(
  job: Job,
  opts: {
    transcript: { sender: string; text: string }[];
    metrics: {
      communication: number;
      confidence: number;
      structure: number;
      relevance: number;
      technicalDepth: number;
    };
    durationSeconds: number;
  }
) {
  const { text } = await postAI({
    action: "interviewResults",
    job: jobPayload(job),
    transcript: opts.transcript,
    metrics: opts.metrics,
    durationSeconds: opts.durationSeconds,
  });
  return text;
}

export async function generateInterviewQuestions(job: Job): Promise<InterviewQuestion[]> {
  const { text } = await postAI({
    action: "interviewQuestions",
    job: jobPayload(job),
  });
  try {
    const cleaned = text.replace(/```json?\n?/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as InterviewQuestion[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // fall through
  }
  return text
    .split("\n")
    .filter((line) => line.trim().length > 10)
    .slice(0, 12)
    .map((line, i) => ({
      question: line.replace(/^\d+[\).\s-]+/, "").trim(),
      category: i % 2 === 0 ? "Behavioural" : "Technical",
      source: ["Glassdoor", "Reddit", "LinkedIn", "Blind"][i % 4],
      frequency: "Common",
    }));
}
