/** Extract keyword tags from CV text (no AI) — runs once on CV upload. */
const TECH_KEYWORDS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "Node.js",
  "SQL",
  "Excel",
  "AWS",
  "Docker",
  "Git",
  "Agile",
  "Scrum",
  "Machine Learning",
  "Data Analysis",
  "Financial Analysis",
  "Stakeholder Management",
  "Project Management",
  "Communication",
  "Leadership",
  "Next.js",
  "HTML",
  "CSS",
  "C++",
  "C#",
  ".NET",
  "Kubernetes",
  "PostgreSQL",
  "MongoDB",
  "Figma",
  "UI/UX",
  "REST API",
  "GraphQL",
  "TensorFlow",
  "PyTorch",
  "Power BI",
  "Tableau",
  "Consulting",
  "Graduate",
  "Internship",
];

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function cleanToken(raw: string) {
  return raw
    .replace(/^[-*•]\s*/, "")
    .replace(/\([^)]*\)/g, "")
    .trim();
}

export function extractTagsFromCv(cvText: string): string[] {
  if (!cvText.trim()) return [];

  const tags = new Set<string>();
  const lower = cvText.toLowerCase();

  for (const kw of TECH_KEYWORDS) {
    if (lower.includes(kw.toLowerCase())) tags.add(kw);
  }

  const sectionMatch = cvText.match(
    /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|KEY SKILLS)[:\s]*([\s\S]*?)(?:\n\s*\n|\n[A-Z][A-Z\s]{2,}\n|$)/i
  );
  if (sectionMatch?.[1]) {
    for (const part of sectionMatch[1].split(/[,•|\n;]+/)) {
      const token = cleanToken(part);
      if (token.length >= 2 && token.length <= 35 && !/^\d+$/.test(token)) {
        tags.add(titleCase(token));
      }
    }
  }

  // Degree / domain hints
  if (/\b(computer science|software engineering|economics|finance)\b/i.test(cvText)) {
    const m = cvText.match(/\b(computer science|software engineering|economics|finance)\b/i);
    if (m) tags.add(titleCase(m[1]));
  }

  if (/\b(visa|sponsorship|graduate route|tier 2)\b/i.test(cvText)) {
    tags.add("Visa Sponsorship");
  }

  return [...tags].slice(0, 15);
}
