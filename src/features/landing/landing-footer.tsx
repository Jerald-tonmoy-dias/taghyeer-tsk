import Link from "next/link";
import { Container } from "@/features/landing/container";
import { LandingMark, landingSections } from "@/features/landing/landing-ui";

/**
 * Dark footer under the closer.
 * @returns JSX.Element
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-landing-ink px-6 py-8 text-xs text-slate-400 sm:px-12">
      <Container className="flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <LandingMark size="sm" />
          <span className="font-bold tracking-wide text-white">Taghyeer</span>
          <span className="text-slate-600">|</span>
          <span>Real-time chat in the browser.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {landingSections
            .filter((item) =>
              ["#capabilities", "#channels", "#details", "#faq"].includes(
                item.href,
              ),
            )
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.footer}
              </Link>
            ))}
          <Link href="/login" className="transition-colors hover:text-white">
            Log in
          </Link>
        </div>
      </Container>
    </footer>
  );
}
