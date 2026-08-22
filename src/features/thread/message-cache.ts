import type { Conversation, Message } from "@/lib/types";

export type MessageThread = {
  messages: Message[];
  hasMore: boolean;
};

/**
 * Query key for one conversation’s history.
 * @param conversationId - Open thread
 * @returns readonly [string, string]
 */
export function messageQueryKey(conversationId: string) {
  return ["messages", conversationId] as const;
}

/**
 * Append a sent message if it is not already in the thread.
 * @param thread - Cached page, or undefined if none loaded yet
 * @param message - REST send response
 * @returns MessageThread
 */
export function appendMessageToThread(
  thread: MessageThread | undefined,
  message: Message,
): MessageThread {
  if (!thread) {
    return { messages: [message], hasMore: false };
  }
  if (thread.messages.some((item) => item.id === message.id)) {
    return thread;
  }
  return { ...thread, messages: [...thread.messages, message] };
}

/**
 * Prepend an older API page (newest-first) onto a thread shown oldest → newest.
 * Duplicate ids are dropped. An empty or all-duplicate page stops further loads.
 * @param thread - Cached thread, or undefined if none
 * @param olderNewestFirst - Next page as the API returns it
 * @param hasMore - `hasMore` from that page
 * @returns MessageThread
 */
export function prependOlderPage(
  thread: MessageThread | undefined,
  olderNewestFirst: Message[],
  hasMore: boolean,
): MessageThread {
  const older = [...olderNewestFirst].reverse();
  if (!thread) {
    return { messages: older, hasMore };
  }

  const seen = new Set(thread.messages.map((item) => item.id));
  const unique = older.filter((item) => !seen.has(item.id));
  if (unique.length === 0) {
    return { ...thread, hasMore: false };
  }

  return {
    messages: [...unique, ...thread.messages],
    hasMore,
  };
}

/**
 * Patch the matching inbox row’s last message after a send.
 * @param inbox - Cached conversation list
 * @param message - REST send response
 * @returns Conversation[] | undefined
 */
export function patchInboxLastMessage(
  inbox: Conversation[] | undefined,
  message: Message,
): Conversation[] | undefined {
  if (!inbox) {
    return inbox;
  }
  return inbox.map((row) =>
    row.id === message.conversationId
      ? {
          ...row,
          lastMessage: {
            text: message.text,
            senderId: message.senderId,
            createdAt: message.createdAt,
          },
        }
      : row,
  );
}
