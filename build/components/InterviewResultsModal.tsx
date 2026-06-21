"use client";

import { useEffect, useState } from "react";
import { X, Loader2, BarChart3 } from "lucide-react";
import type { Job, InterviewMetrics } from "@/types";
import { generateInterviewResults } from "@/lib/client-ai";

interface ChatMsg {
  sender: "ai" | "user";
  text: string;
}

export function InterviewResultsModal({
  job,
  open,
  onClose,
  transcript,
  metrics,
  durationSeconds,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  transcript: ChatMsg[];
  metrics: InterviewMetrics;
  durationSeconds: number;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !job) return;
    setLoading(true);
    setError("");
    setText("");
    generateInterviewResults(job, {
      transcript,
      metrics,
      durationSeconds,
    })
      .then(setText)
      .catch((e) => setError(e instanceof Error ? e.message : "Analysis failed"))
      .finally(() => setLoading(false));
    // Fetch once when the modal opens; snapshot uses current session data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, job]);

  if (!open || !job) return null;

  const hasTranscript = transcript.length > 0;

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
            <BarChart3 className="h-5 w-5 text-brand" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Interview Analysis</h2>
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
          {!hasTranscript && !loading && (
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Start a mock interview first — analysis will be limited until you answer some questions.
            </p>
          )}
          {loading && (
            <div className="flex flex-col items-center gap-2 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-zinc-500">Analysing your session…</p>
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
