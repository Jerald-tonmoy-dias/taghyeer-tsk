import { LandingHero } from "@/features/landing/landing-hero";
import { LandingNav } from "@/features/landing/landing-nav";
import { LandingShell } from "@/features/landing/landing-shell";
import { ProductPreview } from "@/features/landing/product-preview";

/**
 * Marketing home. Preview is static fake chat — no API.
 * @returns JSX.Element
 */
export default function HomePage() {
  return (
    <LandingShell>
      <LandingNav />
      <main>
        <LandingHero />
        <ProductPreview />
      </main>
    </LandingShell>
  );
}
