import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";

/**
 * Dark closer band.
 * @returns JSX.Element
 */
export function LandingClose() {
  return (
    <section className="bg-landing-ink px-6 pt-24 pb-20 text-landing-surface sm:px-12">
      <Container className="max-w-4xl space-y-6 text-center">
        <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-3.5 py-1 font-landing-mono text-[11px] tracking-widest text-slate-300 uppercase">
          Ready when you are
        </div>
        <h2 className="font-landing-display text-4xl leading-tight font-normal tracking-tight sm:text-6xl">
          Explore the chat experience.
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed font-normal text-slate-400 sm:text-base">
          Search for people, start a 1:1 or a group, and see new replies arrive
          as they happen.
        </p>
        <div className="pt-3">
          <LandingButton
            href="/login"
            className="px-8 py-3.5 text-xs font-semibold shadow-lg shadow-landing-primary/25"
          >
            Open Chat
          </LandingButton>
        </div>
      </Container>
    </section>
  );
}
