export interface Company {
  id: string;
  name: string;
  hasActiveSponsorshipLicence: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  salary: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
}

export interface UserState {
  user: User | null;
  credits: number;
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  deductCredit: (amount: number) => void;
  setUser: (user: User) => void;
}