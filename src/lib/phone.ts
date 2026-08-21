const MIN_PHONE_DIGITS = 10;

/**
 * Strip spaces, dashes, dots, and parentheses from a phone field.
 * @param phone - Raw input
 * @returns string
 */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s().-]/g, "");
}

/**
 * Digits only, ignoring an optional leading `+`.
 * @param phone - Raw or normalized input
 * @returns string
 */
export function phoneDigits(phone: string): string {
  const normalized = normalizePhone(phone);
  const withoutPlus = normalized.startsWith("+")
    ? normalized.slice(1)
    : normalized;
  return withoutPlus;
}

/**
 * True when the value is digits (optional `+`) and at least 10 digits long.
 * The live API does not check format — it stores any string.
 * @param phone - Raw or normalized input
 * @returns boolean
 */
export function isValidPhone(phone: string): boolean {
  const digits = phoneDigits(phone);
  return /^\d+$/.test(digits) && digits.length >= MIN_PHONE_DIGITS;
}
