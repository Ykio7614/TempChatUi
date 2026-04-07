import { cn } from "../../utils/format";

type StatusBadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return <span className={cn("status-badge", `status-badge--${tone}`)}>{label}</span>;
}
