import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const landingSections = [
  { href: "#core-features", nav: "Core Capabilities", footer: "Capabilities" },
  { href: "#demo", nav: "Conversations", footer: "Conversations" },
  { href: "#engineering", nav: "Built for conversations", footer: "Details" },
] as const;

type LandingMarkProps = {
  size?: "sm" | "md";
};

/**
 * Wordmark disc used in the nav and footer.
 * @param props.size - Disc size
 * @returns JSX.Element
 */
export function LandingMark({ size = "md" }: LandingMarkProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full bg-landing-primary font-landing-sans font-bold text-landing-surface",
        size === "md"
          ? "h-8 w-8 text-sm shadow-sm shadow-landing-primary/20"
          : "h-6 w-6 text-xs",
      )}
    >
      T
    </span>
  );
}

type LandingEyebrowProps = {
  children: ReactNode;
};

/**
 * Shared section label: small, uppercase, primary.
 * @param props.children - Label
 * @returns JSX.Element
 */
export function LandingEyebrow({ children }: LandingEyebrowProps) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest text-landing-primary">
      {children}
    </span>
  );
}

/**
 * Hero trust-row check.
 * @returns JSX.Element
 */
export function LandingCheckIcon() {
  return (
    <svg className="h-4 w-4 text-landing-primary" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/**
 * Hero CTA arrow.
 * @returns JSX.Element
 */
export function LandingArrowIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}
