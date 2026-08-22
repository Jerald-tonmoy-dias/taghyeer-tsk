import type { Conversation } from "@/lib/types";

/**
 * Activity time for inbox sort: last message, else `updatedAt`.
 * @param conversation - Inbox row
 * @returns number — milliseconds since 1 Jan 1970
 */
export function conversationActivityTime(conversation: Conversation): number {
  if (conversation.lastMessage?.createdAt) {
    return conversation.lastMessage.createdAt;
  }
  const parsed = Date.parse(conversation.updatedAt);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Newest activity first. Does not mutate the input.
 * @param conversations - Inbox rows for one tab
 * @returns Conversation[]
 */
export function sortConversationsByLatest(
  conversations: Conversation[],
): Conversation[] {
  return [...conversations].sort(
    (left, right) =>
      conversationActivityTime(right) - conversationActivityTime(left),
  );
}
