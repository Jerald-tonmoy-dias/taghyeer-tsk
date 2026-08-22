import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContainerProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Centered landing column with shared max width and gutters.
 * @param props.children - Section content
 * @param props.className - Extra classes
 * @returns JSX.Element
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)}>
      {children}
    </div>
  );
}
