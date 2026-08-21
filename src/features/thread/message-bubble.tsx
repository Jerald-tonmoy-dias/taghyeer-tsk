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
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2",
          isMine
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {senderName ? (
          <p className="mb-0.5 text-xs font-medium">{senderName}</p>
        ) : null}
        <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        <p
          className={cn(
            "mt-1 text-[11px]",
            isMine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export const MessageBubble = memo(MessageBubbleComponent);
