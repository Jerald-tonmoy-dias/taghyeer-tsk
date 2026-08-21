"use client";

import { memo } from "react";
import Link from "next/link";
import { conversationTitle } from "@/lib/conversation-title";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type ConversationRowProps = {
  conversation: Conversation;
  selected: boolean;
};

/**
 * One inbox row. Direct chats show the other person; groups show the name.
 * @param props.conversation - Inbox item
 * @param props.selected - Whether this thread is open
 * @returns JSX.Element
 */
function ConversationRowComponent({
  conversation,
  selected,
}: ConversationRowProps) {
  const preview = conversation.lastMessage?.text ?? "No messages yet";

  return (
    <Link
      href={`/app?c=${conversation.id}`}
      className={cn(
        "block border-b px-4 py-3 transition-colors hover:bg-muted/70",
        selected && "bg-muted",
      )}
    >
      <p className="truncate text-sm font-medium">
        {conversationTitle(conversation)}
      </p>
      <p className="truncate text-xs text-muted-foreground">{preview}</p>
    </Link>
  );
}

export const ConversationRow = memo(ConversationRowComponent);
