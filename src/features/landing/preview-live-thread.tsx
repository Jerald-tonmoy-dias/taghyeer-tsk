"use client";

import { useEffect, useState } from "react";
import {
  previewIncoming,
  previewThread,
  type PreviewBubble,
} from "@/features/landing/preview-data";
import { cn } from "@/lib/utils";

/**
 * One fake bubble. Own messages use the AA button fill; others use tint.
 * @param props.bubble - Static message
 * @param props.fresh - Just arrived (for a short fade-in)
 * @returns JSX.Element
 */
function PreviewBubbleRow({
  bubble,
  fresh,
}: {
  bubble: PreviewBubble;
  fresh?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex",
        bubble.mine ? "justify-end" : "justify-start",
        fresh && "animate-in fade-in slide-in-from-bottom-2 duration-500",
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2",
          bubble.mine
            ? "bg-landing-button text-white"
            : "bg-landing-tint text-landing-ink",
        )}
      >
        <p className="text-sm leading-relaxed">{bubble.text}</p>
        <p
          className={cn(
            "mt-1 text-[11px]",
            bubble.mine ? "text-white/80" : "text-landing-ink/60",
          )}
        >
          {bubble.time}
        </p>
      </div>
    </div>
  );
}

/**
 * Renders the static thread, then appends one incoming line after a pause.
 * Without JS the three server-rendered bubbles in the parent still stand...
 * this client tree hydrates over the same first three.
 * @returns JSX.Element
 */
export function PreviewLiveThread() {
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setArrived(true);
    }, 2800);
    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col justify-end gap-2 px-4 py-4">
      {previewThread.map((bubble) => (
        <PreviewBubbleRow key={bubble.id} bubble={bubble} />
      ))}
      {arrived ? (
        <PreviewBubbleRow bubble={previewIncoming} fresh />
      ) : null}
    </div>
  );
}
