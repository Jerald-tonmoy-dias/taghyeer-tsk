import type { Conversation } from "@/lib/types";

/**
 * Display name for a conversation row or thread header.
 * @param conversation - Direct or group conversation
 * @returns string
 */
export function conversationTitle(conversation: Conversation): string {
  return conversation.type === "direct"
    ? conversation.participant.name
    : conversation.name;
}
