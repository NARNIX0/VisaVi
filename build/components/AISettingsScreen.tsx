"use client";

import { useState } from "react";
import {
  Sparkles,
  Coins,
  Check,
  Crown,
  FileText,
  Mic,
  Target,
  Sliders,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import {
  PRO_PLAN,
  FREE_PLAN,
  CREDIT_COSTS,
  purchaseProPlan,
} from "@/lib/solvimon";

type WritingStyle = "professional" | "enthusiastic" | "concise";
type InterviewDifficulty = "easy" | "medium" | "hard";

export function AISettingsScreen() {
  const credits = useCredits((s) => s.credits);
  const isPro = useCredits((s) => s.isPro);
  const add = useCredits((s) => s.add);
  const setPro = useCredits((s) => s.setPro);
  const openUpgrade = useUpgradeModal((s) => s.openModal);

  const [writingStyle, setWritingStyle] = useState<WritingStyle>("professional");
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);
  const [interviewDifficulty, setInterviewDifficulty] =
    useState<InterviewDifficulty>("medium");
  const [minMatchScore, setMinMatchScore] = useState(70);
  const [sponsorshipOnly, setSponsorshipOnly] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeDone, setUpgradeDone] = useState(false);

  async function handleUpgrade() {
    setUpgrading(true);
    const { credits: added } = await purchaseProPlan();
    add(added);
    setPro(true);
    setUpgrading(false);
    setUpgradeDone(true);
    setTimeout(() => setUpgradeDone(false), 3000);
  }

  const currentPlan = isPro ? PRO_PLAN : FREE_PLAN;

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          AI Settings
        </h1>
        <p className="mt-1 text-zinc-500">
          Manage your subscription and how Visavi&apos;s AI works for you.
        </p>
      </div>

      {/* Current plan */}
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="bg-gradient-to-br from-[#18BE5C] to-[#11A04E] p-5 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {isPro ? (
                  <Crown className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                <h2 className="text-lg font-bold">{currentPlan.name} Plan</h2>
              </div>
              <p className="mt-1 text-sm text-white/85">
                {isPro
                  ? "You have full access to all AI features."
                  : "Upgrade to unlock unlimited AI applications and interviews."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentPlan.price}</p>
              {!isPro && (
                <p className="text-xs text-white/75">per month</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-mint px-4 py-3">
              <Coins className="h-5 w-5 text-brand" />
              <div>
                <p className="text-xs text-zinc-500">Credit balance</p>
                <p className="text-xl font-bold text-zinc-900">{credits}</p>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-xs text-zinc-400">One-Click Apply</p>
                <p className="font-semibold text-zinc-800">
                  {CREDIT_COSTS.oneClickApply} credits
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Mock Interview</p>
                <p className="font-semibold text-zinc-800">
                  {CREDIT_COSTS.mockInterview} credit
                </p>
              </div>
            </div>
          </div>

          {!isPro && (
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-dark py-3 text-sm font-semibold text-white hover:bg-[#0c6634] disabled:opacity-60 sm:w-auto sm:px-8"
            >
              {upgrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Pro — {PRO_PLAN.price}
                </>
              )}
            </button>
          )}

          {upgradeDone && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-mint px-3 py-2 text-sm font-medium text-brand-dark">
              <CheckCircle2 className="h-4 w-4" />
              Upgraded! {PRO_PLAN.credits} credits added to your balance.
            </div>
          )}
        </div>
      </div>

      {/* Plan comparison */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {[FREE_PLAN, PRO_PLAN].map((plan) => {
          const active = plan.name === currentPlan.name;
          return (
            <div
              key={plan.name}
              className={`rounded-xl border p-5 ${
                active
                  ? "border-brand bg-mint/30"
                  : "border-zinc-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-zinc-900">
                  {plan.name}
                </h3>
                {active && (
                  <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">
                    Current
                  </span>
                )}
              </div>
              <p className="mt-1 text-2xl font-bold text-zinc-900">
                {plan.price}
                {plan.name === "Visavi Pro" && plan.price.includes("/") === false && (
                  <span className="text-sm font-normal text-zinc-500">/mo</span>
                )}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-center gap-2 text-sm text-zinc-600"
                  >
                    <Check className="h-4 w-4 shrink-0 text-brand" />
                    {perk}
                  </li>
                ))}
              </ul>
              {!active && plan.name === "Visavi Pro" && (
                <button
                  onClick={() => openUpgrade()}
                  className="mt-4 w-full rounded-lg border border-brand bg-white py-2 text-sm font-semibold text-brand-dark hover:bg-mint"
                >
                  Upgrade
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI preferences */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
          <Sliders className="h-4 w-4 text-brand" />
          AI Preferences
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          These settings affect One-Click Apply, match scoring and mock
          interviews.
        </p>

        <div className="mt-5 space-y-6">
          {/* Writing style */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <FileText className="h-4 w-4 text-zinc-400" />
              Application writing style
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["professional", "Professional"],
                  ["enthusiastic", "Enthusiastic"],
                  ["concise", "Concise"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setWritingStyle(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    writingStyle === value
                      ? "bg-brand text-white"
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  Include personalised cover letter
                </p>
                <p className="text-xs text-zinc-500">
                  Adds a tailored intro when using One-Click Apply
                </p>
              </div>
              <button
                role="switch"
                aria-checked={includeCoverLetter}
                onClick={() => setIncludeCoverLetter((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  includeCoverLetter ? "bg-brand" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    includeCoverLetter ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>

            <label className="flex cursor-pointer items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-700">
                  Sponsorship-only jobs
                </p>
                <p className="text-xs text-zinc-500">
                  Hide roles without an active UK sponsor licence
                </p>
              </div>
              <button
                role="switch"
                aria-checked={sponsorshipOnly}
                onClick={() => setSponsorshipOnly((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  sponsorshipOnly ? "bg-brand" : "bg-zinc-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    sponsorshipOnly ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Interview difficulty */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Mic className="h-4 w-4 text-zinc-400" />
              Mock interview difficulty
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["easy", "Easy"],
                  ["medium", "Medium"],
                  ["hard", "Hard"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setInterviewDifficulty(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    interviewDifficulty === value
                      ? "bg-brand text-white"
                      : "border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Min match score */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                <Target className="h-4 w-4 text-zinc-400" />
                Minimum match score
              </div>
              <span className="text-sm font-bold text-brand-dark">
                {minMatchScore}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="mt-2 w-full accent-brand"
            />
            <div className="mt-1 flex justify-between text-[11px] text-zinc-400">
              <span>50%</span>
              <span>95%</span>
            </div>
          </div>
        </div>

        <p className="mt-5 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
          Preferences are saved locally for this demo session.
        </p>
      </div>
    </div>
  );
}
