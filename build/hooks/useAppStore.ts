import { create } from "zustand";
import type { Application, ApplicationStatus } from "@/types";
import { jobs, getJobById } from "@/data/jobs";
import { applications as seedApplications } from "@/data/applications";
import { userProfile as seedProfile, normalizeProfileState, type ProfileState } from "@/data/profile";

export type { ProfileState };

function jobIdsByMatch() {
  return [...jobs]
    .sort((a, b) => b.matchScore - a.matchScore)
    .map((j) => j.id);
}

function initialReviewQueue(apps: Application[]) {
  return apps
    .filter((a) => a.status === "Saved")
    .map((a) => a.jobId);
}

function appFromJob(jobId: string, status: ApplicationStatus): Application {
  const job = getJobById(jobId);
  if (!job) throw new Error(`Unknown job ${jobId}`);
  return {
    id: `app-${jobId}-${Date.now()}`,
    jobId: job.id,
    company: job.company,
    companyInitials: job.companyInitials,
    logoColor: job.logoColor,
    role: job.title,
    location: job.location,
    status,
    updatedAt: new Date().toISOString(),
  };
}

interface AppStore {
  applications: Application[];
  /** Jobs still to swipe on Discover (not passed). */
  discoverQueue: string[];
  discoverIndex: number;
  /** Saved jobs awaiting detailed review. */
  reviewQueue: string[];
  reviewIndex: number;
  passedJobIds: string[];
  profile: ProfileState;

  getDiscoverJob: () => ReturnType<typeof getJobById>;
  getNextDiscoverJob: () => ReturnType<typeof getJobById>;
  getReviewJob: () => ReturnType<typeof getJobById>;
  passJob: (jobId: string) => void;
  saveJob: (jobId: string) => void;
  rejectJob: (jobId: string) => void;
  applyJob: (jobId: string) => void;
  nextReview: () => void;
  prevReview: () => void;
  setReviewIndex: (i: number) => void;
  moveApplication: (
    id: string,
    toStatus: ApplicationStatus,
    index?: number
  ) => void;
  reorderApplications: (
    fromStatus: ApplicationStatus,
    toStatus: ApplicationStatus,
    fromIndex: number,
    toIndex: number
  ) => void;
  addRandomApplication: (status: ApplicationStatus) => void;
  updateProfile: (patch: Partial<ProfileState>) => void;
  getUpcomingInterviews: () => Application[];
}

export function hasProfileCv(profile: Pick<ProfileState, "baseCv">): boolean {
  return profile.baseCv.trim().length > 0;
}

