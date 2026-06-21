"use client";

import type { ReactNode } from "react";
import {
  MapPin,
  Briefcase,
  PoundSterling,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  House,
  ShieldCheck,
  Heart,
  Tag,
  ListChecks,
  Building2,
  ExternalLink,
  X,
  List,
  Users,
  Rocket,
  Code2,
  Clock,
  Workflow,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Job, ConfidenceLevel } from "@/types";
import { MatchScore } from "@/components/MatchScore";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  /** "full" = Artboard 2 recommendation card; "compact" = Kanban/list card. */
  variant?: "full" | "compact";
  /** Compact only: footer area (e.g. relative date or due badge). */
  footer?: ReactNode;
  /** Compact only: status accent dot colour. */
  accentColor?: string;
  /** Full only: floating action handlers. */
  onPass?: () => void;
  onSave?: () => void;
  onApply?: () => void;
  /** Full only: disable apply when profile has no CV. */
  applyDisabled?: boolean;
  /** Full only: large discover/swipe layout. */
  discoverMode?: boolean;
  /** Full only: open full job description. */
  onViewDetails?: () => void;
  /** Full only: squarish mobile-style compact layout. */
  dense?: boolean;
  className?: string;
}

const tagIcons: Record<string, LucideIcon> = {
  Hybrid: House,
  Remote: House,
  "On-site": Building2,
  "Visa Sponsorship": ShieldCheck,
  "Tech for Good": Heart,
};

const requirementIcons: LucideIcon[] = [Code2, Clock, Workflow];

function levelClasses(level: ConfidenceLevel) {
  switch (level) {
    case "High":
      return "bg-green-100 text-green-700";
    case "Medium":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-zinc-100 text-zinc-500";
  }
}

function levelArrowColor(level: ConfidenceLevel) {
  switch (level) {
    case "High":
      return "text-green-600";
    case "Medium":
      return "text-orange-500";
    default:
      return "text-zinc-400";
  }
}

/** Coloured square logo with the company initials. */
function Logo({ job, size }: { job: Job; size: "sm" | "lg" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-bold text-white",
        size === "lg" ? "h-16 w-16 rounded-2xl text-xl" : "h-9 w-9 rounded-lg text-xs"
      )}
      style={{ backgroundColor: job.logoColor }}
    >
      {job.companyInitials}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Compact card (Kanban + lists)
