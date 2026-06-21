import type { UserProfile } from "@/data/profile";

export interface ParsedCvProfile {
  fullName?: string;
  location?: string;
  bio?: string;
  university?: string;
  degree?: string;
  graduationYear?: string;
  visaStatus?: string;
  visaExpiry?: string;
  skills?: { name: string; level: number }[];
  experience?: { title: string; company: string; period: string }[];
  tags?: string[];
}

function clampLevel(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function asOptionalString(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = typeof v === "string" ? v : String(v);
  const t = s.trim();
  return t || undefined;
}

export function normalizeParsedCvProfile(raw: ParsedCvProfile): Partial<UserProfile> {
  const result: Partial<UserProfile> = {
    fullName: asOptionalString(raw.fullName),
    location: asOptionalString(raw.location),
    bio: asOptionalString(raw.bio),
    university: asOptionalString(raw.university),
    degree: asOptionalString(raw.degree),
    graduationYear: asOptionalString(raw.graduationYear),
    visaStatus: asOptionalString(raw.visaStatus),
    visaExpiry: asOptionalString(raw.visaExpiry),
    skills: raw.skills
      ?.filter((s) => s.name?.trim())
      .map((s) => ({
        name: String(s.name).trim(),
        level: clampLevel(Number(s.level) || 75),
      })),
    experience: raw.experience
      ?.filter((e) => e.title?.trim())
      .map((e) => ({
        title: String(e.title).trim(),
        company: asOptionalString(e.company) ?? "",
        period: asOptionalString(e.period) ?? "",
      })),
  };
  return result;
}

export function parseCvProfileJson(text: string): Partial<UserProfile> {
  try {
    const cleaned = text.replace(/```json?\n?/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as ParsedCvProfile;
    return normalizeParsedCvProfile(parsed);
  } catch {
    return {};
  }
}
