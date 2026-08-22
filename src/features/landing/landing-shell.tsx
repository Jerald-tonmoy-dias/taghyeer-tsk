import { JetBrains_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

type LandingShellProps = {
  children: ReactNode;
};

/**
 * Landing canvas, fonts, and selection. Used only on `/` so chat keeps Geist.
 * @param props.children - Landing page
 * @returns JSX.Element
 */
export function LandingShell({ children }: LandingShellProps) {
  return (
    <div
      className={cn(
        newsreader.variable,
        plusJakarta.variable,
        jetbrains.variable,
        "min-h-dvh scroll-smooth bg-landing-cream font-landing-sans text-landing-ink antialiased selection:bg-landing-primary selection:text-landing-surface",
      )}
    >
      {children}
    </div>
  );
}
