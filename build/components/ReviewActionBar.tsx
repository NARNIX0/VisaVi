"use client";

import { useState } from "react";
import { X, Star, Send, Sparkles } from "lucide-react";
import type { Job } from "@/types";
import { OneClickApplyModal } from "@/components/OneClickApplyModal";
import { useAppStore, hasProfileCv } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";

export function ReviewActionBar({ job }: { job: Job }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const profile = useAppStore((s) => s.profile);
  const canApply = hasProfileCv(profile);

  return (
    <>
      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-zinc-200 bg-white px-6 py-3">
        <button className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50">
          <X className="h-4 w-4" />
          Reject
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
          <Star className="h-4 w-4" />
          Save for later
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
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
          <span className="text-left">
            One-Click Apply
            <span className={cn("ml-2 font-normal", canApply ? "text-white/80" : "text-zinc-400")}>
              {canApply ? "AI will generate your application" : "Add CV in Profile first"}
            </span>
          </span>
        </button>
      </div>

      <OneClickApplyModal
        job={job}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
      />
    </>
  );
}
