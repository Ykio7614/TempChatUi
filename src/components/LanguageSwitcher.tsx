import type { Language } from "../types/i18n";
import { useI18n } from "../hooks/useI18n";
import { cn } from "../utils/format";

const languages: Language[] = ["en", "ru"];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="language-switcher" role="group" aria-label={t("common.language")}>
      {languages.map((option) => (
        <button
          key={option}
          type="button"
          className={cn("language-switcher__button", language === option && "language-switcher__button--active")}
          onClick={() => setLanguage(option)}
        >
          {option === "en" ? t("language.english") : t("language.russian")}
        </button>
      ))}
    </div>
  );
}
