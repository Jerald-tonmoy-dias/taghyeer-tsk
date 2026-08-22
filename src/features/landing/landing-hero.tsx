import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";
import {
  LandingArrowIcon,
  LandingCheckIcon,
  LandingEyebrow,
} from "@/features/landing/landing-ui";
import { PreviewSandbox } from "@/features/landing/preview-sandbox";

const checks = [
  "1:1 and group rooms",
  "Messages arrive without a refresh",
  "Scroll follows new messages",
] as const;

/**
 * Hero: title, one CTA, and the chat window mock.
 * @returns JSX.Element
 */
export function LandingHero() {
  return (
    <header className="relative overflow-hidden border-b border-landing-border/70 bg-gradient-to-b from-slate-50 via-slate-100/40 to-white px-4 pt-16 pb-28 sm:px-8 sm:pt-20">
      <div
        className="pointer-events-none absolute top-[-8rem] left-1/2 h-[450px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-400/15 via-indigo-300/10 to-transparent blur-[140px]"
        aria-hidden
      />
      <Container className="relative z-10 max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl space-y-7 text-center">
          <LandingEyebrow>Real-time messaging · 1:1 & group chat</LandingEyebrow>
          <h1 className="font-landing-display text-5xl leading-[1.06] font-medium tracking-tight text-slate-900 sm:text-7xl lg:text-[80px]">
            Talk directly to people,{" "}
            <br className="hidden sm:block" />
            <span className="font-landing-display font-normal text-landing-primary italic">
              not an algorithm.
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-landing-muted sm:text-lg">
            A focused chat for one-to-one and group conversations.
            <br className="hidden sm:inline" /> Search for people, send a
            message, and see replies land as they happen.
          </p>
          <div className="flex justify-center pt-3">
            <LandingButton
              href="/login"
              className="gap-2.5 px-8 py-3.5 text-xs font-bold shadow-lg shadow-landing-primary/25"
            >
              <span>Open the Chat App</span>
              <LandingArrowIcon />
            </LandingButton>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 pt-6 text-xs font-medium text-slate-600">
            {checks.map((label) => (
              <span key={label} className="flex items-center gap-2">
                <LandingCheckIcon />
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-5xl">
          <PreviewSandbox />
        </div>
      </Container>
    </header>
  );
}
