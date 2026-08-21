import { Container } from "@/features/landing/container";
import { previewInbox, type PreviewRow } from "@/features/landing/preview-data";
import { PreviewLiveThread } from "@/features/landing/preview-live-thread";
import { cn } from "@/lib/utils";

/**
 * One fake inbox row in the landing mock.
 * @param props.row - Static conversation
 * @returns JSX.Element
 */
function PreviewInboxRow({ row }: { row: PreviewRow }) {
  return (
    <div
      className={cn(
        "border-b border-landing-ink/10 px-4 py-3",
        row.selected && "bg-landing-tint",
      )}
    >
      <p className="truncate text-sm font-medium text-landing-ink">{row.title}</p>
      <p className="truncate text-xs text-landing-ink/70">{row.preview}</p>
    </div>
  );
}

/**
 * Static two-pane chat mock. The thread hydrates a late incoming bubble in JS.
 * @returns JSX.Element
 */
export function ProductPreview() {
  return (
    <section className="pb-landing-section">
      <Container>
        <p className="mb-6 text-sm font-medium tracking-wide text-landing-link">
          The thread
        </p>
        <div className="overflow-hidden rounded-3xl border border-landing-ink/10 bg-landing-cream shadow-[0_24px_60px_-28px_rgba(28,25,23,0.35)]">
          <div className="flex min-h-[22rem] md:min-h-[28rem]">
            <aside className="hidden w-64 shrink-0 border-r border-landing-ink/10 md:block">
              <p className="border-b border-landing-ink/10 px-4 py-3 text-sm font-semibold">
                Taghyeer
              </p>
              {previewInbox.map((row) => (
                <PreviewInboxRow key={row.id} row={row} />
              ))}
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="border-b border-landing-ink/10 px-4 py-3 text-sm font-semibold">
                Ada
              </p>
              <PreviewLiveThread />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
