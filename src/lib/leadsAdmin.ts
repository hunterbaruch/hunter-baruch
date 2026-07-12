import type { Lead } from "@prisma/client";
import { decryptField, decryptOptional, isEncrypted } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/auditLog";

export type DecryptedLead = Omit<Lead, "quoteSummary" | "healthClass" | "message"> & {
  quoteSummary: string | null;
  healthClass: string | null;
  message: string;
};

function decryptLead(lead: Lead): DecryptedLead {
  return {
    ...lead,
    message: isEncrypted(lead.message)
      ? decryptField(lead.message)
      : lead.message,
    quoteSummary: decryptOptional(lead.quoteSummary),
    healthClass: decryptOptional(lead.healthClass),
  };
}

export async function listLeadsForAdmin() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceId: true,
      source: true,
      name: true,
      email: true,
      phone: true,
      topic: true,
      status: true,
      createdAt: true,
      retentionExpiresAt: true,
      markedForDeletionAt: true,
      tcpaConsentAt: true,
    },
  });
  return leads;
}

export async function getLeadForAdmin(
  id: string,
  userId: string,
): Promise<DecryptedLead | null> {
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return null;

  await writeAuditLog({
    userId,
    action: "lead.view",
    recordId: lead.id,
  });

  return decryptLead(lead);
}
