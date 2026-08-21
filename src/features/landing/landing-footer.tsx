import Link from "next/link";
import { Container } from "@/features/landing/container";

/**
 * Landing close: login and the public repo.
 * @returns JSX.Element
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-landing-ink/10 py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-landing-display text-lg text-landing-ink">Taghyeer</p>
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <Link
            href="/login"
            className="text-landing-link underline-offset-4 hover:underline"
          >
            Log in
          </Link>
          <a
            href="https://github.com/Jerald-tonmoy-dias/taghyeer-tsk"
            className="text-landing-link underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </Container>
    </footer>
  );
}
