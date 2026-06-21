import { create } from 'zustand';
import { UserState, Job, User } from '../types';

export const useStore = create<UserState>((set) => ({
  user: {
    id: 'u1',
    name: 'Alex Anderson',
    email: 'alex.anderson@example.com',
    avatarInitials: 'AA'
  },
  credits: 10,
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  deductCredit: (amount) => set((state) => ({ 
    credits: Math.max(0, state.credits - amount) 
  })),
  setUser: (user) => set({ user }),
}));