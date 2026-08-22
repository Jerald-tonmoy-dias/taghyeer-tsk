import {
  Inter,
  JetBrains_Mono,
  Newsreader,
  Plus_Jakarta_Sans,
} from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

type ChatWorkspaceProps = {
  children: ReactNode;
};

/**
 * Product fonts and canvas for `/app`. Landing and login use `LandingShell`.
 * @param props.children - Chat shell
 * @returns JSX.Element
 */
export function ChatWorkspace({ children }: ChatWorkspaceProps) {
  return (
    <div
      className={cn(
        newsreader.variable,
        plusJakarta.variable,
        jetbrains.variable,
        inter.variable,
        "h-dvh overflow-hidden bg-landing-cream font-landing-sans text-landing-ink antialiased selection:bg-landing-primary selection:text-landing-surface",
      )}
    >
      {children}
    </div>
  );
}
