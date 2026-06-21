"use client";

import { useEffect, useState } from "react";
import { X, Loader2, FileText } from "lucide-react";
import type { Job } from "@/types";
import { generateTailoredCv } from "@/lib/client-ai";
import { useAppStore } from "@/hooks/useAppStore";

export function TailoredCvModal({
  job,
  open,
  onClose,
}: {
  job: Job | null;
  open: boolean;
  onClose: () => void;
}) {
  const cv = useAppStore((s) => s.profile.baseCv);
  const [cvText, setCvText] = useState("");
  const [changes, setChanges] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !job) return;
    setLoading(true);
    generateTailoredCv(job, cv)
      .then(({ text, changes: c }) => {
        setCvText(text);
        setChanges(c ?? "");
      })
      .catch(() => {
        setCvText(cv);
        setChanges("Could not reach AI — showing base CV.");
      })
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
            <FileText className="h-5 w-5 text-brand" />
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Tailored CV</h2>
              <p className="text-xs text-zinc-500">{job.company} — {job.title}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : (
            <>
              <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-sans text-xs text-zinc-700">
                {cvText}
              </pre>
              {changes && (
                <div className="mt-4 rounded-lg bg-mint p-3">
                  <p className="text-xs font-semibold text-brand-dark">AI changes</p>
                  <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-600">
                    {changes}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
