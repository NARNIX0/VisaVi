// Core domain types for VisaVi.
// These match the data shown in the mockups (PRD section 2).

/** The 6 Kanban columns / lifecycle stages of an application. */
export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected";

/** Used for the green "High" / orange "Medium" chance pills. */
export type ConfidenceLevel = "High" | "Medium" | "Low";

/** A single skill bar in the "Skills Match" section (e.g. Excel 90%). */
export interface SkillMatch {
  name: string;
  /** 0–100 */
  percentage: number;
}

/** The AI VERDICT / AI RECOMMENDATION panel (Artboard 2 & 3). */
export interface AIRecommendation {
  /** Headline verdict, e.g. "Strong Match" or "Strong Apply". */
  verdict: string;
  /** Short explanation paragraph shown under the verdict. */
  summary: string;
  /** Big circular gauge value, 0–100 (e.g. 92). */
  overallMatch: number;
  /** Interview Chance %, 0–100. */
  interviewChance: number;
  interviewLevel: ConfidenceLevel;
  /** Offer Chance %, 0–100. */
  offerChance: number;
  offerLevel: ConfidenceLevel;
  /** "Why?" bullet points (green checkmarks). */
  reasons: string[];
  /** Optional caveats (orange warning triangles). */
  warnings?: string[];
}

/** A sponsored job listing (Artboard 2 & 3). */
export interface Job {
  id: string;
  title: string;
  company: string;
  /** Short label drawn inside the logo square, e.g. "D." for Deloitte. */
  companyInitials: string;
  /** Tailwind-friendly hex used as the logo background colour. */
  logoColor: string;
  /** Green verified checkmark next to the company name. */
  verified: boolean;
  location: string;
  /** e.g. "Full-time", "Hybrid". */
  jobType: string;
  /** Display string, e.g. "£55,000 – £65,000". */
  salary: string;
  /** Circular match score, 0–100 (e.g. 83). */
  matchScore: number;
  /** Has an active UK sponsor licence (drives the green pill). */
  sponsorshipActive: boolean;
  /** Pills under the header, e.g. ["Hybrid", "Visa Sponsorship"]. */
  tags: string[];
  /** Requirement pills, e.g. ["React", "Node.js", "TypeScript"]. */
  requirements: string[];
  /** "About this role" paragraph. */
  description: string;
  /** "About <company>" paragraph. */
  aboutCompany: string;
  /** Relative time string, e.g. "Posted 2 days ago". */
  postedAgo: string;
  /** Job summary metadata rows (Artboard 3). */
  department: string;
  startDate: string;
  experience: string;
  education: string;
  /** Skills Match progress bars. */
  skills: SkillMatch[];
  /** The AI verdict for this job. */
  recommendation: AIRecommendation;
}

/** A user's tracked interaction with a job (Artboard 4 Kanban card). */
export interface Application {
  id: string;
  /** Links back to the source job. */
  jobId: string;
  /** Denormalised for quick card rendering. */
  company: string;
  companyInitials: string;
  logoColor: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  /** ISO date string of the last status change (drives "2 days ago"). */
  updatedAt: string;
  /** Assessment column: ISO due date (shows "Due X days" badge). */
  dueDate?: string;
  /** Interview column: ISO date/time of the scheduled interview. */
  interviewAt?: string;
}

/** Live feedback scores in the mock interview (Artboard 5), each 0–10. */
export interface InterviewMetrics {
  communication: number;
  confidence: number;
  structure: number;
  relevance: number;
  technicalDepth: number;
}

/** A single AI suggestion item in the live feedback panel. */
export interface AISuggestion {
  id: string;
  text: string;
  /** Tailwind-friendly hex for the coloured dot. */
  color: string;
}

/** A card in the "Upcoming Interviews" column (Artboard 5). */
export interface UpcomingInterview {
  id: string;
  company: string;
  companyInitials: string;
  logoColor: string;
  role: string;
  matchScore: number;
  /** Display string, e.g. "Tomorrow, 2:00 PM". */
  scheduledFor: string;
}

/** The signed-in user (sidebar profile + Solvimon credits). */
export interface User {
  id: string;
  name: string;
  email: string;
  /** Avatar initials, e.g. "AA". */
  initials: string;
  /** Optional avatar image URL. */
  avatarUrl?: string;
  /** Solvimon credit balance shown in the sidebar. */
  credits: number;
  isPro: boolean;
}