// ----------------------------------------------------------------------------
function CompactCard({
  job,
  footer,
  accentColor,
  className,
}: Pick<JobCardProps, "job" | "footer" | "accentColor" | "className">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Logo job={job} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {job.title}
          </p>
          <p className="truncate text-xs text-zinc-500">{job.company}</p>
        </div>
        {accentColor && (
          <span
            className="mt-1 h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
      </div>

      <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
        <MapPin className="h-3.5 w-3.5" />
        <span className="truncate">{job.location}</span>
      </div>

      {footer && <div className="mt-2 text-xs text-zinc-400">{footer}</div>}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Full recommendation card (Artboard 2)
// ----------------------------------------------------------------------------
function FullCard({
  job,
  onPass,
  onSave,
  onApply,
  applyDisabled,
  discoverMode,
  onViewDetails,
  dense,
  className,
}: Pick<
  JobCardProps,
  | "job"
  | "onPass"
  | "onSave"
  | "onApply"
  | "applyDisabled"
  | "discoverMode"
  | "onViewDetails"
  | "dense"
  | "className"
>) {
  const rec = job.recommendation;
  const compact = dense && !discoverMode;
  const large = discoverMode;

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("flex items-center", large ? "gap-4" : compact ? "gap-2" : "gap-4")}>
        {/* Pass */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            onClick={onPass}
            aria-label="Pass"
            className={cn(
              "flex items-center justify-center rounded-full bg-white text-zinc-700 shadow-md transition-colors hover:bg-zinc-50",
              large ? "h-14 w-14" : compact ? "h-10 w-10" : "h-12 w-12"
            )}
          >
            <X className={large ? "h-6 w-6" : compact ? "h-4 w-4" : "h-5 w-5"} />
          </button>
          <span className="text-[10px] text-zinc-500">Pass</span>
        </div>

        {/* Card with green top strip */}
        <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-gradient-to-r from-brand-bright to-brand px-1 pb-1 pt-2 shadow-lg">
          <div className={cn("flex min-h-0 flex-1 flex-col rounded-xl bg-white", large ? "p-5 sm:p-6" : compact ? "p-4" : "p-6")}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <Logo job={job} size={large || !compact ? "lg" : "sm"} />
                <div className="min-w-0">
                  <h2 className={cn("font-bold text-zinc-900", large ? "text-2xl leading-tight" : compact ? "text-lg leading-tight" : "text-2xl")}>
                    {job.title}
                  </h2>
                  <div className="mt-0.5 flex items-center gap-1.5 text-zinc-700">
                    <span className={cn("font-medium", compact && !large && "text-sm")}>{job.company}</span>
                    {job.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand" />
                    )}
                  </div>
                  <div className={cn("mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-zinc-500", large ? "text-sm" : compact ? "text-xs" : "text-sm")}>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.jobType}
                    </span>
                    {(large || !compact) && (
                      <span className="flex items-center gap-1 font-medium text-zinc-700">
                        <PoundSterling className="h-3.5 w-3.5" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <MatchScore
                value={job.matchScore}
                size={large ? 96 : compact ? 72 : 104}
                label={compact && !large ? "MATCH" : "MATCH SCORE"}
              />
            </div>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.slice(0, compact && !large ? 2 : undefined).map((tag) => {
                const Icon = tagIcons[tag] ?? Tag;
                return (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                );
              })}
            </div>

            {/* Body */}
            <div className={cn("mt-3 grid gap-3", large ? "grid-cols-1 gap-4" : compact ? "grid-cols-1" : "mt-5 gap-5 md:grid-cols-2")}>
              {/* AI recommendation */}
              <div className={cn("rounded-xl bg-mint", large ? "p-4" : compact ? "p-3" : "p-4")}>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-dark">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendation
                </div>
                <h3 className={cn("mt-1.5 font-bold text-brand-dark", large ? "text-xl" : compact ? "text-base" : "text-xl")}>
                  {rec.verdict}
                </h3>
                <p className={cn("mt-1 text-zinc-600", large ? "line-clamp-3 text-sm" : compact ? "line-clamp-3 text-xs" : "text-sm")}>{rec.summary}</p>

                {(large || !compact) && (
                  <>
                    <div className={cn("mt-4 grid grid-cols-2 gap-4", large && "gap-3")}>
                      <Metric
                        label="Interview Chance"
                        value={rec.interviewChance}
                        level={rec.interviewLevel}
                      />
                      <Metric
                        label="Offer Chance"
                        value={rec.offerChance}
                        level={rec.offerLevel}
                      />
                    </div>

                    <p className="mt-4 text-sm font-semibold text-zinc-700">Why?</p>
                    <div className="mt-1.5 flex flex-col gap-1">
                      {rec.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="flex items-start gap-1 text-xs text-zinc-600"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* About role snippet in discover mode */}
              {large && (
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                    <ListChecks className="h-4 w-4" />
                    About this role
                  </div>
                  <p className="mt-1.5 line-clamp-4 text-sm text-zinc-600">{job.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.requirements.slice(0, 4).map((req, i) => {
                      const Icon = requirementIcons[i % requirementIcons.length];
                      return (
                        <span
                          key={req}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-600"
                        >
                          <Icon className="h-3.5 w-3.5 text-zinc-400" />
                          {req}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* About role — full layout only */}
              {!compact && !large && (
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                  <ListChecks className="h-4 w-4" />
                  About this role
                </div>
                <p className="mt-1.5 text-sm text-zinc-600">{job.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => {
                    const Icon = requirementIcons[i % requirementIcons.length];
                    return (
                      <span
                        key={req}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-600"
                      >
                        <Icon className="h-3.5 w-3.5 text-zinc-400" />
                        {req}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                  <Building2 className="h-4 w-4" />
                  About {job.company}
                </div>
                <p className="mt-1.5 text-sm text-zinc-600">
                  {job.aboutCompany}
                </p>
                <button className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-dark hover:underline">
                  View company profile
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            onClick={onSave}
            aria-label="Save"
            className={cn(
              "flex items-center justify-center rounded-full bg-white text-brand shadow-md transition-colors hover:bg-zinc-50",
              large ? "h-14 w-14" : compact ? "h-10 w-10" : "h-12 w-12"
            )}
          >
            <Heart className={large ? "h-6 w-6" : compact ? "h-4 w-4" : "h-5 w-5"} />
          </button>
          <span className="text-[10px] text-zinc-500">Save</span>
        </div>
      </div>

      {/* Action bar */}
      {large ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={onViewDetails}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
          >
            <List className="h-4 w-4" />
            View Full Details
          </button>
          <button
            onClick={applyDisabled ? undefined : onApply}
            disabled={applyDisabled}
            title={applyDisabled ? "Upload your CV on Profile first" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 rounded-xl py-3.5 text-sm font-semibold text-white",
              applyDisabled
                ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
                : "bg-brand-dark hover:bg-[#0c6634]"
            )}
          >
            <span className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              One-Click Apply
            </span>
            {applyDisabled && (
              <span className="text-[10px] font-normal">Add CV in Profile</span>
            )}
          </button>
        </div>
      ) : compact ? (
        <button
          onClick={applyDisabled ? undefined : onApply}
          disabled={applyDisabled}
          title={applyDisabled ? "Upload your CV on Profile first" : undefined}
          className={cn(
            "mt-3 flex w-full flex-col items-center justify-center gap-0.5 rounded-xl py-3 text-sm font-semibold text-white",
            applyDisabled
              ? "cursor-not-allowed bg-zinc-300 text-zinc-500"
              : "bg-brand-dark hover:bg-[#0c6634]"
          )}
        >
          <span className="flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            One-Click Apply
          </span>
          {applyDisabled && (
            <span className="text-[10px] font-normal">Add CV in Profile</span>
          )}
        </button>
      ) : (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActionButton icon={List} title="View Details" subtitle="See full job description" />
        <ActionButton icon={Sparkles} title="Ask AI" subtitle="Ask about this role" />
        <ActionButton icon={Users} title="Find Recruiter" subtitle="Connect with hiring team" />
        <button
          onClick={applyDisabled ? undefined : onApply}
          disabled={applyDisabled}
          title={applyDisabled ? "Upload your CV on Profile first" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-left shadow-sm transition-colors",
            applyDisabled
              ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
              : "bg-brand-dark text-white hover:bg-[#0c6634]"
          )}
        >
          <Rocket className="h-5 w-5 shrink-0" />
          <span>
            <span className="block text-sm font-semibold">One-Click Apply</span>
            <span className={cn("block text-xs", applyDisabled ? "text-zinc-400" : "text-white/80")}>
              {applyDisabled ? "Add CV in Profile first" : "AI will generate your application"}
            </span>
          </span>
        </button>
      </div>
      )}

      {/* Footer note */}
      {(large || !compact) && (
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
        <Shield className="h-3.5 w-3.5 text-brand" />
        Visavi only shows jobs from companies with active sponsor licences.
      </div>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  level,
}: {
  label: string;
  value: number;
  level: ConfidenceLevel;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="text-xl font-bold text-zinc-900">{value}%</span>
        <span
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
            levelClasses(level)
          )}
        >
          <TrendingUp className={cn("h-3 w-3", levelArrowColor(level))} />
          {level}
        </span>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}) {
  return (
    <button className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:bg-zinc-50">
      <Icon className="h-5 w-5 shrink-0 text-zinc-500" />
      <span>
        <span className="block text-sm font-semibold text-zinc-900">
          {title}
        </span>
        <span className="block text-xs text-zinc-500">{subtitle}</span>
      </span>
    </button>
  );
}

export function JobCard({ variant = "compact", ...props }: JobCardProps) {
  if (variant === "full") {
    return <FullCard {...props} />;
  }
  return <CompactCard {...props} />;
}
