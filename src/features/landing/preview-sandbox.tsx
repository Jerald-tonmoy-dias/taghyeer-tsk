"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { LandingAvatar } from "@/features/landing/landing-ui";
import {
  previewInbox,
  previewThread,
  type PreviewBubble,
  type PreviewRow,
} from "@/features/landing/preview-data";
import { cn } from "@/lib/utils";

const AUTO_REPLY = "See you in five.";
const REPLY_MS = 900;

/**
 * Clock label for a mock send.
 * @returns Localized time
 */
function formatPreviewTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * One bubble in the mock thread. Time sits in the corner.
 * @param props.bubble - Message
 * @returns JSX.Element
 */
function BubbleRow({ bubble }: { bubble: PreviewBubble }) {
  return (
    <div
      className={cn("flex flex-col", bubble.mine ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "relative max-w-lg rounded-2xl px-4 pt-3 pb-2 text-[13px] leading-relaxed",
          bubble.mine
            ? "rounded-tr-sm bg-landing-primary text-landing-surface shadow-sm shadow-landing-primary/20"
            : "rounded-tl-sm border border-landing-border bg-landing-surface text-landing-ink shadow-xs",
        )}
      >
        <p className="pr-14">{bubble.text}</p>
        <span
          className={cn(
            "absolute right-3 bottom-1.5 font-landing-mono text-[11px]",
            bubble.mine ? "text-blue-100/90" : "text-landing-muted",
          )}
        >
          {bubble.time}
        </span>
      </div>
    </div>
  );
}

/**
 * One inbox row in the mock sidebar.
 * @param props.row - Conversation
 * @param props.preview - Last-line override when selected
 * @returns JSX.Element
 */
function InboxRow({ row, preview }: { row: PreviewRow; preview: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-2xl p-3",
        row.selected
          ? "border border-landing-primary/30 bg-landing-primary-soft/80"
          : "border border-transparent hover:bg-slate-50",
      )}
    >
      <LandingAvatar initials={row.initials} tint={row.tint} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span
            className={cn(
              "truncate",
              row.selected
                ? "font-bold text-landing-ink"
                : "font-semibold text-slate-800",
            )}
          >
            {row.title}
          </span>
          <span
            className={cn(
              "shrink-0 font-landing-mono text-[11px]",
              row.selected ? "font-medium text-landing-primary" : "text-slate-400",
            )}
          >
            {row.time}
          </span>
        </div>
        <p className="mt-0.5 truncate font-chat text-xs text-slate-500">
          {preview}
        </p>
      </div>
    </div>
  );
}

/**
 * Interactive two-pane mock. Empty send is blocked; a fake reply lands after a pause.
 * @returns JSX.Element
 */
export function PreviewSandbox() {
  const [messages, setMessages] = useState(previewThread);
  const [sidebarPreview, setSidebarPreview] = useState(
    previewInbox[0]?.preview ?? "",
  );
  const [text, setText] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const replyTimerRef = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      window.clearTimeout(replyTimerRef.current);
    };
  }, []);

  /**
   * Append the typed line, then a fake reply.
   * @param event - Form submit
   * @returns void
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = text.trim();
    if (!next) {
      return;
    }

    const mine: PreviewBubble = {
      id: crypto.randomUUID(),
      text: next,
      time: formatPreviewTime(),
      mine: true,
    };

    setMessages((current) => [...current, mine]);
    setSidebarPreview(`You: ${next}`);
    setText("");

    window.clearTimeout(replyTimerRef.current);
    replyTimerRef.current = window.setTimeout(() => {
      const reply: PreviewBubble = {
        id: crypto.randomUUID(),
        text: AUTO_REPLY,
        time: formatPreviewTime(),
        mine: false,
      };
      setMessages((current) => [...current, reply]);
      setSidebarPreview(AUTO_REPLY);
    }, REPLY_MS);
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-200/80 via-slate-100/40 to-slate-200/50 p-2.5 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.12)] sm:rounded-[36px] sm:p-4">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-landing-border/90 bg-landing-surface font-landing-sans shadow-xs sm:rounded-[28px]">
        <div className="flex items-center justify-between border-b border-landing-border bg-landing-surface px-6 py-3.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
              <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
              <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <span className="h-2.5 w-2.5 rounded-full bg-landing-primary" />
              Taghyeer
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden font-landing-mono text-xs font-medium text-landing-muted sm:inline">
              Preview
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-xs font-bold text-sky-700">
              AL
            </span>
          </div>
        </div>

        <div className="flex h-[480px] flex-col overflow-hidden bg-landing-surface md:flex-row">
          <aside className="flex w-full shrink-0 flex-col justify-between border-b border-landing-border md:w-80 md:border-r md:border-b-0">
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="border-b border-landing-border/60 p-4">
                <div className="flex items-center gap-2.5 rounded-xl border border-landing-border bg-slate-50 px-3.5 py-2 text-xs text-slate-400">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search by name or phone
                </div>
              </div>
              <div className="flex items-center gap-8 border-b border-landing-border/60 px-6 pt-3 pb-1 text-xs font-bold tracking-wider uppercase">
                <span className="border-b-2 border-landing-primary pb-1.5 text-landing-primary">
                  Direct (3)
                </span>
                <span className="pb-1.5 text-slate-400">Groups</span>
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
                {previewInbox.map((row) => (
                  <InboxRow
                    key={row.id}
                    row={row}
                    preview={row.selected ? sidebarPreview : row.preview}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-landing-border px-4 py-4 font-landing-mono text-xs text-slate-500">
              <span>+15551234567</span>
              <span className="flex items-center gap-1.5 font-landing-sans font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Signed in
              </span>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col justify-between bg-landing-surface p-6 font-chat">
            <div className="-mx-6 -mt-6 flex items-center justify-between border-b border-landing-border bg-landing-surface px-6 pt-4 pb-4">
              <div className="flex items-center gap-3.5">
                <LandingAvatar initials="GH" tint="indigo" />
                <div>
                  <h3 className="font-landing-sans text-sm font-bold text-slate-900">
                    Grace Hopper
                  </h3>
                  <p className="font-landing-mono text-xs text-slate-400">
                    +15554313361 · Direct
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-landing-border bg-landing-sand px-3 py-1 font-landing-mono text-xs text-landing-muted">
                Preview
              </span>
            </div>

            <div
              ref={scrollerRef}
              className="mx-auto my-auto w-full max-w-2xl space-y-4 overflow-y-auto py-4"
            >
              <div className="flex items-center justify-center">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1 font-landing-mono text-xs text-slate-400">
                  Today
                </span>
              </div>
              {messages.map((bubble) => (
                <BubbleRow key={bubble.id} bubble={bubble} />
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-2xl border border-slate-200 bg-landing-surface p-2.5 shadow-sm"
            >
              <input
                type="text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Message Grace Hopper…"
                aria-label="Write a preview message"
                className="min-w-0 flex-1 bg-transparent px-3 text-xs text-landing-ink placeholder:text-slate-400 focus:outline-none"
              />
              <div className="flex items-center gap-3">
                <span className="hidden font-landing-mono text-xs text-slate-400 sm:inline">
                  Enter to send
                </span>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-landing-primary text-landing-surface shadow-xs disabled:opacity-40"
                  disabled={!text.trim()}
                  aria-label="Send"
                >
                  <svg
                    className="h-4 w-4 translate-x-0.5 -translate-y-0.5 rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
