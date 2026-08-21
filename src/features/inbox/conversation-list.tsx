"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConversationRow } from "@/features/inbox/conversation-row";
import { listConversations } from "@/lib/api/conversations";

type ConversationListProps = {
  selectedId: string | null;
};

/**
 * Live inbox of 1:1 and group conversations.
 * @param props.selectedId - Open conversation from `?c=`
 * @returns JSX.Element
 */
export function ConversationList({ selectedId }: ConversationListProps) {
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
  });

  if (inboxQuery.isPending) {
    return (
      <div className="flex flex-col gap-2 px-4 py-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (inboxQuery.isError) {
    return (
      <div className="flex flex-col gap-2 px-4 py-6">
        <p className="text-sm text-destructive">Could not load conversations.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => void inboxQuery.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (inboxQuery.data.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-muted-foreground">
        No conversations yet. Search for someone to start a chat.
      </p>
    );
  }

  return (
    <div>
      {inboxQuery.data.map((conversation) => (
        <ConversationRow
          key={conversation.id}
          conversation={conversation}
          selected={conversation.id === selectedId}
        />
      ))}
    </div>
  );
}
