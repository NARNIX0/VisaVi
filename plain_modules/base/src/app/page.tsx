"use client";
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { validateSponsorship } from '@/lib/visaCheck';
import JobCard from '@/components/JobCard';

// Mock Data representing potential job feed
const MOCK_RAW_DATA = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    location: "London, UK",
    salary: "£70,000 - £90,000",
    description: "Build scalable web applications using React and Node.js.",
    company: { id: "c1", name: "TechFlow Ltd", hasActiveSponsorshipLicence: true }
  },
  {
    id: "2",
    title: "Product Manager",
    location: "Manchester, UK",
    salary: "£55,000",
    description: "Lead product development cycles.",
    company: { id: "c2", name: "Legacy Retail", hasActiveSponsorshipLicence: false }
  },
  {
    id: "3",
    title: "DevOps Architect",
    location: "Remote, UK",
    salary: "£85,000",
    description: "Manage AWS infrastructure.",
    company: { id: "c3", name: "CloudScale", hasActiveSponsorshipLicence: true }
  }
];

export default function Home() {
  const { jobs, setJobs } = useStore();

  useEffect(() => {
    // Implement :VisaSponsorCheck: logic at load time
    const filteredJobs = validateSponsorship(MOCK_RAW_DATA);
    setJobs(filteredJobs);
  }, [setJobs]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sponsored Job Opportunities</h1>
        <p className="text-gray-600">Only showing UK employers with active visa sponsorship licenses.</p>
      </header>

      <div className="grid gap-6">
        {jobs.length > 0 ? (
          jobs.map(job => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed border-gray-300">
            No sponsored jobs found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}