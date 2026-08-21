import { Container } from "@/features/landing/container";
import { LandingButton } from "@/features/landing/landing-button";
import { LandingShell } from "@/features/landing/landing-shell";

/**
 * Marketing home. Foundation only — sections land in later tickets.
 * @returns JSX.Element
 */
export default function HomePage() {
  return (
    <LandingShell>
      <header className="h-landing-header border-b border-landing-ink/10">
        <Container className="flex h-full items-center" />
      </header>
      <main className="py-landing-section">
        <Container>
          <LandingButton href="/login">Go to login</LandingButton>
        </Container>
      </main>
    </LandingShell>
  );
}
