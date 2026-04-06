import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/format";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, ...props }: TextAreaProps) {
  return <textarea className={cn("textarea", className)} {...props} />;
}
