import { create } from "zustand";
import type { Language } from "../types/i18n";
import { getStoredLanguage, setStoredLanguage } from "../utils/storage";

function resolveInitialLanguage(): Language {
  const storedLanguage = getStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("ru")) {
    return "ru";
  }

  return "en";
}

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: resolveInitialLanguage(),
  setLanguage(language) {
    setStoredLanguage(language);
    set({ language });
  },
}));

export function getCurrentLanguage() {
  return useLanguageStore.getState().language;
}
