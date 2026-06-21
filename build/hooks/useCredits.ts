import { create } from "zustand";
import { currentUser } from "@/data/user";

// Mocked Solvimon credit balance shared across the app.
interface CreditsState {
  credits: number;
  isPro: boolean;
  /** Returns true if the spend succeeded (enough balance). */
  spend: (amount: number) => boolean;
  add: (amount: number) => void;
  setPro: (value: boolean) => void;
}

export const useCredits = create<CreditsState>((set, get) => ({
  credits: currentUser.credits,
  isPro: currentUser.isPro,
  spend: (amount) => {
    if (get().credits < amount) return false;
    set((state) => ({ credits: state.credits - amount }));
    return true;
  },
  add: (amount) => set((state) => ({ credits: state.credits + amount })),
  setPro: (value) => set({ isPro: value }),
}));

/** Credit cost of generating + submitting a One-Click Apply. */
export const APPLY_COST = 2;

/** Credit cost of starting a mock interview. */
export const MOCK_INTERVIEW_COST = 1;
