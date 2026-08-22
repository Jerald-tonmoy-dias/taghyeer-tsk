import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";
import { LandingArrowIcon, LandingCheckIcon } from "@/features/landing/landing-ui";

const checks = [
  "1:1 & group conversations",
  "Real-time message updates",
  "Smart auto-scroll",
  "Responsive chat experience",
] as const;

/**
 * Centered hero: pill, headline, CTA, trust row.
 * @returns JSX.Element
 */
export function LandingHero() {
  return (
    <header className="pt-20 pb-20 md:pt-28 md:pb-28">
      <Container className="max-w-4xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-landing-primary/20 bg-landing-primary-soft px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-landing-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-landing-primary" />
          Real-time messaging · 1:1 & group chat
        </div>
        <h1 className="mb-7 font-landing-display font-normal tracking-tight">
          <span className="block text-5xl leading-[1.1] text-landing-ink sm:text-6xl md:text-7xl">
            Talk directly to people,
          </span>
          <span className="mt-2 block text-5xl italic leading-[1.1] text-landing-primary sm:text-6xl md:text-7xl">
            not an algorithm.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-base font-normal leading-relaxed text-landing-muted sm:text-lg md:text-xl">
          A focused chat experience for one-to-one and group conversations.
          <br />
          Search for people, send messages, and stay connected with real-time
          updates.
        </p>
        <div className="mb-10 flex items-center justify-center">
          <LandingButton href="/login" className="w-full gap-2 sm:w-auto">
            <span>Open the Chat App</span>
            <LandingArrowIcon />
          </LandingButton>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-landing-muted">
          {checks.map((label) => (
            <span key={label} className="flex items-center gap-1.5">
              <LandingCheckIcon />
              {label}
            </span>
          ))}
        </div>
      </Container>
    </header>
  );
}
