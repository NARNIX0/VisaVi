import type { Job } from "@/types";

/** Hardcoded full job posting text built from each dummy job's data. */
export function getFullJobDescription(job: Job): string {
  const warnings = job.recommendation.warnings?.length
    ? `\n\nIMPORTANT NOTES\n${job.recommendation.warnings.map((w) => `• ${w}`).join("\n")}`
    : "";

  return `${job.title}
${job.company} · ${job.location}
${job.postedAgo}

OVERVIEW
${job.description}

KEY RESPONSIBILITIES
• Contribute as ${job.title} within the ${job.department} team
• Work ${job.jobType.toLowerCase()} from ${job.location}
• Apply expertise in ${job.requirements.join(", ")}
• Collaborate with stakeholders and deliver measurable outcomes
• Operate within ${job.company}'s standards for quality, compliance and client service

REQUIREMENTS
${job.requirements.map((r) => `• ${r}`).join("\n")}

QUALIFICATIONS
• Education: ${job.education}
• Experience: ${job.experience}
• Strong alignment with role-specific skills (${job.skills.map((s) => s.name).join(", ")})

COMPENSATION & LOGISTICS
• Salary: ${job.salary}
• Start date: ${job.startDate}
• Work arrangement: ${job.tags.filter((t) => ["Hybrid", "Remote", "On-site"].includes(t)).join(", ") || job.jobType}
• UK visa sponsorship: ${job.sponsorshipActive ? "Active sponsor licence confirmed" : "Status unverified"}

SKILLS MATCH (Visavi AI)
${job.skills.map((s) => `• ${s.name}: ${s.percentage}%`).join("\n")}

ABOUT ${job.company.toUpperCase()}
${job.aboutCompany}

VISAVI AI VERDICT — ${job.recommendation.verdict.toUpperCase()}
${job.recommendation.summary}

Why this role fits you:
${job.recommendation.reasons.map((r) => `• ${r}`).join("\n")}

Interview chance: ${job.recommendation.interviewChance}% (${job.recommendation.interviewLevel})
Offer chance: ${job.recommendation.offerChance}% (${job.recommendation.offerLevel})${warnings}`;
}
