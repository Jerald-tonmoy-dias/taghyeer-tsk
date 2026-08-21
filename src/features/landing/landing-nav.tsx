import Link from "next/link";
import { Container } from "@/features/landing/container";

/**
 * Landing header: product name and a login link.
 * @returns JSX.Element
 */
export function LandingNav() {
  return (
    <header className="h-landing-header border-b border-landing-ink/10">
      <Container className="flex h-full items-center justify-between">
        <Link
          href="/"
          className="font-landing-display text-xl tracking-tight text-landing-ink"
        >
          Taghyeer
        </Link>
        <Link
          href="/login"
          className="text-sm font-medium text-landing-link underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </Container>
    </header>
  );
}
