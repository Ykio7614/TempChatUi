import { cn } from "../utils/format";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <div className={cn("brand-logo", compact && "brand-logo--compact", className)}>
      <span className="brand-logo__mark" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect className="brand-logo__bubble" x="6" y="8" width="28" height="22" rx="8" />
          <path className="brand-logo__bubble" d="M10 30L10 36L16 30" />
          <circle className="brand-logo__clock" cx="30" cy="28" r="10" strokeWidth="2" />
          <path className="brand-logo__clock" d="M30 28V23" strokeWidth="2" strokeLinecap="round" />
          <path className="brand-logo__clock" d="M30 28L34 30" strokeWidth="2" strokeLinecap="round" />
          <circle className="brand-logo__dot" cx="30" cy="28" r="1.5" />
        </svg>
      </span>
      <span className="brand-logo__text">
        <strong>TempChat</strong>
        {!compact ? <span>Ephemeral rooms, instant chat</span> : null}
      </span>
    </div>
  );
}
