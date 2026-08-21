import type { Conversation, UserId } from "@/lib/types";

/**
 * Sender name on group bubbles. Direct chats omit it.
 * @param conversation - Open thread, if loaded
 * @param senderId - Message sender
 * @returns string | undefined
 */
export function groupSenderName(
  conversation: Conversation | undefined,
  senderId: UserId,
): string | undefined {
  if (conversation?.type !== "group") {
    return undefined;
  }
  return conversation.participants.find((person) => person.id === senderId)
    ?.name;
}
