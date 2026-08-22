"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  previewInbox,
  previewThread,
  type PreviewBubble,
  type PreviewRow,
} from "@/features/landing/preview-data";
import { cn } from "@/lib/utils";

const AUTO_REPLY = "Got it — that landed in the thread.";
const REPLY_MS = 900;
const FIELD_CLASS =
  "rounded-xl border border-landing-border bg-landing-surface font-landing-sans text-xs text-landing-ink focus:border-landing-primary focus:outline-none";

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
 * One bubble in the mock thread.
 * @param props.bubble - Message
 * @returns JSX.Element
 */
function BubbleRow({ bubble }: { bubble: PreviewBubble }) {
  return (
    <div
      className={cn(
        "flex flex-col",
        bubble.mine ? "items-end" : "items-start",
      )}
    >
      <div
        className={cn(
          "max-w-sm rounded-2xl px-4 py-2.5 text-sm",
          bubble.mine
            ? "rounded-tr-sm bg-landing-primary text-landing-surface shadow-xs shadow-landing-primary/10"
            : "rounded-tl-sm border border-landing-border bg-landing-sand text-landing-ink",
        )}
      >
        {bubble.text}
      </div>
      <span
        className={cn(
          "mt-1 text-[10px] text-landing-muted",
          bubble.mine ? "mr-1" : "ml-1",
        )}
      >
        {bubble.time}
      </span>
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
        "rounded-xl p-3",
        row.selected
          ? "border border-landing-primary/40 bg-landing-surface shadow-xs"
          : "border border-transparent hover:bg-landing-surface/60",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs",
            row.selected
              ? "font-semibold text-landing-ink"
              : "font-medium text-landing-ink/80",
          )}
        >
          {row.online ? (
            <span className="h-2 w-2 rounded-full bg-landing-primary" />
          ) : null}
          {row.title}
        </span>
        <span className="text-[10px] text-landing-muted">{row.time}</span>
      </div>
      <p className="mt-1 truncate text-xs text-landing-muted">{preview}</p>
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
    <div className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-landing-border bg-landing-surface shadow-xl shadow-landing-ink/10 md:grid-cols-12">
      <aside className="flex flex-col justify-between border-b border-landing-border bg-landing-cream p-4 md:col-span-4 md:border-b-0 md:border-r">
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search number or name..."
              className={cn("w-full px-3 py-2", FIELD_CLASS)}
            />
          </div>
          <div className="flex items-center justify-between pb-2 text-[11px] font-semibold uppercase tracking-wider text-landing-muted">
            <span>Conversations</span>
            <span className="font-bold text-landing-primary">+ Group</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {previewInbox.map((row) => (
              <InboxRow
                key={row.id}
                row={row}
                preview={row.selected ? sidebarPreview : row.preview}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-landing-border pt-3 text-xs text-landing-muted">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-landing-primary font-landing-sans text-[10px] font-bold text-landing-surface">
              U
            </div>
            <span className="font-medium text-landing-ink">+1 (555) 019-2831</span>
          </div>
          <span className="rounded-full border border-landing-primary/20 bg-landing-primary-soft px-2 py-0.5 text-[10px] font-medium text-landing-primary">
            Signed in
          </span>
        </div>
      </aside>
      <section className="flex flex-col justify-between bg-landing-surface md:col-span-8">
        <div className="flex items-center justify-between border-b border-landing-border bg-landing-sand-light/50 p-4">
          <div>
            <h3 className="font-landing-display text-base font-medium text-landing-ink">
              Ada Lovelace
            </h3>
            <p className="text-[11px] text-landing-muted">
              +1 (555) 392-8812 • Direct 1:1
            </p>
          </div>
          <span className="rounded-full bg-landing-sand px-2.5 py-1 font-landing-mono text-[11px] text-landing-muted">
            Live
          </span>
        </div>
        <div
          ref={scrollerRef}
          className="max-h-[340px] flex-1 space-y-4 overflow-y-auto p-6"
        >
          {messages.map((bubble) => (
            <BubbleRow key={bubble.id} bubble={bubble} />
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-landing-border bg-landing-sand-light/50 p-4"
        >
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write a message"
            className={cn("flex-1 px-4 py-2.5", FIELD_CLASS)}
          />
          <button
            type="submit"
            className="rounded-xl bg-landing-primary px-5 py-2.5 font-landing-sans text-xs font-medium text-landing-surface shadow-xs shadow-landing-primary/20 transition-colors hover:bg-landing-primary-hover"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
