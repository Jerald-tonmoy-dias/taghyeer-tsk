"use client";

import { useLayoutEffect, useRef, type RefObject, type UIEvent } from "react";
import { isNearBottom, scrollToLatest } from "@/features/thread/stick-to-bottom";

type UseStickToBottomOptions = {
  conversationId: string;
  messageCount: number;
  forceToken: number;
  viewportRef: RefObject<HTMLElement | null>;
};

/**
 * Pin the thread to the latest message unless the user has scrolled up.
 * Opening a thread or sending always jumps to the latest.
 * @param options.conversationId - Open thread
 * @param options.messageCount - Visible messages
 * @param options.forceToken - Bumped after send
 * @param options.viewportRef - Scrollable pane
 * @returns {{ onScroll: (event: UIEvent<HTMLElement>) => void }}
 */
export function useStickToBottom({
  conversationId,
  messageCount,
  forceToken,
  viewportRef,
}: UseStickToBottomOptions): { onScroll: (event: UIEvent<HTMLElement>) => void } {
  const stuckRef = useRef(true);
  const prevIdRef = useRef(conversationId);
  const prevCountRef = useRef(0);
  const prevTokenRef = useRef(forceToken);

  /**
   * Record whether the user is still near the bottom.
   * @param event - Scroll on the message pane
   * @returns void
   */
  function onScroll(event: UIEvent<HTMLElement>) {
    stuckRef.current = isNearBottom(event.currentTarget);
  }

  useLayoutEffect(() => {
    const threadChanged = prevIdRef.current !== conversationId;
    if (threadChanged) {
      prevIdRef.current = conversationId;
      prevCountRef.current = 0;
      stuckRef.current = true;
    }

    const forced = forceToken !== prevTokenRef.current;
    prevTokenRef.current = forceToken;

    const countIncreased = messageCount > prevCountRef.current;
    prevCountRef.current = messageCount;

    const viewport = viewportRef.current;
    if (!viewport || messageCount === 0) {
      return;
    }

    const shouldScroll =
      threadChanged || forced || (countIncreased && stuckRef.current);
    if (shouldScroll) {
      scrollToLatest(viewport);
      stuckRef.current = true;
    }
  }, [conversationId, forceToken, messageCount, viewportRef]);

  return { onScroll };
}
