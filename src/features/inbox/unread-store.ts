import { useLayoutEffect, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Set<Listener>();
const unreadIds = new Set<string>();
let openConversationId: string | null = null;
let snapshot: ReadonlySet<string> = new Set();

/**
 * Notify inbox rows that unread ids changed.
 * @returns void
 */
function emit(): void {
  snapshot = new Set(unreadIds);
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Subscribe to session unread changes.
 * @param listener - Re-render callback
 * @returns () => void
 */
export function subscribeUnread(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Current unread conversation ids (open chat is never included).
 * @returns ReadonlySet<string>
 */
export function getUnreadSnapshot(): ReadonlySet<string> {
  return snapshot;
}

/**
 * Remember the open thread and drop its unread mark.
 * @param conversationId - `?c=` or null
 * @returns void
 */
export function setOpenConversationId(conversationId: string | null): void {
  openConversationId = conversationId;
  if (conversationId && unreadIds.delete(conversationId)) {
    emit();
  }
}

/**
 * Mark a chat unread unless it is the open thread.
 * @param conversationId - Conversation that received a live message
 * @returns void
 */
export function markConversationUnread(conversationId: string): void {
  if (conversationId === openConversationId || unreadIds.has(conversationId)) {
    return;
  }
  unreadIds.add(conversationId);
  emit();
}

/**
 * Drop every session unread mark (logout / leave `/app`).
 * @returns void
 */
export function clearAllUnread(): void {
  openConversationId = null;
  if (unreadIds.size === 0) {
    return;
  }
  unreadIds.clear();
  emit();
}

/**
 * Session-only unread conversation ids for the inbox.
 * @returns ReadonlySet<string>
 */
export function useUnreadConversationIds(): ReadonlySet<string> {
  return useSyncExternalStore(
    subscribeUnread,
    getUnreadSnapshot,
    getUnreadSnapshot,
  );
}

/**
 * Treat `?c=` as read and ignore further marks for that id while it is open.
 * @param conversationId - Open conversation, or null
 * @returns void
 */
export function useSyncOpenConversation(conversationId: string | null): void {
  useLayoutEffect(() => {
    setOpenConversationId(conversationId);
  }, [conversationId]);
}
