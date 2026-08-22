"use client";

import { memo } from "react";
import { formatMessageTime } from "@/features/thread/format-message-time";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: Message;
  isMine: boolean;
  senderName?: string;
};

/**
 * One chat bubble. Own messages sit on the right; others on the left.
 * @param props.message - Domain message
 * @param props.isMine - Whether the signed-in user sent it
 * @param props.senderName - Shown above the text in group threads
 * @returns JSX.Element
 */
function MessageBubbleComponent({
  message,
  isMine,
  senderName,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col font-chat",
        isMine ? "items-end" : "items-start",
      )}
    >
      {senderName ? (
        <span className="mb-1 ml-2 font-landing-sans text-[11px] font-semibold text-indigo-700">
          {senderName}
        </span>
      ) : null}
      <div
        className={cn(
          "relative max-w-lg rounded-2xl px-4 pt-2.5 pb-2 text-[13.5px] leading-relaxed tracking-[-0.01em] shadow-xs",
          isMine
            ? "rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/15"
            : "rounded-tl-sm border border-landing-border bg-white text-slate-900",
        )}
      >
        <p className="pr-16 whitespace-pre-wrap break-words">{message.text}</p>
        <div
          className={cn(
            "absolute right-2.5 bottom-1.5 flex select-none items-center gap-1 font-landing-mono text-[10px]",
            isMine ? "text-blue-100/80" : "text-slate-400",
          )}
        >
          <span>{formatMessageTime(message.createdAt)}</span>
          {isMine && message.status !== "failed" ? (
            <svg
              className="h-3.5 w-3.5 text-blue-200"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleComponent);
