"use client";

import { X, Building2, MapPin, Briefcase, PoundSterling, ShieldCheck } from "lucide-react";
import type { Job } from "@/types";
import { getFullJobDescription } from "@/data/job-full-descriptions";

export function JobDetailsModal({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !job) return null;

  const fullText = getFullJobDescription(job);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[10vmin]"
      onClick={onClose}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{job.title}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{job.company}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1">
                <PoundSterling className="h-3.5 w-3.5" />
                {job.salary}
              </span>
              {job.sponsorshipActive && (
                <span className="flex items-center gap-1 text-brand-dark">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Visa sponsorship
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-mint px-3 py-2 text-xs font-medium text-brand-dark">
            <Building2 className="h-4 w-4" />
            Full job description · {job.department}
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700">
            {fullText}
          </pre>
        </div>
      </div>
    </div>
  );
}
