import React from 'react';
import { Badge } from './ui/Badge';
import { MapPin, Banknote, Briefcase } from 'lucide-react';
import { Job } from '@/types/job';

interface JobHeaderProps {
  job: Job;
}

export const JobHeader: React.FC<JobHeaderProps> = ({ job }) => {
  if (!job) {
    throw new Error("JobHeader: 'job' prop is required for rendering.");
  }

  return (
    <div className="p-6 bg-white border rounded-lg shadow-sm flex flex-col md:flex-row gap-6 items-start">
      <div className="w-16 h-16 relative flex-shrink-0">
        <img
          src={job.companyLogoUrl}
          alt={`${job.companyName} logo`}
          className="rounded-md object-contain border w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Logo';
          }}
        />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
          {job.isSponsorshipActive && (
            <Badge variant="success">Sponsorship: Active</Badge>
          )}
        </div>
        
        <div className="text-lg font-medium text-slate-600">
          {job.companyName}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase size={16} />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Banknote size={16} />
            <span>{job.salaryRange}</span>
          </div>
        </div>
      </div>
    </div>
  );
};