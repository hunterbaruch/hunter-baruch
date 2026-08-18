/** US ZIP as exactly five digits. */
export function isValidUsZip(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

/**
 * Georgia ZIP prefixes: 300–319 and 398–399.
 * Used to warn (not block) visitors outside the licensed state.
 */
export function isGeorgiaZip(value: string): boolean {
  if (!isValidUsZip(value)) return false;
  const prefix = Number(value.trim().slice(0, 3));
  return (prefix >= 300 && prefix <= 319) || prefix === 398 || prefix === 399;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}
