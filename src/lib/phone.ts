/** International phone: `+` then 8–15 digits, first digit 1–9 (E.164). */
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/;

/**
 * Strip spaces, dashes, dots, and parentheses from a phone field.
 * @param phone - Raw input
 * @returns string
 */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s().-]/g, "");
}

/**
 * Whether the value is a valid international phone number.
 * The live API does not check this — it stores any string.
 * @param phone - Raw or normalized input
 * @returns boolean
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_PATTERN.test(normalizePhone(phone));
}
