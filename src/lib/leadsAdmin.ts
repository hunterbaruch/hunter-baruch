import type { Lead, Prisma } from "@prisma/client";
import { decryptField, decryptOptional, isEncrypted } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/auditLog";
import { isLeadStatus, type LeadStatus } from "@/lib/leadDisplay";

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

export async function listLeadsForAdmin(query?: string) {
  const trimmed = query?.trim();
  const where: Prisma.LeadWhereInput | undefined = trimmed
    ? {
        OR: [
          { referenceId: { contains: trimmed, mode: "insensitive" } },
          { name: { contains: trimmed, mode: "insensitive" } },
          { email: { contains: trimmed, mode: "insensitive" } },
          { phone: { contains: trimmed, mode: "insensitive" } },
          { topic: { contains: trimmed, mode: "insensitive" } },
        ],
      }
    : undefined;

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      referenceId: true,
      source: true,
      name: true,
      email: true,
      phone: true,
      topic: true,
      preferredCallbackMethod: true,
      status: true,
      createdAt: true,
      retentionExpiresAt: true,
      markedForDeletionAt: true,
      tcpaConsentAt: true,
    },
  });
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

export async function updateLeadStatusForAdmin(params: {
  id: string;
  status: string;
  userId: string;
}): Promise<Lead | null> {
  if (!isLeadStatus(params.status)) return null;

  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return null;

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: { status: params.status as LeadStatus },
  });

  await writeAuditLog({
    userId: params.userId,
    action: "lead.status",
    recordId: lead.id,
  });

  return updated;
}

export async function updateLeadNotesForAdmin(params: {
  id: string;
  notes: string;
  userId: string;
}): Promise<Lead | null> {
  const lead = await prisma.lead.findUnique({ where: { id: params.id } });
  if (!lead) return null;

  const updated = await prisma.lead.update({
    where: { id: params.id },
    data: { adminNotes: params.notes.trim() || null },
  });

  await writeAuditLog({
    userId: params.userId,
    action: "lead.notes",
    recordId: lead.id,
  });

  return updated;
}
