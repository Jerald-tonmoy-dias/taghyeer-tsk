import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";

const cases = [
  {
    n: "01",
    tag: "Input",
    title: "Empty messages stay empty",
    body: "Whitespace is trimmed. If nothing is left, send does not run. The API would store an empty string; the composer will not send one.",
    tone: "blue",
  },
  {
    n: "02",
    tag: "Scroll",
    title: "Scroll when it helps",
    body: "If you are near the bottom, new lines pull you down. If you scrolled up to read older messages, the list stays put.",
    tone: "amber",
  },
  {
    n: "03",
    tag: "States",
    title: "Clear states, clear feedback",
    body: "Loading, empty inbox, empty search, and failed requests each have their own UI. A dropped socket does not log you out.",
    tone: "emerald",
  },
] as const;

const badge = {
  blue: "border-blue-100 bg-blue-50 text-landing-primary group-hover:bg-landing-primary group-hover:text-white",
  amber:
    "border-amber-100 bg-amber-50 text-amber-800 group-hover:bg-amber-600 group-hover:text-white",
  emerald:
    "border-emerald-100 bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white",
} as const;

/**
 * Three edge-case cards.
 * @returns JSX.Element
 */
export function LandingEngineering() {
  return (
    <section
      id="details"
      className="scroll-mt-24 border-b border-landing-border/70 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 px-6 py-28 sm:px-12"
    >
      <Container className="max-w-7xl space-y-16">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <LandingEyebrow>Built for real conversations</LandingEyebrow>
          <h2 className="font-landing-display text-3xl leading-[1.15] font-medium tracking-tight text-slate-900 sm:text-5xl">
            The details matter when messages{" "}
            <br className="hidden sm:inline" />
            <span className="font-landing-display font-normal text-landing-primary italic">
              don&apos;t go as planned.
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-landing-muted sm:text-base">
            Empty send, scroll lock, and error states are handled in the client
            so the thread does not go blank.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {cases.map((item) => (
            <div
              key={item.n}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all hover:border-landing-primary/40 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl border font-landing-mono text-sm font-bold transition-colors ${badge[item.tone]}`}
                  >
                    {item.n}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-landing-mono text-[11px] font-medium tracking-wider text-slate-500 uppercase">
                    {item.tag}
                  </span>
                </div>
                <div className="space-y-2.5">
                  <h3 className="font-landing-display text-2xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="font-chat text-xs leading-relaxed text-landing-muted sm:text-sm">
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
