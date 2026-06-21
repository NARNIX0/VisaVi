"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  Loader2,
  Coins,
  CheckCircle2,
  Pencil,
  AlertTriangle,
  FileText,
} from "lucide-react";
import type { Job } from "@/types";
import { useCredits, APPLY_COST } from "@/hooks/useCredits";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useAppStore } from "@/hooks/useAppStore";
import { generateApplicationText, generateTailoredCv } from "@/lib/client-ai";
import { currentUser } from "@/data/user";
import { cn } from "@/lib/utils";

interface OneClickApplyModalProps {
  job: Job | null;
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  showSuccessStep?: boolean;
}

type Status = "generating" | "preview" | "submitted";
type PreviewTab = "cover" | "cv";

function fallbackApplication(job: Job): string {
  return `Dear ${job.company} Hiring Team,

I am writing to express my interest in the ${job.title} position. My background aligns with your requirements in ${job.requirements.join(", ")}.

Kind regards,
${currentUser.name}`;
}

export function OneClickApplyModal({
  job,
  open,
  onClose,
  onSubmitted,
  showSuccessStep = true,
}: OneClickApplyModalProps) {
  const credits = useCredits((s) => s.credits);
  const spend = useCredits((s) => s.spend);
  const openUpgrade = useUpgradeModal((s) => s.openModal);
  const cv = useAppStore((s) => s.profile.baseCv);

  const [status, setStatus] = useState<Status>("generating");
  const [tab, setTab] = useState<PreviewTab>("cover");
  const [coverLetter, setCoverLetter] = useState("");
  const [tailoredCv, setTailoredCv] = useState("");
  const [cvChanges, setCvChanges] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!open || !job || !cv.trim()) return;
    setStatus("generating");
    setEditing(false);
    setTab("cover");

    Promise.all([
      generateApplicationText(job, cv).catch(() => fallbackApplication(job)),
      generateTailoredCv(job, cv).catch(() => ({
        text: cv,
        changes: "Could not reach AI — showing base CV.",
      })),
    ])
      .then(([letter, tailored]) => {
        setCoverLetter(letter);
        setTailoredCv(tailored.text);
        setCvChanges(tailored.changes ?? "");
      })
      .finally(() => setStatus("preview"));
  }, [open, job, cv]);

  if (!open || !job) return null;

  const enoughCredits = credits >= APPLY_COST;
  const activeText = tab === "cover" ? coverLetter : tailoredCv;
  const setActiveText = tab === "cover" ? setCoverLetter : setTailoredCv;

  function handleConfirm() {
    if (!spend(APPLY_COST)) return;
    setStatus("submitted");
    onSubmitted?.();
  }

  function handleDone() {
    onClose();
    setTimeout(() => setStatus("generating"), 200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-zinc-100 p-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint text-brand">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">One-Click Apply</h2>
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
          <div className="mb-4 flex items-center justify-between rounded-xl bg-mint px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-brand-dark">
              <Coins className="h-4 w-4" />
              Cost: {APPLY_COST} credits
            </span>
            <span className="text-sm text-zinc-600">
              Balance: <span className="font-semibold">{credits}</span>
            </span>
          </div>

          {status === "generating" && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
              <p className="text-sm text-zinc-600">
                AI is generating your cover letter and tailored CV…
              </p>
            </div>
          )}

          {status === "preview" && (
            <div>
              <div className="mb-3 flex gap-2">
                <button
                  onClick={() => { setTab("cover"); setEditing(false); }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
                    tab === "cover"
                      ? "bg-brand-dark text-white"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Cover Letter
                </button>
                <button
                  onClick={() => { setTab("cv"); setEditing(false); }}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold",
                    tab === "cv"
                      ? "bg-brand-dark text-white"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Tailored CV
                </button>
              </div>

              <p className="mb-2 text-sm font-semibold text-zinc-800">
                {tab === "cover" ? "Cover Letter" : "Tailored CV"}
              </p>
              {editing ? (
                <textarea
                  value={activeText}
                  onChange={(e) => setActiveText(e.target.value)}
                  rows={12}
                  className="w-full resize-none rounded-lg border border-zinc-200 p-3 text-sm outline-none focus:border-brand"
                />
              ) : (
                <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                  {activeText}
                </div>
              )}

              {tab === "cv" && cvChanges && !editing && (
                <div className="mt-3 rounded-lg bg-mint p-3">
                  <p className="text-xs font-semibold text-brand-dark">AI changes</p>
                  <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-600">
                    {cvChanges}
                  </p>
                </div>
              )}

              {!enoughCredits && (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 text-xs text-orange-600">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Not enough credits.
                  </span>
                  <button
                    onClick={() => { onClose(); openUpgrade(); }}
                    className="rounded-md bg-orange-600 px-2 py-1 font-semibold text-white"
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>
          )}

          {status === "submitted" && showSuccessStep && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-brand" />
              <p className="font-semibold text-zinc-900">Application submitted!</p>
              <p className="text-sm text-zinc-500">
                {APPLY_COST} credits used for {job.company}.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 p-5">
          {status === "preview" && (
            <>
              <button
                onClick={() => setEditing((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700"
              >
                <Pencil className="h-4 w-4" />
                {editing ? "Done" : "Edit"}
              </button>
              <button
                onClick={handleConfirm}
                disabled={!enoughCredits}
                className="flex items-center gap-2 rounded-lg bg-brand-dark px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                Confirm &amp; Apply
              </button>
            </>
          )}
          {status === "generating" && (
            <button onClick={onClose} className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-zinc-700">
              Cancel
            </button>
          )}
          {status === "submitted" && showSuccessStep && (
            <button onClick={handleDone} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
