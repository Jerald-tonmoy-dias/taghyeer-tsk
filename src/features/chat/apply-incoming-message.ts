import type { QueryClient } from "@tanstack/react-query";
import {
  appendMessageToThread,
  messageQueryKey,
  patchInboxLastMessage,
  type MessageThread,
} from "@/features/thread/message-cache";
import type { Conversation, Message, UserId } from "@/lib/types";

/**
 * Apply a live incoming message to the Query cache.
 * Own sends are ignored (already appended from REST). Unopened threads are
 * not seeded so the first open still loads history from the API.
 * @param queryClient - App Query client
 * @param message - Mapped socket payload
 * @param myUserId - Signed-in user
 * @returns void
 */
export function applyIncomingMessage(
  queryClient: QueryClient,
  message: Message,
  myUserId: UserId,
): void {
  if (message.senderId === myUserId) {
    return;
  }

  queryClient.setQueryData<MessageThread>(
    messageQueryKey(message.conversationId),
    (thread) => {
      if (!thread) {
        return thread;
      }
      return appendMessageToThread(thread, message);
    },
  );

  queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) =>
    patchInboxLastMessage(inbox, message),
  );
}
