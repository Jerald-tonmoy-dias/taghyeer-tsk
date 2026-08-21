import { Container } from "@/features/landing/container";

const beats = [
  {
    title: "Find someone",
    body: "Search by name or phone and open a 1:1. No extra signup — a new number is an account.",
  },
  {
    title: "Make a group",
    body: "Name the room, pick at least two other people, and talk together in the same thread.",
  },
  {
    title: "Stay in the room",
    body: "When they send, it lands here. No refresh, no feed — just the next line in the conversation.",
  },
] as const;

/**
 * Three short beats for what Taghyeer does.
 * @returns JSX.Element
 */
export function LandingBeats() {
  return (
    <section className="pb-landing-section">
      <Container>
        <p className="mb-10 text-sm font-medium tracking-wide text-landing-link">
          What you do here
        </p>
        <ul className="grid gap-12 md:grid-cols-3 md:gap-10">
          {beats.map((beat) => (
            <li key={beat.title}>
              <h2 className="font-landing-display text-2xl tracking-tight text-landing-ink">
                {beat.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-landing-ink/80">
                {beat.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
