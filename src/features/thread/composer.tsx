"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  appendMessageToThread,
  messageQueryKey,
  patchInboxLastMessage,
  type MessageThread,
} from "@/features/thread/message-cache";
import { isApiError } from "@/lib/api/error";
import { sendMessage } from "@/lib/api/messages";
import type { Conversation, ConversationId } from "@/lib/types";

type ComposerProps = {
  conversationId: ConversationId;
  onSent: () => void;
};

/**
 * Thread composer. Empty or whitespace-only text never calls the API.
 * @param props.conversationId - Open conversation
 * @param props.onSent - Called after a successful send so the list can scroll
 * @returns JSX.Element
 */
export function Composer({ conversationId, onSent }: ComposerProps) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const canSend = text.trim().length > 0;

  useEffect(() => {
    setText("");
    setError(null);
  }, [conversationId]);

  const send = useMutation({
    mutationFn: () => sendMessage({ conversationId, text }),
    onSuccess: (message) => {
      setText("");
      setError(null);
      queryClient.setQueryData<MessageThread>(
        messageQueryKey(conversationId),
        (thread) => appendMessageToThread(thread, message),
      );
      queryClient.setQueryData<Conversation[]>(["conversations"], (inbox) =>
        patchInboxLastMessage(inbox, message),
      );
      onSent();
    },
    onError: (caught) => {
      setError(isApiError(caught) ? caught.message : "Could not send.");
    },
  });

  /**
   * Enter sends; Shift+Enter inserts a newline.
   * @param event - Keydown on the textarea
   * @returns void
   */
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    if (!canSend || send.isPending) {
      return;
    }
    send.mutate();
  }

  return (
    <form
      className="border-t px-3 py-2 md:px-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canSend || send.isPending) {
          return;
        }
        send.mutate();
      }}
    >
      <div className="flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Message"
          rows={1}
          disabled={send.isPending}
          className="max-h-32 min-h-10 resize-none"
          aria-label="Message"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!canSend || send.isPending}
          aria-label="Send"
        >
          <Send />
        </Button>
      </div>
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : null}
    </form>
  );
}
