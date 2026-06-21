export interface SkillAlignment {
  name: string;
  percentage: number;
}

export interface Job {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  title: string;
  location: string;
  salaryRange: string;
  employmentType: string;
  isSponsorshipActive: boolean;
}

export interface AIVerdict {
  matchPercentage: number;
  interviewChance: number;
  offerChance: number;
  verdictText: string;
  skillsAlignment: SkillAlignment[];
}