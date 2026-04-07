import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/format";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section className={cn("card", className)} {...props}>
      {children}
    </section>
  );
}
