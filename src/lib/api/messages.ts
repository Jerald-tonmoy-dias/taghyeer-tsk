import { apiRequest } from "@/lib/api/client";
import type { ApiMessage } from "@/lib/api/payloads";
import { mapMessage } from "@/lib/mappers";
import type { ConversationId, Message } from "@/lib/types";

/**
 * Send a message. Whitespace-only text is rejected before the request.
 * @param input.conversationId - Target conversation
 * @param input.text - Message body
 * @returns Promise<Message>
 */
export async function sendMessage(input: {
  conversationId: ConversationId;
  text: string;
}): Promise<Message> {
  const text = input.text.trim();
  if (!text) {
    throw new Error("Message text must not be empty");
  }

  const payload = await apiRequest<ApiMessage>("/messages", {
    method: "POST",
    body: {
      conversationId: input.conversationId,
      text,
    },
  });
  return mapMessage(payload);
}
