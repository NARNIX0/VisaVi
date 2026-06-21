"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Search,
  Filter,
  Plus,
  Inbox,
  Send,
  Clock,
  Calendar,
  Trophy,
  XCircle,
  Bookmark,
  ClipboardList,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Application, ApplicationStatus } from "@/types";
import { getJobById } from "@/data/jobs";
import { JobCard } from "@/components/JobCard";
import { useAppStore } from "@/hooks/useAppStore";

type Board = Record<ApplicationStatus, Application[]>;

interface ColumnConfig {
  status: ApplicationStatus;
  icon: LucideIcon;
  headerBg: string;
  headerText: string;
  columnBg: string;
  accent: string;
}

const columns: ColumnConfig[] = [
  {
    status: "Saved",
    icon: Bookmark,
    headerBg: "bg-zinc-100",
    headerText: "text-zinc-600",
    columnBg: "bg-zinc-50",
    accent: "#9CA3AF",
  },
  {
    status: "Applied",
    icon: Send,
    headerBg: "bg-blue-100",
    headerText: "text-blue-600",
    columnBg: "bg-blue-50/50",
    accent: "#3B82F6",
  },
  {
    status: "Assessment",
    icon: ClipboardList,
    headerBg: "bg-amber-100",
    headerText: "text-amber-600",
    columnBg: "bg-amber-50/50",
    accent: "#F59E0B",
  },
  {
    status: "Interview",
    icon: Calendar,
    headerBg: "bg-purple-100",
    headerText: "text-purple-600",
    columnBg: "bg-purple-50/50",
    accent: "#A855F7",
  },
  {
    status: "Offer",
    icon: Trophy,
    headerBg: "bg-green-100",
    headerText: "text-green-600",
    columnBg: "bg-green-50/50",
    accent: "#22C55E",
  },
  {
    status: "Rejected",
    icon: XCircle,
    headerBg: "bg-red-100",
    headerText: "text-red-500",
    columnBg: "bg-red-50/50",
    accent: "#EF4444",
  },
];

const statusOrder = columns.map((c) => c.status);

function groupByStatus(apps: Application[]): Board {
  const board = {
    Saved: [],
    Applied: [],
    Assessment: [],
    Interview: [],
    Offer: [],
    Rejected: [],
  } as Board;
  for (const app of apps) board[app.status].push(app);
  return board;
}

function relative(iso: string) {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

/** Status-specific footer shown under each card. */
function CardFooter({ app }: { app: Application }) {
  switch (app.status) {
    case "Saved":
      return <>Saved {relative(app.updatedAt)}</>;
    case "Applied":
      return <>Applied {relative(app.updatedAt)}</>;
    case "Assessment":
      return app.dueDate ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
          <Clock className="h-3 w-3" />
          Due {formatDistanceToNow(new Date(app.dueDate))}
        </span>
      ) : (
        <>In assessment</>
      );
    case "Interview":
      return app.interviewAt ? (
        <span className="font-medium text-purple-600">
          {format(new Date(app.interviewAt), "MMM d • h:mm a")}
        </span>
      ) : (
        <>Interview scheduled</>
      );
    case "Offer":
      return <span className="font-medium text-green-600">Offer received</span>;
    case "Rejected":
      return <>Rejected {relative(app.updatedAt)}</>;
    default:
      return null;
  }
}

