/**
 * Format a message timestamp for the bubble.
 * @param createdAt - Milliseconds since 1 Jan 1970
 * @returns string
 */
export function formatMessageTime(createdAt: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(createdAt);
}
