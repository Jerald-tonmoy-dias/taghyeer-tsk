const NEAR_BOTTOM_PX = 80;

/**
 * Whether the viewport is within `NEAR_BOTTOM_PX` of the latest message.
 * @param element - Scrollable message pane
 * @returns boolean
 */
export function isNearBottom(element: HTMLElement): boolean {
  const distance =
    element.scrollHeight - element.scrollTop - element.clientHeight;
  return distance <= NEAR_BOTTOM_PX;
}

/**
 * Jump the viewport to the latest message.
 * @param element - Scrollable message pane
 * @returns void
 */
export function scrollToLatest(element: HTMLElement): void {
  element.scrollTop = element.scrollHeight;
}
