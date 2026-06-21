import { JobHeader } from '@/components/JobHeader';
import { AIVerdictCard } from '@/components/AIVerdictCard';
import { ActionButtons } from '@/components/ActionButtons';
import { Job, AIVerdict } from '@/types/job';

export default function Page() {
  const mockJob: Job = {
    id: '1',
    companyName: 'TechCorp Solutions',
    companyLogoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TC',
    title: 'Senior Software Engineer',
    location: 'New York, NY (Hybrid)',
    salaryRange: '$140,000 - $180,000',
    employmentType: 'Full-time',
    isSponsorshipActive: true,
  };

  const mockVerdict: AIVerdict = {
    matchPercentage: 92,
    interviewChance: 64,
    offerChance: 14,
    verdictText: 'Strong Apply',
    skillsAlignment: [
      { name: 'Financial Analysis', percentage: 100 },
      { name: 'Excel', percentage: 90 },
      { name: 'Data Analysis', percentage: 80 },
      { name: 'PowerPoint', percentage: 70 },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <JobHeader job={mockJob} />
        <AIVerdictCard verdict={mockVerdict} />
        <ActionButtons />
      </div>
    </main>
  );
}