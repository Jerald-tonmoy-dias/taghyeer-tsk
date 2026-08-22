import Link from "next/link";
import { Container } from "@/features/landing/container";
import { LandingMark, landingSections } from "@/features/landing/landing-ui";

/**
 * Sticky landing header.
 * @returns JSX.Element
 */
export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-landing-border bg-landing-cream/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-landing-display text-2xl font-semibold tracking-tight text-landing-ink"
        >
          <LandingMark />
          Taghyeer
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-landing-muted md:flex">
          {landingSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-landing-ink"
            >
              {item.nav}
            </Link>
          ))}
        </div>
        <Link
          href="/login"
          className="rounded-full bg-landing-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-landing-surface shadow-sm shadow-landing-primary/20 transition-all hover:bg-landing-primary-hover"
        >
          Open Chat
        </Link>
      </Container>
    </nav>
  );
}
