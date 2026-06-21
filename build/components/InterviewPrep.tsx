"use client";

import { useEffect, useState } from "react";
import {
  Lightbulb,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Trophy,
  Calendar,
  Bot,
  ShieldCheck,
  Play,
  Square,
  ListChecks,
  BarChart3,
  MessageCircle,
  Smile,
  Target,
  Code2,
  type LucideIcon,
} from "lucide-react";
import type { InterviewMetrics } from "@/types";
import { useCredits, MOCK_INTERVIEW_COST } from "@/hooks/useCredits";
import { useUpgradeModal } from "@/hooks/useUpgradeModal";
import { useAppStore } from "@/hooks/useAppStore";
import { getJobById } from "@/data/jobs";
import { sendChat } from "@/lib/client-ai";
import { format } from "date-fns";
import { InterviewResultsModal } from "@/components/InterviewResultsModal";
import { InterviewQuestionBankModal } from "@/components/InterviewQuestionBankModal";
import {
  liveMetrics,
  aiSuggestions,
} from "@/data/interviews";

interface ChatMsg {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const steps: { icon: LucideIcon; title: string; subtitle: string }[] = [
  { icon: BookOpen, title: "Prepare", subtitle: "Learn about role & company" },
  { icon: MessageSquare, title: "Practice", subtitle: "Mock interviews & Q&A" },
  { icon: TrendingUp, title: "Improve", subtitle: "Get AI feedback & recommendations" },
  { icon: Trophy, title: "Succeed", subtitle: "Ace your interview & get the offer!" },
];

const metricRows: { key: keyof InterviewMetrics; label: string; icon: LucideIcon }[] =
  [
    { key: "communication", label: "Communication", icon: MessageCircle },
    { key: "confidence", label: "Confidence", icon: Smile },
    { key: "structure", label: "Structure", icon: ListChecks },
    { key: "relevance", label: "Relevance", icon: Target },
    { key: "technicalDepth", label: "Technical Depth", icon: Code2 },
  ];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function clampScore(v: number) {
  return Math.max(5, Math.min(10, v));
}

/** Small circular progress ring (for "3/8 Questions"). */
function Ring({
  fraction,
  size = 92,
  stroke = 8,
  children,
}: {
  fraction: number;
  size?: number;
  stroke?: number;
  children: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - fraction);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#16A34A"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-4 ${className}`}>
      {children}
    </div>
  );
}

