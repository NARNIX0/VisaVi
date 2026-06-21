"use client";

import { CheckCircle2 } from "lucide-react";

export function ApplySuccessSplash({
  company,
  onDone,
}: {
  company: string;
  onDone: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-brand/95 p-6">
      <div className="max-w-sm text-center text-white">
        <CheckCircle2 className="mx-auto h-16 w-16" />
        <h2 className="mt-4 text-2xl font-bold">Application sent!</h2>
        <p className="mt-2 text-white/90">
          Your application to {company} has been submitted.
        </p>
        <button
          onClick={onDone}
          className="mt-8 w-full rounded-xl bg-white py-3 text-sm font-semibold text-brand-dark hover:bg-zinc-100"
        >
          Next job to review →
        </button>
      </div>
    </div>
  );
}
