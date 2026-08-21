"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { groupSenderName } from "@/features/thread/group-sender-name";
import { MessageBubble } from "@/features/thread/message-bubble";
import {
  messageQueryKey,
  type MessageThread,
} from "@/features/thread/message-cache";
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
  const messagesQuery = useQuery({
    queryKey: messageQueryKey(conversationId),
    queryFn: async (): Promise<MessageThread> => {
      const page = await getMessages(conversationId, { limit: 30 });
      return {
        messages: [...page.messages].reverse(),
        hasMore: page.hasMore,
      };
    },
  });

  const messageCount = messagesQuery.data?.messages.length ?? 0;
  const { onScroll } = useStickToBottom({
    conversationId,
    messageCount,
    forceToken: scrollToken,
    viewportRef,
  });

  if (messagesQuery.isPending) {
    return (
      <div className="flex flex-1 flex-col justify-end gap-3 px-4 py-4">
        <Skeleton className="h-12 w-2/3 self-start rounded-2xl" />
        <Skeleton className="h-12 w-1/2 self-end rounded-2xl" />
        <Skeleton className="h-12 w-3/5 self-start rounded-2xl" />
      </div>
    );
  }

  if (messagesQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-sm text-destructive">Could not load messages.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void messagesQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (messagesQuery.data.messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      onScroll={onScroll}
      className="min-h-0 flex-1 overflow-y-auto"
    >
      <div className="flex flex-col gap-2 px-4 py-4">
        {messagesQuery.data.messages.map((message) => {
          const isMine = message.senderId === user?.id;
          return (
            <MessageBubble
              key={message.id}
              message={message}
              isMine={isMine}
              senderName={
                isMine
                  ? undefined
                  : groupSenderName(conversation, message.senderId)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