export function InterviewPrep() {
  const applications = useAppStore((s) => s.applications);
  const spend = useCredits((s) => s.spend);
  const openUpgrade = useUpgradeModal((s) => s.openModal);

  const interviewApps = applications.filter((a) => a.status === "Interview");
  const activeApp = interviewApps[0] ?? applications.find((a) => a.jobId === "job-deloitte");
  const activeJob = activeApp ? getJobById(activeApp.jobId) : getJobById("job-deloitte");

  const [isLive, setIsLive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [scores, setScores] = useState<InterviewMetrics>(liveMetrics);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const totalQuestions = 8;
  const questionsAnswered = chatMessages.filter((m) => m.sender === "user").length;

  const systemPrompt = activeJob
    ? `You are a professional interviewer for ${activeJob.company}, conducting a mock interview for the ${activeJob.title} position. Ask one question at a time. Keep responses concise. After the candidate replies, acknowledge briefly and ask the next question.`
    : "You are a professional job interviewer.";

  async function startInterviewChat() {
    const ts = formatTime(elapsed);
    setChatLoading(true);
    try {
      const reply = await sendChat([
        { role: "system", content: systemPrompt },
        { role: "user", content: "Begin the mock interview with your first question." },
      ]);
      setChatMessages([
        { id: "ai-0", sender: "ai", text: reply, timestamp: ts },
      ]);
    } catch {
      setChatMessages([
        {
          id: "ai-0",
          sender: "ai",
          text: `Welcome! Let's begin your mock interview for ${activeJob?.title ?? "this role"}. Tell me about yourself and why you're interested in this position.`,
          timestamp: ts,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleToggleLive() {
    if (isLive) {
      setIsLive(false);
      return;
    }
    if (spend(MOCK_INTERVIEW_COST)) {
      setIsLive(true);
      if (chatMessages.length === 0) startInterviewChat();
    } else {
      openUpgrade();
    }
  }

  async function sendUserMessage() {
    if (!chatInput.trim() || chatLoading || !isLive) return;
    const ts = formatTime(elapsed);
    const userText = chatInput.trim();
    setChatInput("");
    const next = [
      ...chatMessages,
      { id: `u-${Date.now()}`, sender: "user" as const, text: userText, timestamp: ts },
    ];
    setChatMessages(next);
    setChatLoading(true);
    try {
      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...next.map((m) => ({
          role: m.sender === "ai" ? "assistant" : "user",
          content: m.text,
        })),
      ];
      const reply = await sendChat(apiMessages);
      setChatMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: "ai", text: reply, timestamp: formatTime(elapsed) },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "Thanks for that. Can you give a specific example from your experience?",
          timestamp: formatTime(elapsed),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  // Elapsed timer (counts up) + countdown, both run only while live.
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isLive]);

  // Dynamic live feedback scores.
  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      setScores((prev) => ({
        communication: clampScore(prev.communication + (Math.random() - 0.5) * 0.4),
        confidence: clampScore(prev.confidence + (Math.random() - 0.5) * 0.4),
        structure: clampScore(prev.structure + (Math.random() - 0.5) * 0.4),
        relevance: clampScore(prev.relevance + (Math.random() - 0.5) * 0.4),
        technicalDepth: clampScore(prev.technicalDepth + (Math.random() - 0.5) * 0.4),
      }));
    }, 2500);
    return () => clearInterval(id);
  }, [isLive]);

  const progressFraction = questionsAnswered / totalQuestions;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Interview Prep
          </h1>
          <p className="mt-1 text-zinc-500">
            Practice, get AI feedback and boost your confidence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-zinc-900 text-[10px] font-bold text-white">
            {activeJob?.companyInitials ?? "D."}
            </span>
            {activeJob ? `${activeJob.company} – ${activeJob.title}` : "Select role"}
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Interview Tips
          </button>
        </div>
      </div>

      {/* Stepper */}
      <SectionCard className="mt-5">
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      {i + 1}. {step.title}
                    </p>
                    <p className="text-xs text-zinc-500">{step.subtitle}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="mx-2 h-4 w-4 text-zinc-300" />
                )}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Three columns (stacks on narrow screens, 3 columns on wide) */}
      <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* Column 1: Upcoming Interviews */}
        <SectionCard>
          <h2 className="text-base font-semibold text-zinc-800">
            Upcoming Interviews
          </h2>
          <div className="mt-3 space-y-3">
            {interviewApps.length === 0 ? (
              <p className="text-sm text-zinc-500">No interviews scheduled yet.</p>
            ) : (
              interviewApps.map((app) => {
                const job = getJobById(app.jobId);
                return (
              <div key={app.id} className="rounded-xl border border-zinc-200 p-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: app.logoColor }}
                  >
                    {app.companyInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">{app.company}</p>
                    <p className="truncate text-xs text-zinc-500">{app.role}</p>
                  </div>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-600">Interview</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {app.interviewAt
                    ? format(new Date(app.interviewAt), "MMM d • h:mm a")
                    : "TBD"}
                </div>
                {job && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span>Match Score</span>
                      <span className="font-semibold text-brand-dark">{job.matchScore}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-zinc-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-bright to-brand" style={{ width: `${job.matchScore}%` }} />
                    </div>
                  </div>
                )}
              </div>
                );
              })
            )}
          </div>
          <button className="mt-3 w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            View all applications
          </button>
        </SectionCard>

        {/* Column 2: Mock Interview */}
        <SectionCard className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-800">
                Mock Interview
              </h2>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isLive ? "text-brand" : "text-zinc-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isLive ? "animate-pulse bg-brand" : "bg-zinc-300"
                  }`}
                />
                {isLive ? "Live" : "Paused"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-zinc-700 tabular-nums">
                {formatTime(elapsed)}
              </span>
              <button
                onClick={handleToggleLive}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-white ${
                  isLive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-brand hover:bg-brand-dark"
                }`}
              >
                {isLive ? (
                  <>
                    <Square className="h-3.5 w-3.5" />
                    End
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    Start ({MOCK_INTERVIEW_COST} credit)
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            {chatMessages.length === 0 && !isLive && (
              <p className="text-center text-sm text-zinc-400 py-8">Press Start to begin your mock interview.</p>
            )}
            {chatMessages.map((msg) =>
              msg.sender === "ai" ? (
                <div key={msg.id} className="flex gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Bot className="h-4 w-4" />
                  </span>
                  <div className="max-w-[80%]">
                    <div className="rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-2.5 text-sm text-zinc-700">
                      {msg.text}
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-400">AI Interviewer • {msg.timestamp}</p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex flex-col items-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-violet-100 px-4 py-2.5 text-sm text-zinc-700">
                    {msg.text}
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">You • {msg.timestamp}</p>
                </div>
              )
            )}
            {chatLoading && (
              <p className="text-center text-xs text-zinc-400">AI is thinking…</p>
            )}
          </div>

          {isLive && (
            <div className="mt-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendUserMessage()}
                placeholder="Type your answer…"
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                onClick={sendUserMessage}
                disabled={chatLoading}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          )}

          {/* Test Yourself */}
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-mint p-3">
            <ShieldCheck className="h-6 w-6 shrink-0 text-brand" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-800">
                Test Yourself
              </p>
              <p className="text-xs text-zinc-500">
                Test your knowledge with role-specific questions.
              </p>
            </div>
            <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
              Start Test
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => setQuestionsOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <ListChecks className="h-4 w-4" />
              View Questions
            </button>
            <button
              onClick={() => setResultsOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              <BarChart3 className="h-4 w-4" />
              View Results
            </button>
          </div>
        </SectionCard>

        {/* Column 3: Live Feedback */}
        <SectionCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-800">
              Live Feedback
            </h2>
            <button className="text-xs font-medium text-brand-dark hover:underline">
              View details
            </button>
          </div>

          {/* Score bars */}
          <div className="mt-3 space-y-2.5">
            {metricRows.map(({ key, label, icon: Icon }) => {
              const value = scores[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-600">
                      <Icon className="h-3.5 w-3.5 text-zinc-400" />
                      {label}
                    </span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {value.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-zinc-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-bright to-brand transition-all duration-500"
                      style={{ width: `${value * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interview Progress */}
          <div className="mt-5 border-t border-zinc-100 pt-4">
            <p className="text-sm font-semibold text-zinc-800">
              Interview Progress
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Ring fraction={progressFraction}>
                <span className="text-lg font-bold text-zinc-900">
                  {questionsAnswered}/{totalQuestions}
                </span>
                <span className="text-[10px] text-zinc-500">Questions</span>
              </Ring>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-zinc-500">Estimated time left</p>
                  <p className="font-mono text-lg font-bold text-zinc-900 tabular-nums">
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Difficulty:</span>
                  <span className="text-xs font-semibold text-zinc-700">
                    {activeJob?.recommendation?.interviewLevel ?? "Medium"}
                  </span>
                  <span className="flex gap-0.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                    <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                    <span className="h-2.5 w-2.5 rounded-sm bg-purple-500" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="mt-5 border-t border-zinc-100 pt-4">
            <p className="text-sm font-semibold text-zinc-800">AI Suggestions</p>
            <div className="mt-2 space-y-2">
              {aiSuggestions.map((s) => (
                <div key={s.id} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-zinc-600">{s.text}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
              View suggestion
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </SectionCard>
      </div>

      {activeJob && (
        <>
          <InterviewResultsModal
            job={activeJob}
            open={resultsOpen}
            onClose={() => setResultsOpen(false)}
            transcript={chatMessages}
            metrics={scores}
            durationSeconds={elapsed}
          />
          <InterviewQuestionBankModal
            job={activeJob}
            open={questionsOpen}
            onClose={() => setQuestionsOpen(false)}
          />
        </>
      )}
    </div>
  );
}
