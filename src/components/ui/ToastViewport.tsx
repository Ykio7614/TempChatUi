import { useEffect } from "react";
import { useI18n } from "../../hooks/useI18n";
import { useUiStore } from "../../store/uiStore";

export function ToastViewport() {
  const { t } = useI18n();
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id);
      }, 3500),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [removeToast, toasts]);

  return (
    <aside className="toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <span>{toast.title}</span>
          <button className="toast__close" onClick={() => removeToast(toast.id)} aria-label={t("toast.dismiss")}>
            ×
          </button>
        </div>
      ))}
    </aside>
  );
}
