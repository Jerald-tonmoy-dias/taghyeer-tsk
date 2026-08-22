import { Suspense } from "react";
import { ChatShell } from "@/features/chat/chat-shell";
import { ChatWorkspace } from "@/features/chat/chat-workspace";

/**
 * Placeholder while `useSearchParams` hydrates the chat shell.
 * @returns JSX.Element
 */
function ChatShellFallback() {
  return (
    <div className="flex h-dvh">
      <div className="hidden w-80 border-r border-landing-border bg-landing-surface p-4 md:block">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-100" />
      </div>
      <div className="flex flex-1 items-center justify-center bg-slate-50/50">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

/**
 * Signed-in chat workspace.
 * @returns JSX.Element
 */
export default function ChatPage() {
  return (
    <ChatWorkspace>
      <Suspense fallback={<ChatShellFallback />}>
        <ChatShell />
      </Suspense>
    </ChatWorkspace>
  );
}
