"use client";

import { memo } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/auth-provider";
import { ChatAvatar } from "@/features/chat/chat-ui";
import { formatInboxTime } from "@/features/inbox/format-inbox-time";
import { conversationTitle } from "@/lib/conversation-title";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";

type ConversationRowProps = {
  conversation: Conversation;
  selected: boolean;
};

/**
 * Preview text for an inbox row. Groups prefix the sender name.
 * @param conversation - Inbox item
 * @param myUserId - Signed-in user
 * @returns string
 */
function lastMessagePreview(
  conversation: Conversation,
  myUserId: string | undefined,
): string {
  if (!conversation.lastMessage) {
    return "No messages yet";
  }
  if (conversation.type !== "group") {
    return conversation.lastMessage.text;
  }
  const mine = conversation.lastMessage.senderId === myUserId;
  const sender = mine
    ? "You"
    : (conversation.participants.find(
        (person) => person.id === conversation.lastMessage?.senderId,
      )?.name ?? "Someone");
  return `${sender}: ${conversation.lastMessage.text}`;
}

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
  const { user } = useAuth();
  const title = conversationTitle(conversation);
  const preview = lastMessagePreview(conversation, user?.id);
  const stamp = conversation.lastMessage?.createdAt
    ? formatInboxTime(conversation.lastMessage.createdAt)
    : "";

  return (
    <Link
      href={`/app?c=${conversation.id}`}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3 transition-all",
        selected
          ? "border-landing-primary/20 bg-landing-primary-soft/80 shadow-xs"
          : "border-transparent hover:bg-slate-100/70",
      )}
    >
      <ChatAvatar name={title} />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <h4 className="flex min-w-0 items-center gap-1.5 truncate text-xs font-bold text-landing-ink">
            <span className="truncate">{title}</span>
            {conversation.type === "group" ? (
              <span className="shrink-0 rounded border border-amber-200 bg-amber-50 px-1 font-landing-mono text-[9px] font-medium text-amber-700">
                GROUP
              </span>
            ) : null}
          </h4>
          {stamp ? (
            <span
              className={cn(
                "shrink-0 font-landing-mono text-[10px]",
                selected
                  ? "font-medium text-landing-primary"
                  : "text-landing-muted-light",
              )}
            >
              {stamp}
            </span>
          ) : null}
        </div>
        <p className="truncate font-chat text-xs text-landing-muted">{preview}</p>
      </div>
    </Link>
  );
}

export const ConversationRow = memo(ConversationRowComponent);
