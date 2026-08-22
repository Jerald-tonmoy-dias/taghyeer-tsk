import type { ReactNode } from "react";
import { Container } from "@/features/landing/container";
import { LandingAvatar } from "@/features/landing/landing-ui";
import { previewInbox } from "@/features/landing/preview-data";

/**
 * Check row under a spotlight heading.
 * @param props.children - Line
 * @returns JSX.Element
 */
function SpotlightCheck({ children }: { children: string }) {
  return (
    <li className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
        ✓
      </span>
      {children}
    </li>
  );
}

/**
 * Soft frame around a mini product mock.
 * @param props.children - Mock
 * @returns JSX.Element
 */
function SpotlightFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-blue-100/70 bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/60 p-4 shadow-xl shadow-slate-200/50 sm:p-7">
      {children}
    </div>
  );
}

/**
 * Three product tours: inbox tabs, composer, group create.
 * @returns JSX.Element
 */
export function LandingSpotlights() {
  return (
    <div className="w-full border-b border-landing-border/60 bg-white px-6 py-20 sm:px-12">
      <Container className="max-w-7xl space-y-28">
        <section
          id="channels"
          className="grid scroll-mt-24 grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <SpotlightFrame>
            <div className="overflow-hidden rounded-2xl border border-landing-border bg-white shadow-md">
              <div className="flex items-center justify-between border-b border-landing-border bg-slate-50/80 px-4 py-3">
                <span className="text-xs font-bold text-slate-800">Inbox</span>
              </div>
              <div className="flex items-center gap-6 border-b border-landing-border/60 px-4 pt-3 pb-1 text-[11px] font-bold tracking-wider uppercase">
                <span className="border-b-2 border-landing-primary pb-1 text-landing-primary">
                  Direct (3)
                </span>
                <span className="pb-1 text-slate-400">Groups</span>
              </div>
              <div className="space-y-2 p-3">
                {previewInbox.map((row) => (
                  <div
                    key={row.id}
                    className={
                      row.selected
                        ? "flex items-center gap-3 rounded-xl border border-landing-primary/20 bg-landing-primary-soft/80 p-2.5"
                        : "flex items-center gap-3 rounded-xl border border-landing-border/60 bg-slate-50/60 p-2.5"
                    }
                  >
                    <LandingAvatar
                      initials={row.initials}
                      tint={row.tint}
                      className="rounded-xl"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>{row.title}</span>
                        <span className="font-landing-mono text-[10px] text-landing-muted">
                          {row.time}
                        </span>
                      </div>
                      <p className="truncate font-chat text-xs text-landing-muted">
                        {row.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightFrame>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-landing-mono text-xs font-medium text-landing-primary">
              01 · Inbox
            </div>
            <h2 className="font-landing-display text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
              Direct and groups stay on their own tabs
            </h2>
            <p className="font-chat text-sm leading-relaxed text-landing-muted">
              The sidebar splits 1:1 chats and group rooms. Search by name or
              phone. Latest activity rises to the top.
            </p>
            <ul className="space-y-2.5 pt-2">
              <SpotlightCheck>
                Separate Direct and Groups tabs
              </SpotlightCheck>
              <SpotlightCheck>
                Search people by name or phone
              </SpotlightCheck>
              <SpotlightCheck>
                Unread mark on a closed chat when a line arrives
              </SpotlightCheck>
            </ul>
          </div>
        </section>

        <section
          id="composer"
          className="grid scroll-mt-24 grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <div className="space-y-4 lg:order-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-landing-mono text-xs font-medium text-emerald-800">
              02 · Composer
            </div>
            <h2 className="font-landing-display text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
              Send stays off until there is text
            </h2>
            <p className="font-chat text-sm leading-relaxed text-landing-muted">
              The API will store an empty message. The composer will not. Time
              sits on the bubble. Enter sends. Shift+Enter starts a new line.
            </p>
            <ul className="space-y-2.5 pt-2">
              <SpotlightCheck>Empty or whitespace send is blocked</SpotlightCheck>
              <SpotlightCheck>Timestamps on every bubble</SpotlightCheck>
              <SpotlightCheck>
                Enter to send, Shift+Enter for a newline
              </SpotlightCheck>
            </ul>
          </div>
          <SpotlightFrame>
            <div className="space-y-4 rounded-2xl border border-landing-border bg-white p-5 font-chat shadow-md">
              <div className="flex flex-col items-start">
                <div className="relative max-w-sm rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 pt-3 pb-2 text-xs leading-relaxed text-slate-900">
                  <p className="pr-12">You home yet?</p>
                  <span className="absolute right-3 bottom-1.5 font-landing-mono text-[10px] text-slate-400">
                    11:55 AM
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="relative max-w-sm rounded-2xl rounded-tr-sm bg-landing-primary px-4 pt-3 pb-2 text-xs leading-relaxed text-white shadow-sm shadow-landing-primary/15">
                  <p className="pr-14">Just walked in. Come over if you want tea.</p>
                  <span className="absolute right-3 bottom-1.5 font-landing-mono text-[10px] text-blue-100/90">
                    11:56 AM
                  </span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <div className="pb-2.5 text-xs text-slate-400">
                  Write a message…
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-xs">
                  <span className="font-landing-mono text-[11px] text-slate-400">
                    Shift+Enter for newline
                  </span>
                  <span className="rounded-lg bg-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-500">
                    Send
                  </span>
                </div>
              </div>
            </div>
          </SpotlightFrame>
        </section>

        <section
          id="governance"
          className="grid scroll-mt-24 grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16"
        >
          <SpotlightFrame>
            <div className="space-y-4 rounded-2xl border border-landing-border bg-white p-6 font-landing-sans shadow-md">
              <div className="flex items-center justify-between border-b border-landing-border pb-3">
                <span className="text-xs font-bold text-slate-900">
                  Create group
                </span>
                <span className="rounded border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-landing-mono text-[10px] font-medium text-amber-800">
                  Min 3 people
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Group name
                </p>
                <div className="rounded-xl border border-landing-border bg-slate-50 p-2.5 text-xs font-semibold text-slate-800">
                  Kitchen table
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  People
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-xl border border-landing-border bg-slate-50 p-2.5 text-xs">
                    <span className="font-medium text-slate-800">
                      Grace Hopper
                    </span>
                    <span className="font-bold text-emerald-600">✓</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-landing-border bg-slate-50 p-2.5 text-xs">
                    <span className="font-medium text-slate-800">
                      Alan Turing
                    </span>
                    <span className="font-bold text-emerald-600">✓</span>
                  </div>
                </div>
              </div>
              <div className="w-full rounded-xl bg-landing-primary py-2.5 text-center text-xs font-bold text-white">
                Create group
              </div>
            </div>
          </SpotlightFrame>
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 font-landing-mono text-xs font-medium text-purple-800">
              03 · Groups
            </div>
            <h2 className="font-landing-display text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
              Create a group, then manage it in the room
            </h2>
            <p className="font-chat text-sm leading-relaxed text-landing-muted">
              You need two other people (three total) before create runs. After
              that, room details can rename the group, add people, remove
              people, or let you leave.
            </p>
            <ul className="space-y-2.5 pt-2">
              <SpotlightCheck>
                Form checks the 3-person minimum before the API call
              </SpotlightCheck>
              <SpotlightCheck>
                Rename, add, and remove from room details
              </SpotlightCheck>
              <SpotlightCheck>
                Log out asks you to confirm first
              </SpotlightCheck>
            </ul>
          </div>
        </section>
      </Container>
    </div>
  );
}
