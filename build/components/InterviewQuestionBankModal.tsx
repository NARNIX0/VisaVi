"use client";

import { useEffect, useState } from "react";
import { X, Loader2, ListChecks, RefreshCw, ExternalLink } from "lucide-react";
import type { Job } from "@/types";
import { generateInterviewQuestions, type InterviewQuestion } from "@/lib/client-ai";

const SOURCE_STYLES: Record<string, string> = {
  Glassdoor: "bg-emerald-100 text-emerald-700",
  Reddit: "bg-orange-100 text-orange-700",
  LinkedIn: "bg-blue-100 text-blue-700",
  Blind: "bg-purple-100 text-purple-700",
  Indeed: "bg-amber-100 text-amber-700",
};

export function InterviewQuestionBankModal({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!open) {
      setGenerated(false);
      setQuestions([]);
      setError("");
    }
  }, [open]);

  if (!open || !job) return null;

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const result = await generateInterviewQuestions(job!);
      setQuestions(result);
      setGenerated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-100 p-5">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-brand" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Question Bank</h2>
              <p className="text-xs text-zinc-500">
                {job.title} at {job.company}
              </p>
            </div>
          </div>
          <button onClick={handleClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-zinc-600">
            Questions synthesised from public candidate reports on{" "}
            <span className="font-medium">Glassdoor</span>,{" "}
            <span className="font-medium">Reddit</span>,{" "}
            <span className="font-medium">LinkedIn</span>,{" "}
            <span className="font-medium">Blind</span> and similar sources.
          </p>

          {!generated && !loading && (
            <button
              onClick={handleGenerate}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              <ExternalLink className="h-4 w-4" />
              Generate Question Bank
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center gap-2 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-zinc-500">Pulling questions from online sources…</p>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          {generated && questions.length > 0 && (
            <div className="mt-4 space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 p-3">
                  <p className="text-sm font-medium text-zinc-800">{q.question}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
                      {q.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        SOURCE_STYLES[q.source] ?? "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      via {q.source}
                    </span>
                    <span className="text-[11px] text-zinc-400">{q.frequency}</span>
                  </div>
                  {q.tip && (
                    <p className="mt-2 text-xs text-zinc-500">{q.tip}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {generated && (
          <div className="border-t border-zinc-100 p-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
