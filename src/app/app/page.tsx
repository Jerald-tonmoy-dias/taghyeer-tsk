import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatShell } from "@/features/chat/chat-shell";

/**
 * Placeholder while `useSearchParams` hydrates the chat shell.
 * @returns JSX.Element
 */
function ChatShellFallback() {
  return (
    <div className="flex h-dvh">
      <div className="hidden w-80 border-r p-4 md:block">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}

/**
 * Signed-in chat app. Shell only — inbox data is the next ticket.
 * @returns JSX.Element
 */
export default function ChatPage() {
  return (
    <Suspense fallback={<ChatShellFallback />}>
      <ChatShell />
    </Suspense>
  );
}
