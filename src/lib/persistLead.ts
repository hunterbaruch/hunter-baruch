import type { LeadPayload } from "@/lib/submitLead";
import { prisma } from "@/lib/prisma";

function createReferenceId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

export async function persistLead(payload: LeadPayload) {
  let referenceId = createReferenceId();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.lead.create({
        data: {
          referenceId,
          source: payload.source,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          phone: payload.phone?.trim() || null,
          topic: payload.topic?.trim() || null,
          preferredCallbackMethod: payload.preferredCallbackMethod?.trim() || null,
          message: payload.message.trim(),
          quoteSummary: payload.quoteSummary?.trim() || null,
        },
      });
    } catch (error) {
      const isUniqueConflict =
        error instanceof Error &&
        "code" in error &&
        (error as { code?: string }).code === "P2002";

      if (!isUniqueConflict || attempt === 2) {
        throw error;
      }

      referenceId = createReferenceId();
    }
  }

  throw new Error("Unable to create lead record.");
}
