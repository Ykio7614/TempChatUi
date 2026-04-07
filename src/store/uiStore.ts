import { create } from "zustand";
import type { ToastItem } from "../types/api";
import { registerStoreResetter } from "./storeReset";

type UiState = {
  toasts: ToastItem[];
  pushToast: (title: string) => void;
  removeToast: (id: string) => void;
  reset: () => void;
};

const initialState = {
  toasts: [] as ToastItem[],
};

export const useUiStore = create<UiState>((set) => ({
  ...initialState,
  pushToast: (title) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), title }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  reset: () => set(initialState),
}));

registerStoreResetter(() => {
  useUiStore.getState().reset();
});
