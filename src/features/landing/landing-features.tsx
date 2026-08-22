import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";

const cards = [
  {
    n: "01",
    title: "Search & Start",
    body: "Find people by name or phone number, then start a conversation without leaving the chat experience.",
    foot: "Name or phone",
  },
  {
    n: "02",
    title: "1:1 & Group Conversations",
    body: "Start direct conversations or bring multiple participants together in a shared group chat.",
    foot: "Direct and group rooms",
  },
  {
    n: "03",
    title: "Real-Time Messaging",
    body: "New messages appear automatically, keeping the conversation up to date without requiring a page refresh.",
    foot: "No page refresh",
  },
] as const;

/**
 * Three capability cards from the mock.
 * @returns JSX.Element
 */
export function LandingFeatures() {
  return (
    <section
      id="core-features"
      className="scroll-mt-24 border-b border-landing-border bg-landing-sand px-6 py-24"
    >
      <Container>
        <div className="mb-16 max-w-2xl">
          <LandingEyebrow>Core Capabilities</LandingEyebrow>
          <h2 className="mt-2 font-landing-display text-3xl font-normal text-landing-ink sm:text-4xl md:text-5xl">
            Everything you need for a focused conversation.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-landing-muted">
            Simple interactions, clear feedback, and the details that keep
            messaging reliable.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.n}
              className="flex flex-col justify-between rounded-2xl border border-landing-border bg-landing-surface p-8 shadow-xs transition-colors hover:border-landing-primary/40"
            >
              <div>
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-landing-primary-soft font-landing-mono text-sm font-bold text-landing-primary">
                  {card.n}
                </div>
                <h3 className="mb-2 font-landing-display text-xl font-medium text-landing-ink">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-landing-muted">
                  {card.body}
                </p>
              </div>
              <div className="mt-6 border-t border-landing-border pt-4 font-landing-mono text-xs text-landing-primary">
                {card.foot}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
