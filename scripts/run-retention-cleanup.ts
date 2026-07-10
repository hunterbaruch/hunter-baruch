/**
 * Manually trigger lead retention cleanup (mark expired + purge).
 *
 * Usage: npm run retention:cleanup
 *
 * COMPLIANCE ASSUMPTION: Confirm LEAD_RETENTION_MONTHS with E&O carrier.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function markExpiredLeads(now: Date) {
  const result = await prisma.lead.updateMany({
    where: {
      retentionExpiresAt: { lte: now },
      markedForDeletionAt: null,
    },
    data: { markedForDeletionAt: now },
  });
  return result.count;
}

async function purgeMarkedLeads() {
  const result = await prisma.lead.deleteMany({
    where: { markedForDeletionAt: { not: null } },
  });
  return result.count;
}

async function main() {
  const now = new Date();
  const marked = await markExpiredLeads(now);
  const purged = await purgeMarkedLeads();
  console.log(`Retention cleanup complete. Marked: ${marked}, Purged: ${purged}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
