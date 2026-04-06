import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }
>;

export function Button({ children, className, type = "button", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("button", `button--${variant}`, className)}
      {...props}
    >
      {children}
    </button>
  );
}
