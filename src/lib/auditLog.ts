import { prisma } from "@/lib/prisma";

export async function writeAuditLog(params: {
  userId: string;
  action: string;
  recordId: string;
}) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      action: params.action,
      recordId: params.recordId,
    },
  });
}
