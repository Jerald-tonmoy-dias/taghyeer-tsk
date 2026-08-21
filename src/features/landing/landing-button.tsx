import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Primary landing CTA. White label on `#C73E29` (AA). Hover uses link ink.
 * @param props.href - Destination
 * @param props.children - Button label
 * @param props.className - Extra classes
 * @returns JSX.Element
 */
export function LandingButton({ href, children, className }: LandingButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full bg-landing-button px-5 text-sm font-medium text-white transition-colors hover:bg-landing-link",
        className,
      )}
    >
      {children}
    </Link>
  );
}
