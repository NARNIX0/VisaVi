export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  appliedAt: Date;
  status: ApplicationStatus;
}