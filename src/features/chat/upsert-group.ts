import type { Conversation, GroupConversation } from "@/lib/types";

/**
 * Insert or replace a group in the inbox, keeping the last-message preview.
 * @param inbox - Cached conversation list
 * @param group - Latest group payload
 * @returns Conversation[]
 */
export function upsertGroupInInbox(
  inbox: Conversation[] | undefined,
  group: GroupConversation,
): Conversation[] {
  if (!inbox) {
    return [group];
  }

  const index = inbox.findIndex((item) => item.id === group.id);
  if (index === -1) {
    return [group, ...inbox];
  }

  return inbox.map((item) => {
    if (item.id !== group.id) {
      return item;
    }
    return {
      ...group,
      lastMessage:
        group.lastMessage ??
        (item.type === "group" ? item.lastMessage : undefined),
      updatedAt: group.updatedAt || item.updatedAt,
    };
  });
}
