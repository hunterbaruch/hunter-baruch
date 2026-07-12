/**
 * Lead data retention helpers.
 *
 * COMPLIANCE ASSUMPTION: Default retention is 24 months from createdAt.
 * Confirm with Hunter's E&O carrier and compliance advisor before treating
 * this as the final retention period for nonpublic customer information.
 */

export const RETENTION_MONTHS = Number(
  process.env.LEAD_RETENTION_MONTHS ?? "24",
);

export function computeRetentionExpiresAt(
  from: Date = new Date(),
  months: number = RETENTION_MONTHS,
): Date {
  const expires = new Date(from);
  expires.setMonth(expires.getMonth() + months);
  return expires;
}
