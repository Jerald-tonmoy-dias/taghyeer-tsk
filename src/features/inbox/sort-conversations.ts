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
 * Unread chats first, then newest activity. Does not mutate the input.
 * @param conversations - Inbox rows for one tab
 * @param unreadIds - Session unread conversation ids
 * @returns Conversation[]
 */
export function sortConversationsByLatest(
  conversations: Conversation[],
  unreadIds: ReadonlySet<string> = new Set(),
): Conversation[] {
  return [...conversations].sort((left, right) => {
    const leftUnread = unreadIds.has(left.id) ? 1 : 0;
    const rightUnread = unreadIds.has(right.id) ? 1 : 0;
    if (leftUnread !== rightUnread) {
      return rightUnread - leftUnread;
    }
    return conversationActivityTime(right) - conversationActivityTime(left);
  });
}
