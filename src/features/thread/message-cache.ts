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
