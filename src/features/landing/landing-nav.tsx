import Link from "next/link";
import { Container } from "@/features/landing/container";
import { LandingMark, landingSections } from "@/features/landing/landing-ui";

/**
 * Sticky landing header.
 * @returns JSX.Element
 */
export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-landing-border bg-white/85 px-6 py-3.5 backdrop-blur-md sm:px-12">
      <Container className="flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-landing-display text-lg font-bold tracking-tight text-landing-ink"
        >
          <LandingMark />
          Taghyeer
        </Link>
        <div className="hidden items-center gap-8 text-xs font-semibold text-landing-muted lg:flex">
          {landingSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-landing-primary"
            >
              {item.nav}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="rounded-full bg-landing-primary px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-landing-surface shadow-sm shadow-landing-primary/25 transition-all hover:bg-landing-primary-hover"
        >
          Sign in
        </Link>
      </Container>
    </nav>
  );
}
