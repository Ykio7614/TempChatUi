import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/format";

export function ThemeSwitcher() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-switcher" role="group" aria-label={t("common.theme")}>
      <button
        type="button"
        className={cn("theme-switcher__button", theme === "light" && "theme-switcher__button--active")}
        onClick={() => setTheme("light")}
      >
        {t("theme.light")}
      </button>
      <button
        type="button"
        className={cn("theme-switcher__button", theme === "dark" && "theme-switcher__button--active")}
        onClick={() => setTheme("dark")}
      >
        {t("theme.dark")}
      </button>
    </div>
  );
}
