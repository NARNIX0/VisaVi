"use client";

import { useState } from "react";
import { X, Sparkles, Check, Loader2, CheckCircle2 } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { PRO_PLAN, purchaseProPlan } from "@/lib/solvimon";

export function UpgradeModal() {
  const open = useUpgradeModal((s) => s.open);
  const closeModal = useUpgradeModal((s) => s.closeModal);
  const add = useCredits((s) => s.add);
  const setPro = useCredits((s) => s.setPro);

  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  if (!open) return null;

  function handleClose() {
    closeModal();
    // Reset for next time the modal opens.
    setTimeout(() => setStatus("idle"), 200);
  }

  async function handleUpgrade() {
    setStatus("processing");
    const { credits } = await purchaseProPlan();
    add(credits);
    setPro(true);
    setStatus("done");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#18BE5C] to-[#11A04E] p-6 text-white">
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-bold">{PRO_PLAN.name}</h2>
          </div>
          <p className="mt-1 text-sm text-white/85">
            Unlock the full power of Visavi.
          </p>
          <p className="mt-4 text-3xl font-bold">{PRO_PLAN.price}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === "done" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-brand" />
              <p className="text-base font-semibold text-zinc-900">
                You&apos;re now on Pro!
              </p>
              <p className="text-sm text-zinc-500">
                {PRO_PLAN.credits} credits have been added to your balance.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {PRO_PLAN.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint text-brand">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-zinc-700">{perk}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          {status === "done" ? (
            <button
              onClick={handleClose}
              className="w-full rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Done
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={status === "processing"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-3 text-sm font-semibold text-white hover:bg-[#0c6634] disabled:opacity-60"
            >
              {status === "processing" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
