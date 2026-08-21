"use client";

import { useSearchParams } from "next/navigation";
import { ChatSidebar } from "@/features/chat/chat-sidebar";
import { ThreadPanel } from "@/features/chat/thread-panel";
import { cn } from "@/lib/utils";

/**
 * Two-pane chat layout. Desktop always shows both; mobile shows the list or
 * the thread from `?c=`.
 * @returns JSX.Element
 */
export function ChatShell() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");
  const isThreadOpen = Boolean(conversationId);

  return (
    <div className="flex h-dvh min-h-0 bg-background">
      <aside
        className={cn(
          "h-full w-full shrink-0 border-r md:w-80",
          isThreadOpen ? "hidden md:block" : "block",
        )}
      >
        <ChatSidebar selectedId={conversationId} />
      </aside>
      <section
        className={cn(
          "h-full min-w-0 flex-1",
          isThreadOpen ? "block" : "hidden md:block",
        )}
      >
        <ThreadPanel conversationId={conversationId} />
      </section>
    </div>
  );
}
