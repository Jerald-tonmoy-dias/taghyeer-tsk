import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type LandingButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Primary landing CTA. White label on primary fill.
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
        "inline-flex items-center justify-center rounded-full bg-landing-primary px-8 py-3.5 text-base font-medium text-landing-surface shadow-md shadow-landing-primary/20 transition-all hover:bg-landing-primary-hover",
        className,
      )}
    >
      {children}
    </Link>
  );
}