export function ApplicationsBoard() {
  const applications = useAppStore((s) => s.applications);
  const reorderApplications = useAppStore((s) => s.reorderApplications);
  const addRandomApplication = useAppStore((s) => s.addRandomApplication);

  const [board, setBoard] = useState<Board>(() =>
    groupByStatus(applications)
  );
  const [query, setQuery] = useState("");
  const [showTip, setShowTip] = useState(true);

  // Sync board when shared store changes (e.g. apply from Review).
  useEffect(() => {
    setBoard(groupByStatus(applications));
  }, [applications]);

  const total = statusOrder.reduce((sum, s) => sum + board[s].length, 0);

  const summary: { label: string; value: number; icon: LucideIcon; color: string }[] =
    [
      { label: "All Applications", value: total, icon: Inbox, color: "#22C55E" },
      { label: "Applied", value: board.Applied.length, icon: Send, color: "#3B82F6" },
      { label: "In Progress", value: board.Assessment.length, icon: Clock, color: "#F59E0B" },
      { label: "Interview", value: board.Interview.length, icon: Calendar, color: "#A855F7" },
      { label: "Offer", value: board.Offer.length, icon: Trophy, color: "#22C55E" },
      { label: "Rejected", value: board.Rejected.length, icon: XCircle, color: "#EF4444" },
    ];

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;

    const from = source.droppableId as ApplicationStatus;
    const to = destination.droppableId as ApplicationStatus;
    if (from === to && source.index === destination.index) return;

    setBoard((prev) => {
      const next: Board = { ...prev };
      const sourceList = Array.from(prev[from]);
      const [moved] = sourceList.splice(source.index, 1);

      if (from === to) {
        sourceList.splice(destination.index, 0, moved);
        next[from] = sourceList;
      } else {
        const destList = Array.from(prev[to]);
        const updated = { ...moved, status: to, updatedAt: new Date().toISOString() };
        destList.splice(destination.index, 0, updated);
        next[from] = sourceList;
        next[to] = destList;
      }
      return next;
    });

    reorderApplications(from, to, source.index, destination.index);
  }

  function addApplication(status: ApplicationStatus) {
    addRandomApplication(status);
  }

  const matches = (app: Application) =>
    !query ||
    `${app.company} ${app.role} ${app.location}`
      .toLowerCase()
      .includes(query.toLowerCase());

  const visibleTotal = statusOrder.reduce(
    (sum, s) => sum + board[s].filter(matches).length,
    0
  );
  const noResults = query.length > 0 && visibleTotal === 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            My Applications
          </h1>
          <p className="mt-1 text-zinc-500">
            Track and manage your job applications in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search applications..."
              className="w-56 rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 outline-none focus:border-brand"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button
            onClick={() => addApplication("Saved")}
            className="flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summary.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div>
                <p className="text-xs text-zinc-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  {card.value}
                </p>
              </div>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${card.color}1A`, color: card.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          );
        })}
      </div>

      {/* Empty search state */}
      {noResults && (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <Search className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            No applications match “{query}”
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different company, role or location.
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Kanban board */}
      <div className={`mt-6 overflow-x-auto pb-2 ${noResults ? "hidden" : ""}`}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid min-w-[920px] grid-cols-6 gap-3">
            {columns.map((col) => {
              const Icon = col.icon;
              const items = board[col.status];
              const visible = items.filter(matches);
              return (
                <div
                  key={col.status}
                  className={`flex flex-col rounded-xl ${col.columnBg} p-2`}
                >
                  {/* Column header */}
                  <div
                    className={`mb-2 flex items-center justify-between rounded-lg ${col.headerBg} px-2.5 py-1.5`}
                  >
                    <span
                      className={`flex items-center gap-1.5 text-sm font-semibold ${col.headerText}`}
                    >
                      <Icon className="h-4 w-4" />
                      {col.status}
                    </span>
                    <span
                      className={`rounded-full bg-white px-2 text-xs font-semibold ${col.headerText}`}
                    >
                      {items.length}
                    </span>
                  </div>

                  {/* Droppable card list */}
                  <Droppable droppableId={col.status}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex min-h-[60px] flex-1 flex-col gap-2"
                      >
                        {visible.map((app, index) => {
                          const job = getJobById(app.jobId);
                          if (!job) return null;
                          return (
                            <Draggable
                              key={app.id}
                              draggableId={app.id}
                              index={index}
                            >
                              {(p) => (
                                <div
                                  ref={p.innerRef}
                                  {...p.draggableProps}
                                  {...p.dragHandleProps}
                                >
                                  <JobCard
                                    job={job}
                                    variant="compact"
                                    accentColor={col.accent}
                                    footer={<CardFooter app={app} />}
                                  />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* Add application */}
                  <button
                    onClick={() => addApplication(col.status)}
                    className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 py-2 text-xs font-medium text-zinc-500 hover:bg-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add application
                  </button>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {/* AI Tip bar */}
      {showTip && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand/40 bg-mint px-4 py-3">
          <Sparkles className="h-5 w-5 shrink-0 text-brand" />
          <p className="flex-1 text-sm text-zinc-700">
            <span className="font-semibold">AI Tip:</span> Move applications
            forward as you progress. Visavi will remind you of next steps and
            upcoming deadlines.
          </p>
          <button className="flex items-center gap-1 text-sm font-medium text-brand-dark hover:underline">
            Learn more
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setShowTip(false)}
            aria-label="Dismiss tip"
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
