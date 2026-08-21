import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNav } from "@/features/landing/landing-nav";
import { LandingShell } from "@/features/landing/landing-shell";

/**
 * Marketing home. Nav and hero first; preview and footer come next.
 * @returns JSX.Element
 */
export default function HomePage() {
  return (
    <LandingShell>
      <LandingNav />
      <main>
        <LandingHero />
      </main>
    </LandingShell>
  );
}
