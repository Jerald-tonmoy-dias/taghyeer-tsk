import { Container } from "@/features/landing/container";
import { LandingEyebrow } from "@/features/landing/landing-ui";
import { PreviewSandbox } from "@/features/landing/preview-sandbox";

/**
 * Interactive chat mock from the design.
 * @returns JSX.Element
 */
export function ProductPreview() {
  return (
    <section
      id="demo"
      className="scroll-mt-24 border-y border-landing-border bg-landing-sand-light px-6 py-20"
    >
      <Container className="max-w-5xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <LandingEyebrow>The conversation</LandingEyebrow>
            <h2 className="mt-1 font-landing-display text-3xl font-normal text-landing-ink sm:text-4xl">
              See the conversation experience in action.
            </h2>
          </div>
          <p className="rounded-lg border border-landing-border bg-landing-surface px-3 py-1.5 font-landing-sans text-xs text-landing-muted shadow-xs">
            Send a message to see the chat update live.
          </p>
        </div>
        <PreviewSandbox />
      </Container>
    </section>
  );
}
