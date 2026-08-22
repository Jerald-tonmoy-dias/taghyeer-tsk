import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";

const faqs = [
  {
    q: "How do I sign in?",
    a: "Enter a phone number and a name. There is no password. If the number is new, the API creates the account.",
  },
  {
    q: "What do I need to create a group?",
    a: "A name and at least two other people (three total, including you). The form checks that before it calls the API.",
  },
  {
    q: "How do new messages show up?",
    a: "Other people’s lines arrive over the socket. You do not refresh. Your own send comes from the POST /messages response — the socket does not echo it back.",
  },
  {
    q: "Can I change a group after I create it?",
    a: "Yes. Room details can rename the group, add people, remove people, or let you leave.",
  },
] as const;

/**
 * Short FAQ with answers that match the live app.
 * @returns JSX.Element
 */
export function LandingFaq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-b border-landing-border/70 bg-white px-6 py-24 sm:px-12"
    >
      <Container className="max-w-4xl space-y-12">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <LandingEyebrow>Questions</LandingEyebrow>
          <h2 className="font-landing-display text-3xl leading-[1.15] font-medium tracking-tight text-slate-900 sm:text-5xl">
            Common questions
          </h2>
          <p className="text-sm leading-relaxed text-landing-muted sm:text-base">
            Sign-in, groups, live messages, and room admin — as the app actually
            works.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 transition-all open:border-landing-primary/30 open:bg-white open:shadow-sm sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-landing-display text-lg font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs text-slate-400 transition-transform group-open:rotate-180 group-open:text-landing-primary">
                  ▼
                </span>
              </summary>
              <p className="mt-3.5 border-t border-slate-100 pt-3 pr-6 font-chat text-xs leading-relaxed text-slate-500 sm:text-sm">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
