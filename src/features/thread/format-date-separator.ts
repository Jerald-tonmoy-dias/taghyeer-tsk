/**
 * Calendar-day key for grouping bubbles.
 * @param createdAt - Milliseconds since 1 Jan 1970
 * @returns string
 */
export function messageDayKey(createdAt: number): string {
  const date = new Date(createdAt);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * Date pill label, e.g. `Today, August 22, 2026`.
 * @param createdAt - Milliseconds since 1 Jan 1970
 * @returns string
 */
export function formatDateSeparator(createdAt: number): string {
  const date = new Date(createdAt);
  const now = new Date();
  const formatted = new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  if (messageDayKey(createdAt) === messageDayKey(now.getTime())) {
    return `Today, ${formatted}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (messageDayKey(createdAt) === messageDayKey(yesterday.getTime())) {
    return `Yesterday, ${formatted}`;
  }

  return formatted;
}
