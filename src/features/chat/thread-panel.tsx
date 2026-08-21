"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThreadPanelProps = {
  conversationId: string | null;
};

/**
 * Right pane: empty state, or thread chrome when `?c=` is set.
 * @param props.conversationId - Selected conversation from the URL, or null
 * @returns JSX.Element
 */
export function ThreadPanel({ conversationId }: ThreadPanelProps) {
  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-lg font-medium">Select a conversation</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Pick someone from the list to read and send messages. Inbox data
          comes in the next step.
        </p>
      </div>
    );
  }

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
          <p className="truncate font-medium">Conversation</p>
          <p className="truncate text-xs text-muted-foreground">
            Messages will appear here
          </p>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      </div>
    </div>
  );
}
