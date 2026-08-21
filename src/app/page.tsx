import { LandingBeats } from "@/features/landing/landing-beats";
import { LandingFooter } from "@/features/landing/landing-footer";
import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNav } from "@/features/landing/landing-nav";
import { LandingShell } from "@/features/landing/landing-shell";
import { ProductPreview } from "@/features/landing/product-preview";

/**
 * Marketing home: hero, static preview, what it does, footer.
 * @returns JSX.Element
 */
export default function HomePage() {
  return (
    <LandingShell>
      <LandingNav />
      <main>
        <LandingHero />
        <ProductPreview />
        <LandingBeats />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
