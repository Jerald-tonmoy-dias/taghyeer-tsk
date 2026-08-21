/**
 * E.164: `+` then 10–15 digits, first digit 1–9.
 * Covers Bangladesh (`+8801712345678`) and other country codes (`+15551234567`).
 */
const E164_PHONE = /^\+[1-9]\d{9,14}$/;

/**
 * Strip spaces, dashes, dots, and parentheses from a phone field.
 * @param phone - Raw input
 * @returns string
 */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s().-]/g, "");
}

/**
 * Whether the value is an E.164 number (must start with `+`).
 * The live API does not check this — it stores any string.
 * @param phone - Raw or normalized input
 * @returns boolean
 */
export function isValidPhone(phone: string): boolean {
  return E164_PHONE.test(normalizePhone(phone));
}
