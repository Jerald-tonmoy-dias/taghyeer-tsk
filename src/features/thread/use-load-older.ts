"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  messageQueryKey,
  prependOlderPage,
  type MessageThread,
} from "@/features/thread/message-cache";
import { getMessages } from "@/lib/api/conversations";
import { isApiError } from "@/lib/api/error";
import type { ConversationId, MessageId } from "@/lib/types";

export const MESSAGE_PAGE_SIZE = 30;

type UseLoadOlderOptions = {
  conversationId: ConversationId;
  hasMore: boolean;
  oldestId: MessageId | undefined;
  messageCount: number;
  viewportRef: RefObject<HTMLElement | null>;
  sentinelRef: RefObject<HTMLElement | null>;
};

type UseLoadOlderResult = {
  isLoadingOlder: boolean;
  olderError: string | null;
  holdScrollRef: RefObject<boolean>;
  retryOlder: () => void;
};

/**
 * Fetch the next older page when the top sentinel is visible.
 * Restores scroll so the bubble the user was reading stays put.
 * @param options - Thread id, cursor, and scroll refs
 * @returns UseLoadOlderResult
 */
export function useLoadOlder({
  conversationId,
  hasMore,
  oldestId,
  messageCount,
  viewportRef,
  sentinelRef,
}: UseLoadOlderOptions): UseLoadOlderResult {
  const queryClient = useQueryClient();
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [olderError, setOlderError] = useState<string | null>(null);
  const inFlightRef = useRef(false);
  const holdScrollRef = useRef(false);
  const restoreHeightRef = useRef<number | null>(null);

  const loadOlder = useCallback(async () => {
    if (!hasMore || !oldestId || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setIsLoadingOlder(true);
    setOlderError(null);

    try {
      const page = await getMessages(conversationId, {
        limit: MESSAGE_PAGE_SIZE,
        before: oldestId,
      });
      holdScrollRef.current = true;
      restoreHeightRef.current = viewportRef.current?.scrollHeight ?? null;
      queryClient.setQueryData<MessageThread>(
        messageQueryKey(conversationId),
        (thread) => prependOlderPage(thread, page.messages, page.hasMore),
      );
    } catch (caught) {
      restoreHeightRef.current = null;
      holdScrollRef.current = false;
      setOlderError(
        isApiError(caught) ? caught.message : "Could not load older messages.",
      );
    } finally {
      inFlightRef.current = false;
      setIsLoadingOlder(false);
    }
  }, [conversationId, hasMore, oldestId, queryClient, viewportRef]);

  useLayoutEffect(() => {
    const previousHeight = restoreHeightRef.current;
    const viewport = viewportRef.current;
    if (previousHeight == null || !viewport) {
      return;
    }
    viewport.scrollTop += viewport.scrollHeight - previousHeight;
    restoreHeightRef.current = null;
    holdScrollRef.current = false;
  }, [messageCount, viewportRef]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = viewportRef.current;
    if (!sentinel || !root || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadOlder();
        }
      },
      { root, rootMargin: "80px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadOlder, sentinelRef, viewportRef]);

  return {
    isLoadingOlder,
    olderError,
    holdScrollRef,
    retryOlder: () => {
      void loadOlder();
    },
  };
}
