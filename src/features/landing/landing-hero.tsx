import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";

/**
 * First screen: what Taghyeer is, and a path into the app.
 * @returns JSX.Element
 */
export function LandingHero() {
  return (
    <section className="py-landing-section">
      <Container className="max-w-3xl">
        <p className="mb-5 text-sm font-medium tracking-wide text-landing-link">
          1:1 · groups · live
        </p>
        <h1 className="font-landing-display text-4xl leading-[1.15] tracking-tight text-landing-ink sm:text-5xl md:text-6xl">
          Talk to people, not a feed.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-landing-ink/80">
          Search someone. Start a group. Messages land in the thread as they
          happen — no refresh, no wall of noise.
        </p>
        <div className="mt-10">
          <LandingButton href="/login">Open chat</LandingButton>
        </div>
      </Container>
    </section>
  );
}