export const useAppStore = create<AppStore>((set, get) => ({
  applications: [...seedApplications],
  discoverQueue: jobIdsByMatch(),
  discoverIndex: 0,
  reviewQueue: initialReviewQueue(seedApplications),
  reviewIndex: 0,
  passedJobIds: [],
  profile: normalizeProfileState({ ...seedProfile, baseCv: "" }),

  getDiscoverJob: () => {
    const { discoverQueue, discoverIndex, passedJobIds } = get();
    for (let i = discoverIndex; i < discoverQueue.length; i++) {
      const id = discoverQueue[i];
      if (!passedJobIds.includes(id)) return getJobById(id);
    }
    return undefined;
  },

  getNextDiscoverJob: () => {
    const { discoverQueue, discoverIndex, passedJobIds } = get();
    const currentId = get().getDiscoverJob()?.id;
    let seenCurrent = false;
    for (let i = discoverIndex; i < discoverQueue.length; i++) {
      const id = discoverQueue[i];
      if (passedJobIds.includes(id)) continue;
      if (id === currentId) {
        seenCurrent = true;
        continue;
      }
      if (seenCurrent) return getJobById(id);
    }
    return undefined;
  },

  getReviewJob: () => {
    const { reviewQueue, reviewIndex } = get();
    const id = reviewQueue[reviewIndex];
    return id ? getJobById(id) : undefined;
  },

  passJob: (jobId) => {
    set((s) => ({
      passedJobIds: [...s.passedJobIds, jobId],
      discoverIndex: s.discoverIndex + 1,
      reviewQueue: s.reviewQueue.filter((id) => id !== jobId),
    }));
  },

  saveJob: (jobId) => {
    set((s) => {
      const existing = s.applications.find((a) => a.jobId === jobId);
      let apps = s.applications;
      if (existing) {
        apps = s.applications.map((a) =>
          a.jobId === jobId
            ? { ...a, status: "Saved" as const, updatedAt: new Date().toISOString() }
            : a
        );
      } else {
        apps = [appFromJob(jobId, "Saved"), ...s.applications];
      }
      const reviewQueue = s.reviewQueue.includes(jobId)
        ? s.reviewQueue
        : [...s.reviewQueue, jobId];
      return {
        applications: apps,
        reviewQueue,
        discoverIndex: s.discoverIndex + 1,
      };
    });
  },

  rejectJob: (jobId) => {
    set((s) => {
      const existing = s.applications.find((a) => a.jobId === jobId);
      let apps = s.applications;
      if (existing) {
        apps = s.applications.map((a) =>
          a.jobId === jobId
            ? {
                ...a,
                status: "Rejected" as const,
                updatedAt: new Date().toISOString(),
              }
            : a
        );
      } else {
        apps = [appFromJob(jobId, "Rejected"), ...s.applications];
      }
      const reviewQueue = s.reviewQueue.filter((id) => id !== jobId);
      const reviewIndex = Math.min(s.reviewIndex, Math.max(0, reviewQueue.length - 1));
      return { applications: apps, reviewQueue, reviewIndex };
    });
  },

  applyJob: (jobId) => {
    set((s) => {
      const existing = s.applications.find((a) => a.jobId === jobId);
      let apps = s.applications;
      if (existing) {
        apps = s.applications.map((a) =>
          a.jobId === jobId
            ? {
                ...a,
                status: "Applied" as const,
                updatedAt: new Date().toISOString(),
              }
            : a
        );
      } else {
        apps = [appFromJob(jobId, "Applied"), ...s.applications];
      }
      const reviewQueue = s.reviewQueue.filter((id) => id !== jobId);
      const reviewIndex = Math.min(s.reviewIndex, Math.max(0, reviewQueue.length - 1));
      return { applications: apps, reviewQueue, reviewIndex };
    });
  },

  nextReview: () => {
    set((s) => ({
      reviewIndex: Math.min(s.reviewIndex + 1, s.reviewQueue.length - 1),
    }));
  },

  prevReview: () => {
    set((s) => ({ reviewIndex: Math.max(s.reviewIndex - 1, 0) }));
  },

  setReviewIndex: (i) => set({ reviewIndex: i }),

  moveApplication: (id, toStatus) => {
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === id
          ? { ...a, status: toStatus, updatedAt: new Date().toISOString() }
          : a
      ),
    }));
  },

  reorderApplications: (fromStatus, toStatus, fromIndex, toIndex) => {
    set((s) => {
      const board = { Saved: [], Applied: [], Assessment: [], Interview: [], Offer: [], Rejected: [] } as Record<
        ApplicationStatus,
        Application[]
      >;
      for (const a of s.applications) board[a.status].push(a);

      const fromList = [...board[fromStatus]];
      const [moved] = fromList.splice(fromIndex, 1);
      if (!moved) return s;

      if (fromStatus === toStatus) {
        fromList.splice(toIndex, 0, moved);
        board[fromStatus] = fromList;
      } else {
        board[fromStatus] = fromList;
        const updated = {
          ...moved,
          status: toStatus,
          updatedAt: new Date().toISOString(),
        };
        const dest = [...board[toStatus]];
        dest.splice(toIndex, 0, updated);
        board[toStatus] = dest;
      }

      const applications = (
        ["Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected"] as ApplicationStatus[]
      ).flatMap((st) => board[st]);

      return { applications };
    });
  },

  addRandomApplication: (status) => {
    set((s) => {
      const used = new Set(s.applications.map((a) => a.jobId));
      const pool = jobs.filter((j) => !used.has(j.id));
      const job = pool[Math.floor(Math.random() * pool.length)] ?? jobs[0];
      return {
        applications: [appFromJob(job.id, status), ...s.applications],
      };
    });
  },

  updateProfile: (patch) => {
    set((s) => ({
      profile: normalizeProfileState({ ...s.profile, ...patch }),
    }));
  },

  getUpcomingInterviews: () => {
    return get().applications.filter((a) => a.status === "Interview");
  },
}));

/** Total jobs available for discovery. */
export const TOTAL_JOBS = jobs.length;
