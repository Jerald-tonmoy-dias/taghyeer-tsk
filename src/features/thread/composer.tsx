"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EmojiPicker } from "@/features/thread/emoji-picker";
import {
  appendMessageToThread,
  messageQueryKey,
  patchInboxLastMessage,
  type MessageThread,
} from "@/features/thread/message-cache";
import { isApiError } from "@/lib/api/error";
import { sendMessage } from "@/lib/api/messages";
import type { Conversation, ConversationId } from "@/lib/types";
import { cn } from "@/lib/utils";

type ComposerProps = {
  conversationId: ConversationId;
  placeholder: string;
  onSent: () => void;
};

/**
 * Thread composer. Empty or whitespace-only text never calls the API.
 * @param props.conversationId - Open conversation
 * @param props.placeholder - Input hint with the chat title
 * @param props.onSent - Called after a successful send so the list can scroll
 * @returns JSX.Element
 */
export function Composer({
  conversationId,
  placeholder,
  onSent,
}: ComposerProps) {
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const canSend = text.trim().length > 0;

  const send = useMutation({
    mutationFn: () => sendMessage({ conversationId, text }),
    onSuccess: (message) => {
      setText("");
      setError(null);
      setEmojiOpen(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = "24px";
      }
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
   * Grow the textarea up to a max height.
   * @param value - Current draft
   * @returns void
   */
  function resize(value: string) {
    const node = textareaRef.current;
    if (!node) {
      return;
    }
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 128)}px`;
    setText(value);
  }

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
    <div className="shrink-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent px-4 py-4 font-chat md:px-6">
      <form
        className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-landing-border bg-white shadow-md shadow-slate-200/50 transition-all focus-within:border-landing-primary focus-within:ring-4 focus-within:ring-landing-primary/10"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSend || send.isPending) {
            return;
          }
          send.mutate();
        }}
      >
        <div className="px-4 pt-3.5 pb-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => {
              resize(event.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={send.isPending}
            className="max-h-32 w-full resize-none overflow-y-auto border-0 bg-transparent text-[13.5px] leading-relaxed text-landing-ink placeholder:text-landing-muted-light focus:outline-none disabled:opacity-60"
            style={{ height: 24 }}
            aria-label="Message"
          />
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-3 py-2">
          <div className="relative flex items-center gap-1.5 text-slate-400">
            {emojiOpen ? (
              <EmojiPicker
                onPick={(emoji) => {
                  resize(`${text}${emoji}`);
                  setEmojiOpen(false);
                  textareaRef.current?.focus();
                }}
              />
            ) : null}
            <button
              type="button"
              onClick={() => setEmojiOpen((open) => !open)}
              className="rounded-lg p-1.5 transition-colors hover:bg-slate-200/60 hover:text-landing-ink"
              title="Insert emoji"
              aria-label="Insert emoji"
              aria-expanded={emojiOpen}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <span className="mx-0.5 h-3.5 w-px bg-slate-200" />
            <span className="hidden select-none font-landing-mono text-[11px] text-slate-400 sm:inline">
              <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 font-landing-sans text-[10px] text-slate-600 shadow-xs">
                Shift+Enter
              </kbd>{" "}
              newline
            </span>
          </div>
          <button
            type="submit"
            disabled={!canSend || send.isPending}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
              canSend && !send.isPending
                ? "cursor-pointer bg-landing-primary text-white shadow-sm shadow-blue-500/25 hover:bg-landing-primary-hover active:scale-95"
                : "cursor-not-allowed bg-slate-200 text-slate-400 opacity-60",
            )}
            title="Send (Enter)"
          >
            <span>{send.isPending ? "Sending…" : "Send"}</span>
            <svg
              className="h-3.5 w-3.5 -translate-y-0.5 rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
      {error ? (
        <p className="mx-auto mt-2 max-w-4xl text-xs text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
