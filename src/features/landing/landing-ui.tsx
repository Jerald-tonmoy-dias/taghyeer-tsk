import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const landingSections = [
  { href: "#capabilities", nav: "Capabilities", footer: "Capabilities" },
  { href: "#channels", nav: "Direct & groups", footer: "Conversations" },
  { href: "#composer", nav: "Composer", footer: "Composer" },
  { href: "#governance", nav: "Groups", footer: "Groups" },
  { href: "#details", nav: "Details", footer: "Details" },
  { href: "#faq", nav: "FAQ", footer: "FAQ" },
] as const;

type LandingMarkProps = {
  size?: "sm" | "md";
};

/**
 * Wordmark tile used in the nav and footer.
 * @param props.size - Tile size
 * @returns JSX.Element
 */
export function LandingMark({ size = "md" }: LandingMarkProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-xl bg-landing-primary font-landing-sans font-bold text-landing-surface shadow-sm shadow-landing-primary/20",
        size === "md" ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]",
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
 * Shared section pill: uppercase, mono, primary.
 * @param props.children - Label
 * @returns JSX.Element
 */
export function LandingEyebrow({ children }: LandingEyebrowProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-landing-primary/20 bg-landing-primary-soft px-3.5 py-1.5 font-landing-mono text-[11px] font-bold tracking-widest text-landing-primary uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-landing-primary" />
      {children}
    </div>
  );
}

/**
 * Hero trust-row check.
 * @returns JSX.Element
 */
export function LandingCheckIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-landing-primary-soft text-[10px] font-bold text-landing-primary">
      ✓
    </span>
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

const avatarTint = {
  indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
  amber: "border-amber-100 bg-amber-50 text-amber-800",
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
} as const;

type LandingAvatarProps = {
  initials: string;
  tint: keyof typeof avatarTint;
  className?: string;
};

/**
 * Pastel initials tile for landing mocks.
 * @param props.initials - Two letters
 * @param props.tint - Color set
 * @param props.className - Extra classes
 * @returns JSX.Element
 */
export function LandingAvatar({
  initials,
  tint,
  className,
}: LandingAvatarProps) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-xs font-bold",
        avatarTint[tint],
        className,
      )}
    >
      {initials}
    </div>
  );
}
