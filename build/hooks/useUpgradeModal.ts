import { create } from "zustand";

// Tiny shared store so any component can open the upgrade modal.
interface UpgradeModalState {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useUpgradeModal = create<UpgradeModalState>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
