"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Composer } from "@/features/thread/composer";
import { MessageList } from "@/features/thread/message-list";
import { listConversations } from "@/lib/api/conversations";
import { conversationTitle } from "@/lib/conversation-title";

type ThreadPanelProps = {
  conversationId: string | null;
};

/**
 * Right pane: empty state, or thread chrome and history when `?c=` is set.
 * @param props.conversationId - Selected conversation from the URL, or null
 * @returns JSX.Element
 */
export function ThreadPanel({ conversationId }: ThreadPanelProps) {
  const [scrollToken, setScrollToken] = useState(0);
  const inboxQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    enabled: Boolean(conversationId),
  });

  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Pick someone from the list, or search to start a new chat.
        </p>
      </div>
    );
  }

  const conversation = inboxQuery.data?.find(
    (item) => item.id === conversationId,
  );
  const title = conversation ? conversationTitle(conversation) : "Conversation";
  const subtitle =
    conversation?.type === "direct"
      ? conversation.participant.phone
      : conversation?.type === "group"
        ? `${conversation.participants.length} people`
        : "";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-2 border-b px-3 py-3 md:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          asChild
          aria-label="Back to conversations"
        >
          <Link href="/app">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <MessageList
        conversationId={conversationId}
        conversation={conversation}
        scrollToken={scrollToken}
      />
      <Composer
        conversationId={conversationId}
        onSent={() => setScrollToken((token) => token + 1)}
      />
    </div>
  );
}
