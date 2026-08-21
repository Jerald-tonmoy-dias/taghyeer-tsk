/**
 * Strip spaces, dashes, dots, and parentheses from a phone field.
 * @param phone - Raw input
 * @returns string
 */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/[\s().-]/g, "");
}

/**
 * Whether the value is a number (digits, optional leading `+`).
 * The live API does not check this — it stores any string.
 * @param phone - Raw or normalized input
 * @returns boolean
 */
export function isValidPhone(phone: string): boolean {
  const digits = normalizePhone(phone).replace(/^\+/, "");
  return digits.length > 0 && /^\d+$/.test(digits);
}
