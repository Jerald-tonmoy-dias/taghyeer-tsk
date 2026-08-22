import { formatMessageTime } from "@/features/thread/format-message-time";

/**
 * Compact inbox timestamp: time today, otherwise Yesterday or a short date.
 * @param createdAt - Milliseconds since 1 Jan 1970
 * @returns string
 */
export function formatInboxTime(createdAt: number): string {
  const now = new Date();
  const then = new Date(createdAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = new Date(then.getFullYear(), then.getMonth(), then.getDate()).getTime();
  const oneDay = 86_400_000;

  if (day === today) {
    return formatMessageTime(createdAt);
  }
  if (day === today - oneDay) {
    return "Yesterday";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(then);
}
