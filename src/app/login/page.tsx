import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";
import { LandingShell } from "@/features/landing/landing-shell";

/**
 * Login screen chrome matching the product landing.
 * @returns JSX.Element
 */
export default function LoginPage() {
  return (
    <LandingShell>
      <div className="relative flex min-h-dvh flex-col justify-between">
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-40 [background-image:radial-gradient(circle,#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed top-1/4 left-1/2 z-0 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-landing-primary/10 blur-[100px]"
          aria-hidden
        />

        <header className="sticky top-0 z-20 w-full border-b border-landing-border bg-landing-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-20">
            <Link
              href="/"
              className="group flex items-center gap-2.5 font-landing-display text-2xl font-semibold tracking-tight text-landing-ink"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-landing-primary font-landing-sans text-sm font-bold text-landing-surface shadow-sm shadow-landing-primary/30 transition-transform group-hover:scale-105">
                T
              </span>
              <span>Taghyeer</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-landing-border bg-landing-surface px-3.5 py-1.5 text-xs font-semibold text-landing-muted shadow-xs transition-all hover:border-landing-muted-light hover:bg-landing-sand-light hover:text-landing-ink"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back home
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-[420px]">
            <div className="rounded-2xl border border-landing-border bg-landing-surface p-8 shadow-xl shadow-landing-ink/10 transition-all sm:p-10">
              <div className="mb-7">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-landing-primary/20 bg-landing-primary-soft px-2.5 py-0.5 font-landing-mono text-[10px] font-bold tracking-widest text-landing-primary uppercase">
                  Taghyeer
                </div>
                <h1 className="mb-2 font-landing-display text-3xl leading-tight font-normal tracking-tight text-landing-ink sm:text-[34px]">
                  Log in to continue
                </h1>
                <p className="text-xs leading-relaxed text-landing-muted sm:text-[13px]">
                  Use your phone and name. A new phone creates an account
                  automatically.
                </p>
              </div>
              <LoginForm />
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-landing-muted transition-colors hover:text-landing-ink"
              >
                <span
                  className="transition-transform group-hover:-translate-x-0.5"
                  aria-hidden
                >
                  ←
                </span>
                <span>Back home</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center gap-2 px-6 py-6 text-center text-xs text-landing-muted-light">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Taghyeer Chat System • Real-time messages</span>
        </footer>
      </div>
    </LandingShell>
  );
}
