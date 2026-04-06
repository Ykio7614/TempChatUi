import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/format";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn("input", className)} {...props} />;
}
