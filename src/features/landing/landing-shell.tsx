import { Fraunces, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

type LandingShellProps = {
  children: ReactNode;
};

/**
 * Cream canvas and landing fonts. Used only on `/` so chat keeps Geist.
 * @param props.children - Landing page
 * @returns JSX.Element
 */
export function LandingShell({ children }: LandingShellProps) {
  return (
    <div
      className={cn(
        fraunces.variable,
        sourceSans.variable,
        "min-h-dvh bg-landing-cream font-landing-sans text-landing-ink antialiased",
      )}
    >
      {children}
    </div>
  );
}
