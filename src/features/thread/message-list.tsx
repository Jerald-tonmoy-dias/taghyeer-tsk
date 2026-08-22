"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/auth-provider";
import {
  formatDateSeparator,
  messageDayKey,
} from "@/features/thread/format-date-separator";
import { groupSenderName } from "@/features/thread/group-sender-name";
import { MessageBubble } from "@/features/thread/message-bubble";
import {
  messageQueryKey,
  type MessageThread,
} from "@/features/thread/message-cache";
import {
  MESSAGE_PAGE_SIZE,
  useLoadOlder,
} from "@/features/thread/use-load-older";
import { useStickToBottom } from "@/features/thread/use-stick-to-bottom";
import { getMessages } from "@/lib/api/conversations";
import type { Conversation } from "@/lib/types";

type MessageListProps = {
  conversationId: string;
  conversation?: Conversation;
  scrollToken: number;
};

/**
 * Load a thread’s latest page and render oldest → newest.
 * Stays pinned to the latest message unless the user scrolls up.
 * Older pages load when the top sentinel is visible.
 * @param props.conversationId - Open conversation
 * @param props.conversation - Inbox row, used for group sender names
 * @param props.scrollToken - Incremented after send to jump to the latest
 * @returns JSX.Element
 */
export function MessageList({
  conversationId,
  conversation,
  scrollToken,
}: MessageListProps) {
  const { user } = useAuth();
  const viewportRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const messagesQuery = useQuery({
    queryKey: messageQueryKey(conversationId),
    queryFn: async (): Promise<MessageThread> => {
      const page = await getMessages(conversationId, {
        limit: MESSAGE_PAGE_SIZE,
      });
      return {
        messages: [...page.messages].reverse(),
        hasMore: page.hasMore,
      };
    },
  });

  const messages = messagesQuery.data?.messages ?? [];
  const messageCount = messages.length;
  const hasMore = messagesQuery.data?.hasMore ?? false;
  const oldestId = messages[0]?.id;

  const { isLoadingOlder, olderError, holdScrollRef, retryOlder } =
    useLoadOlder({
      conversationId,
      hasMore,
      oldestId,
      messageCount,
      viewportRef,
      sentinelRef,
    });

  const { onScroll } = useStickToBottom({
    conversationId,
    messageCount,
    forceToken: scrollToken,
    viewportRef,
    holdScrollRef,
  });

  if (messagesQuery.isPending) {
    return (
      <div className="flex flex-1 flex-col justify-end gap-3 px-6 py-6">
        <div className="h-12 w-2/3 animate-pulse self-start rounded-2xl bg-white" />
        <div className="h-12 w-1/2 animate-pulse self-end rounded-2xl bg-blue-100" />
        <div className="h-12 w-3/5 animate-pulse self-start rounded-2xl bg-white" />
      </div>
    );
  }

  if (messagesQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm text-rose-600">Could not load messages.</p>
        <button
          type="button"
          className="text-xs font-semibold text-landing-primary hover:underline"
          onClick={() => void messagesQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-landing-muted">No messages yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      className="min-h-0 flex-1 overflow-y-auto px-6 py-6"
    >
      <div
        ref={sentinelRef}
        className="flex min-h-1 justify-center py-1"
        aria-hidden={!hasMore && !isLoadingOlder && !olderError}
      >
        {isLoadingOlder ? (
          <p className="text-[11px] text-landing-muted">Loading older…</p>
        ) : olderError ? (
          <button
            type="button"
            className="text-[11px] font-semibold text-rose-600 hover:underline"
            onClick={retryOlder}
          >
            {olderError} Try again
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-3.5">
        {messages.map((message, index) => {
          const isMine = message.senderId === user?.id;
          const day = messageDayKey(message.createdAt);
          const previous = messages[index - 1];
          const previousDay = previous
            ? messageDayKey(previous.createdAt)
            : "";
          const showDate = day !== previousDay;
          return (
            <div key={message.id}>
              {showDate ? (
                <div className="my-3 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 rounded-full border border-landing-border bg-white px-3.5 py-1 font-landing-sans text-[11px] font-medium text-landing-muted shadow-xs">
                    <svg
                      className="h-3 w-3 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDateSeparator(message.createdAt)}</span>
                  </div>
                </div>
              ) : null}
              <MessageBubble
                message={message}
                isMine={isMine}
                senderName={
                  isMine
                    ? undefined
                    : groupSenderName(conversation, message.senderId)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
