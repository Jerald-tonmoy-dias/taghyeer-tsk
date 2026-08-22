import Link from "next/link";
import { Container } from "@/features/landing/container";
import { LandingMark, landingSections } from "@/features/landing/landing-ui";

/**
 * Dark footer.
 * @returns JSX.Element
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-landing-charcoal/80 bg-landing-ink px-6 py-12 text-sm text-landing-muted-light">
      <Container className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <LandingMark size="sm" />
          <span className="font-landing-display text-base font-medium text-landing-surface">
            Taghyeer
          </span>
          <span className="hidden border-l border-landing-charcoal pl-2 text-xs text-landing-muted sm:inline">
            Real-time chat experience for the web.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-landing-muted-light">
          {landingSections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-landing-surface"
            >
              {item.footer}
            </Link>
          ))}
          <Link href="/login" className="transition-colors hover:text-landing-surface">
            Log in
          </Link>
        </div>
      </Container>
    </footer>
  );
}
