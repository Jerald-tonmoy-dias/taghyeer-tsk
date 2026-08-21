import { apiRequest } from "@/lib/api/client";
import type { ApiMessage } from "@/lib/api/dto";
import { mapMessage } from "@/lib/mappers";
import type { ConversationId, Message } from "@/lib/types";

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
