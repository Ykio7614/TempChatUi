import { useCallback } from "react";
import { useLanguageStore } from "../store/languageStore";
import type { Language } from "../types/i18n";
import { getLocale, translate, type TranslationKey } from "../utils/i18n";

type TranslationParams = Record<string, string | number>;

export function useI18n() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) => translate(language, key, params),
    [language],
  );

  return {
    language,
    locale: getLocale(language),
    setLanguage,
    t,
  };
}

export function getLanguageLabel(language: Language) {
  return language.toUpperCase();
}
