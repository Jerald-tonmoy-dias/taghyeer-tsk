import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";

const cases = [
  {
    n: "A",
    title: "Empty Messages Stay Empty",
    body: "Messages can't be sent without content, preventing accidental or meaningless send actions.",
  },
  {
    n: "B",
    title: "Scroll When It Helps",
    body: "The conversation follows new messages by default, but never pulls the user away while they're reading older messages.",
  },
  {
    n: "C",
    title: "Clear States, Clear Feedback",
    body: "Loading, empty conversations, and failed requests are handled explicitly so users always know what's happening.",
  },
] as const;

/**
 * Engineering / edge-case list from the mock.
 * @returns JSX.Element
 */
export function LandingEngineering() {
  return (
    <section id="engineering" className="scroll-mt-24 bg-landing-surface px-6 py-24">
      <Container className="max-w-4xl">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <LandingEyebrow>Built for real conversations</LandingEyebrow>
          <h2 className="mt-2 font-landing-display text-3xl font-normal text-landing-ink sm:text-4xl">
            The details matter when messages don&apos;t go as planned.
          </h2>
          <p className="mt-3 text-sm text-landing-muted">
            Clear feedback and predictable behavior keep the chat experience
            usable across loading, empty, and error states.
          </p>
        </div>
        <div className="space-y-4">
          {cases.map((item) => (
            <div
              key={item.n}
              className="flex items-start gap-4 rounded-2xl border border-landing-border bg-landing-sand-light/50 p-6 transition-colors hover:border-landing-muted-light"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-landing-primary-soft font-landing-mono text-xs font-bold text-landing-primary">
                {item.n}
              </div>
              <div>
                <h3 className="mb-1 font-landing-display text-lg font-medium text-landing-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-landing-muted">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
