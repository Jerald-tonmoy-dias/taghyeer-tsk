import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";

/**
 * Dark closer band from the mock.
 * @returns JSX.Element
 */
export function LandingClose() {
  return (
    <section className="border-t border-landing-charcoal bg-landing-ink px-6 py-20 text-landing-surface">
      <Container className="max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-landing-muted bg-landing-charcoal px-3 py-1 text-xs font-medium uppercase tracking-widest text-landing-muted-light">
          Open chat
        </div>
        <h2 className="mb-6 font-landing-display text-4xl font-normal tracking-tight sm:text-5xl">
          Explore the chat experience.
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-landing-muted-light">
          Search for people, start a 1:1 or a group, and see new replies arrive
          as they happen.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <LandingButton
            href="/login"
            className="w-full px-8 py-4 text-sm font-semibold shadow-lg shadow-landing-primary/20 sm:w-auto"
          >
            Open Chat
          </LandingButton>
        </div>
      </Container>
    </section>
  );
}
