import { prisma } from "@/lib/prisma";

/**
 * Retention cleanup — mark then purge expired lead records.
 * Intended for scheduled/manual invocation, NOT the live request path.
 *
 * COMPLIANCE ASSUMPTION: 24-month default retention (see LEAD_RETENTION_MONTHS).
 * Confirm with Hunter's E&O carrier before production use.
 */

export type RetentionCleanupResult = {
  marked: number;
  purged: number;
};

/** Flag leads past retentionExpiresAt for deletion. */
export async function markExpiredLeads(
  now: Date = new Date(),
): Promise<number> {
  const result = await prisma.lead.updateMany({
    where: {
      retentionExpiresAt: { lte: now },
      markedForDeletionAt: null,
    },
    data: {
      markedForDeletionAt: now,
    },
  });
  return result.count;
}

/** Permanently delete leads that have been marked for deletion. */
export async function purgeMarkedLeads(): Promise<number> {
  const result = await prisma.lead.deleteMany({
    where: {
      markedForDeletionAt: { not: null },
    },
  });
  return result.count;
}

/** Run mark + purge as a single cleanup pass. */
export async function runRetentionCleanup(
  now: Date = new Date(),
): Promise<RetentionCleanupResult> {
  const marked = await markExpiredLeads(now);
  const purged = await purgeMarkedLeads();
  return { marked, purged };
}
