import { create } from "zustand";
import type { Theme } from "../types/theme";
import { getStoredTheme, setStoredTheme } from "../utils/storage";

function getSystemTheme(): Theme {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
}

function resolveInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: resolveInitialTheme(),
  setTheme(theme) {
    setStoredTheme(theme);
    set({ theme });
  },
  toggleTheme() {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    setStoredTheme(nextTheme);
    set({ theme: nextTheme });
  },
}));
