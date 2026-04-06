import type { CSSProperties } from "react";
import { useI18n } from "../hooks/useI18n";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/format";

export function ThemeSwitcher() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const activeIndex = theme === "light" ? 0 : 1;

  return (
    <div
      className="theme-switcher"
      role="group"
      aria-label={t("common.theme")}
      style={{ "--switcher-index": activeIndex } as CSSProperties}
    >
      <span className="switcher-thumb" aria-hidden="true" />
      <button
        type="button"
        className={cn("theme-switcher__button", theme === "light" && "theme-switcher__button--active")}
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        {t("theme.light")}
      </button>
      <button
        type="button"
        className={cn("theme-switcher__button", theme === "dark" && "theme-switcher__button--active")}
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        {t("theme.dark")}
      </button>
    </div>
  );
}
