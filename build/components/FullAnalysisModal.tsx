"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Sparkles } from "lucide-react";
import type { Job } from "@/types";
import { generateFullAnalysis } from "@/lib/client-ai";
import { useAppStore } from "@/hooks/useAppStore";

export function FullAnalysisModal({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  const cv = useAppStore((s) => s.profile.baseCv);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !job) return;
    setLoading(true);
    setError("");
    generateFullAnalysis(job, cv)
      .then(setText)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, job, cv]);

  if (!open || !job) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-100 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Full AI Analysis</h2>
              <p className="text-xs text-zinc-500">
                {job.title} at {job.company}
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex flex-col items-center gap-2 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-zinc-500">Analysing your fit…</p>
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {!loading && text && (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
