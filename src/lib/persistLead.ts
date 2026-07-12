import type { LeadPayload } from "@/lib/submitLead";
import { encryptOptional } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { computeRetentionExpiresAt } from "@/lib/retention";
import {
  getTcpaConsentText,
  TCPA_CONSENT_VERSION,
} from "@/lib/tcpaConsent";

function createReferenceId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

/**
 * Health-related fields encrypted at rest (AES-256-GCM via FIELD_ENCRYPTION_KEY):
 * - healthClass (self-reported underwriting class)
 * - quoteSummary (embeds health class and related underwriting context)
 * - message, when it accompanies quote/health data (wizard/schedule often
 *   embed the quote summary — including health class — in the message body)
 *
 * Other PII (name, email, phone) relies on database/access controls.
 */
export async function persistLead(payload: LeadPayload) {
  let referenceId = createReferenceId();
  const now = new Date();
  const phone = payload.phone?.trim() || null;
  const hasTcpaConsent = Boolean(phone && payload.tcpaConsent);
  const hasHealthContext = Boolean(
    payload.healthClass?.trim() || payload.quoteSummary?.trim(),
  );

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.lead.create({
        data: {
          referenceId,
          source: payload.source,
          name: payload.name.trim(),
          email: payload.email.trim().toLowerCase(),
          phone,
          topic: payload.topic?.trim() || null,
          preferredCallbackMethod:
            payload.preferredCallbackMethod?.trim() || null,
          // Encrypt message when it may embed health-related quote context.
          message: hasHealthContext
            ? encryptOptional(payload.message.trim()) ?? payload.message.trim()
            : payload.message.trim(),
          quoteSummary: encryptOptional(payload.quoteSummary),
          healthClass: encryptOptional(payload.healthClass ?? null),
          tcpaConsentAt: hasTcpaConsent ? now : null,
          tcpaConsentTextVersion: hasTcpaConsent
            ? TCPA_CONSENT_VERSION
            : null,
          tcpaConsentText: hasTcpaConsent ? getTcpaConsentText() : null,
          retentionExpiresAt: computeRetentionExpiresAt(now),
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
