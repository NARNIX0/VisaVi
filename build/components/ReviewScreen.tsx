"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  MapPin,
  Briefcase,
  PoundSterling,
  BadgeCheck,
  ShieldCheck,
  FileText,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
} from "lucide-react";
import { MatchScore } from "@/components/MatchScore";
import { OneClickApplyModal } from "@/components/OneClickApplyModal";
import { FullAnalysisModal } from "@/components/FullAnalysisModal";
import { TailoredCvModal } from "@/components/TailoredCvModal";
import { ApplySuccessSplash } from "@/components/ApplySuccessSplash";
import { useAppStore, hasProfileCv } from "@/hooks/useAppStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SkillBar({ name, percentage }: { name: string; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-zinc-600">{name}</span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-bright to-brand"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ReviewScreen() {
  const job = useAppStore((s) => s.getReviewJob());
  const reviewQueue = useAppStore((s) => s.reviewQueue);
  const reviewIndex = useAppStore((s) => s.reviewIndex);
  const prevReview = useAppStore((s) => s.prevReview);
  const nextReview = useAppStore((s) => s.nextReview);
  const rejectJob = useAppStore((s) => s.rejectJob);
  const saveJob = useAppStore((s) => s.saveJob);
  const applyJob = useAppStore((s) => s.applyJob);
  const profile = useAppStore((s) => s.profile);
  const canApply = hasProfileCv(profile);

  const [applyOpen, setApplyOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const total = reviewQueue.length;
  const position = total > 0 ? reviewIndex + 1 : 0;

  if (total === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <p className="text-lg font-semibold text-zinc-800">No jobs to review</p>
        <p className="mt-1 text-sm text-zinc-500">Save roles from Discover to review them here.</p>
        <Link href="/" className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
          Discover Jobs
        </Link>
      </div>
    );
  }

  if (!job) return null;
  const rec = job.recommendation;

  function handleApplySuccess() {
    applyJob(job!.id);
    setApplyOpen(false);
    setShowSplash(true);
  }

  function handleSplashDone() {
    setShowSplash(false);
    nextReview();
  }

  return (
    <div className="flex h-full flex-col">
      {showSplash && (
        <ApplySuccessSplash company={job.company} onDone={handleSplashDone} />
      )}

      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-900">
            <ChevronLeft className="h-4 w-4" />
            Review
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{position} of {total}</span>
            <button onClick={prevReview} disabled={reviewIndex === 0} className="rounded-md border p-1 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextReview} disabled={reviewIndex >= total - 1} className="rounded-md border p-1 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <button
          onClick={() => saveJob(job.id)}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-zinc-700"
        >
          <Star className="h-4 w-4" />
          Save for later
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white"
                  style={{ backgroundColor: job.logoColor }}
                >
                  {job.companyInitials}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900">{job.title}</h1>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="font-medium">{job.company}</span>
                    {job.verified && <BadgeCheck className="h-4 w-4 text-brand" />}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.jobType}</span>
                    <span className="flex items-center gap-1"><PoundSterling className="h-4 w-4" />{job.salary}</span>
                  </div>
                </div>
              </div>
              {job.sponsorshipActive && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-brand-dark">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Sponsorship: Active
                </span>
              )}
            </div>

            <div className="rounded-xl border border-brand/20 bg-mint p-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-brand-dark">
                <Sparkles className="h-4 w-4" />
                AI Verdict
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-brand-dark">{rec.verdict}</h2>
                  <p className="mt-2 max-w-md text-sm text-zinc-600">{rec.summary}</p>
                </div>
                <MatchScore value={rec.overallMatch} size={120} showPercent label="Overall Match" labelPlacement="below" />
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-1.5 text-sm font-semibold"><FileText className="h-4 w-4" />Job Summary</div>
              <p className="mt-2 text-sm text-zinc-600">{job.description}</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-semibold"><BarChart3 className="h-4 w-4" />Skills Match</div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {job.skills.map((s) => (
                  <SkillBar key={s.name} name={s.name} percentage={s.percentage} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="text-sm font-semibold">Why <span className="text-brand">Visavi</span> Recommends</h3>
              <div className="mt-3 space-y-3">
                {rec.reasons.map((r) => (
                  <div key={r} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span className="text-zinc-700">{r}</span>
                  </div>
                ))}
                {rec.warnings?.map((w) => (
                  <div key={w} className="flex gap-2 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span className="text-zinc-700">{w}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAnalysisOpen(true)}
                className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                View full AI analysis
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setCvOpen(true)}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-brand/30 bg-mint py-2 text-sm font-medium text-brand-dark hover:bg-mint/80"
              >
                <FileText className="h-3.5 w-3.5" />
                View tailored CV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t bg-white px-6 py-3">
        <button
          onClick={() => { rejectJob(job.id); nextReview(); }}
          className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-500"
        >
          <X className="h-4 w-4" />
          Reject
        </button>
        <button
          onClick={() => saveJob(job.id)}
          className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold text-zinc-700"
        >
          <Star className="h-4 w-4" />
          Save
        </button>
        <button className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold text-zinc-700">
          <Send className="h-4 w-4" />
          Outreach
        </button>
        <button
          onClick={canApply ? () => setApplyOpen(true) : undefined}
          disabled={!canApply}
          title={!canApply ? "Upload your CV on Profile first" : undefined}
          className={cn(
            "ml-auto flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold",
            canApply
              ? "bg-brand-dark text-white hover:bg-[#0c6634]"
              : "cursor-not-allowed bg-zinc-200 text-zinc-500"
          )}
        >
          <Sparkles className="h-4 w-4" />
          One-Click Apply
        </button>
      </div>

      <OneClickApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        onSubmitted={handleApplySuccess}
        showSuccessStep={false}
      />
      <FullAnalysisModal job={job} open={analysisOpen} onClose={() => setAnalysisOpen(false)} />
      <TailoredCvModal job={job} open={cvOpen} onClose={() => setCvOpen(false)} />
    </div>
  );
}
