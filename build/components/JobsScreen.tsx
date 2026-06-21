"use client";

import { useCallback, useState } from "react";
import { Sparkles, Inbox } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/JobCard";
import { OneClickApplyModal } from "@/components/OneClickApplyModal";
import { JobDetailsModal } from "@/components/JobDetailsModal";
import { SwipeableJobCard } from "@/components/SwipeableJobCard";
import { useAppStore, TOTAL_JOBS, hasProfileCv } from "@/hooks/useAppStore";

const SWIPE_TINT_RANGE = 140;

export function JobsScreen() {
  const job = useAppStore((s) => s.getDiscoverJob());
  const nextJob = useAppStore((s) => s.getNextDiscoverJob());
  const passJob = useAppStore((s) => s.passJob);
  const saveJob = useAppStore((s) => s.saveJob);
  const passedCount = useAppStore((s) => s.passedJobIds.length);
  const profile = useAppStore((s) => s.profile);
  const reviewCount = useAppStore((s) => s.reviewQueue.length);
  const canApply = hasProfileCv(profile);

  const [applyOpen, setApplyOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleDragChange = useCallback((x: number) => setDragX(x), []);

  const remaining = TOTAL_JOBS - passedCount;

  const saveTint = Math.min(1, Math.max(0, dragX / SWIPE_TINT_RANGE));
  const passTint = Math.min(1, Math.max(0, -dragX / SWIPE_TINT_RANGE));
  const reveal = Math.min(1, Math.abs(dragX) / SWIPE_TINT_RANGE);
  const underScale = 0.92 + reveal * 0.06;
  const underOffset = 16 - reveal * 10;

  return (
    <div className="relative flex min-h-full flex-col">
      {/* Page-wide swipe colour feedback */}
      <div
        className="pointer-events-none absolute inset-0 bg-emerald-400 transition-opacity duration-75"
        style={{ opacity: saveTint * 0.45 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-red-400 transition-opacity duration-75"
        style={{ opacity: passTint * 0.45 }}
        aria-hidden
      />

      <div className="relative shrink-0 px-[10vmin] pt-6 pb-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Discover Jobs
            </h1>
            <p className="mt-1 text-zinc-500">
              Swipe or tap Pass / Save. Saved roles go to Review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-sm font-medium text-brand-dark">
              <Sparkles className="h-4 w-4" />
              {remaining} matches left
            </span>
            {reviewCount > 0 && (
              <Link
                href="/review"
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-white px-3 py-1.5 text-sm font-medium text-brand-dark hover:bg-mint"
              >
                {reviewCount} to review →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-[10vmin] py-[5vmin]">
        {job ? (
          <div className="relative h-full w-full max-h-[min(72vh,calc(100vh-12rem))] max-w-[min(80vw,56rem)]">
            {nextJob && (
              <div
                className="pointer-events-none absolute inset-0 z-0 origin-top transition-transform duration-75"
                style={{
                  transform: `scale(${underScale}) translateY(${underOffset}px)`,
                  opacity: 0.55 + reveal * 0.4,
                }}
                aria-hidden
              >
                <JobCard
                  job={nextJob}
                  variant="full"
                  discoverMode
                  className="h-full shadow-md"
                />
              </div>
            )}

            <SwipeableJobCard
              cardKey={job.id}
              onSwipeLeft={() => passJob(job.id)}
              onSwipeRight={() => saveJob(job.id)}
              onDragChange={handleDragChange}
              className="relative z-10 h-full"
            >
              <JobCard
                job={job}
                variant="full"
                discoverMode
                className="h-full shadow-xl"
                onPass={() => passJob(job.id)}
                onSave={() => saveJob(job.id)}
                onApply={() => setApplyOpen(true)}
                onViewDetails={() => setDetailsOpen(true)}
                applyDisabled={!canApply}
              />
            </SwipeableJobCard>
          </div>
        ) : (
          <div className="relative z-10 flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
            <Inbox className="h-12 w-12 text-zinc-300" />
            <p className="mt-3 font-semibold text-zinc-700">
              No more jobs in your queue
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Check Review or Applications for saved roles.
            </p>
            <Link
              href="/review"
              className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Go to Review
            </Link>
          </div>
        )}
      </div>

      {job && (
        <>
          <OneClickApplyModal
            job={job}
            open={applyOpen}
            onClose={() => setApplyOpen(false)}
            onSubmitted={() => {
              useAppStore.getState().applyJob(job.id);
              setApplyOpen(false);
            }}
          />
          <JobDetailsModal
            job={job}
            open={detailsOpen}
            onClose={() => setDetailsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
