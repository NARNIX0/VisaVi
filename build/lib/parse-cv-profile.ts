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

export function normalizeParsedCvProfile(raw: ParsedCvProfile): Partial<UserProfile> {
  return {
    fullName: raw.fullName?.trim() || undefined,
    location: raw.location?.trim() || undefined,
    bio: raw.bio?.trim() || undefined,
    university: raw.university?.trim() || undefined,
    degree: raw.degree?.trim() || undefined,
    graduationYear: raw.graduationYear?.trim() || undefined,
    visaStatus: raw.visaStatus?.trim() || undefined,
    visaExpiry: raw.visaExpiry?.trim() || undefined,
    skills: raw.skills
      ?.filter((s) => s.name?.trim())
      .map((s) => ({
        name: s.name.trim(),
        level: clampLevel(Number(s.level) || 75),
      })),
    experience: raw.experience
      ?.filter((e) => e.title?.trim())
      .map((e) => ({
        title: e.title.trim(),
        company: e.company?.trim() ?? "",
        period: e.period?.trim() ?? "",
      })),
    tags: raw.tags
      ?.map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20),
  };
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
