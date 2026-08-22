import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";

const cards = [
  {
    n: "01",
    title: "Search & Start",
    body: "Find people by name or phone number, then start a conversation without leaving the chat.",
    foot: "Name or phone",
  },
  {
    n: "02",
    title: "1:1 & Group Conversations",
    body: "Start a direct chat or bring a few people into a shared group thread.",
    foot: "Direct and group rooms",
  },
  {
    n: "03",
    title: "Real-Time Messaging",
    body: "New messages show up in the thread. You do not need to refresh the page.",
    foot: "No page refresh",
  },
] as const;

/**
 * Three capability cards.
 * @returns JSX.Element
 */
export function LandingFeatures() {
  return (
    <section
      id="capabilities"
      className="scroll-mt-24 border-b border-landing-border/70 bg-slate-50/70 px-6 py-24 sm:px-12"
    >
      <Container className="max-w-7xl space-y-12">
        <div className="max-w-3xl space-y-4">
          <LandingEyebrow>Core capabilities</LandingEyebrow>
          <h2 className="font-landing-display text-3xl leading-[1.15] font-medium tracking-tight text-slate-900 sm:text-5xl">
            Everything you need for a focused conversation.
          </h2>
          <p className="text-sm text-landing-muted sm:text-base">
            Search, open a room, and stay in the thread. The rest is feedback
            when something is empty, loading, or fails.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.n}
              className="flex flex-col justify-between space-y-8 rounded-3xl border border-landing-border/90 bg-white p-7 shadow-sm transition-all hover:border-landing-primary/30 hover:shadow-md"
            >
              <div className="space-y-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 font-landing-mono text-xs font-bold text-landing-primary">
                  {card.n}
                </span>
                <div className="space-y-2">
                  <h3 className="font-landing-display text-xl font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="font-chat text-xs leading-relaxed text-landing-muted">
                    {card.body}
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 font-landing-mono text-[11px] text-landing-primary">
                {card.foot}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
