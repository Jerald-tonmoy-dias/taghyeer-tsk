import { LandingClose } from "@/features/landing/landing-close";
import { LandingEngineering } from "@/features/landing/landing-engineering";
import { LandingFeatures } from "@/features/landing/landing-features";
import { LandingFooter } from "@/features/landing/landing-footer";
import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNav } from "@/features/landing/landing-nav";
import { LandingShell } from "@/features/landing/landing-shell";
import { ProductPreview } from "@/features/landing/product-preview";

/**
 * Marketing home matching the supplied landing mock.
 * @returns JSX.Element
 */
export default function HomePage() {
  return (
    <LandingShell>
      <LandingNav />
      <main>
        <LandingHero />
        <ProductPreview />
        <LandingFeatures />
        <LandingEngineering />
        <LandingClose />
      </main>
      <LandingFooter />
    </LandingShell>
  );
}
