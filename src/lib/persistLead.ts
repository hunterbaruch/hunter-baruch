import type { Lead } from "@prisma/client";
import type { LeadPayload } from "@/lib/submitLead";
import {
  decryptField,
  encryptOptional,
  isEncrypted,
} from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { computeRetentionExpiresAt } from "@/lib/retention";
import {
  getTcpaConsentText,
  TCPA_CONSENT_VERSION,
} from "@/lib/tcpaConsent";

const DEDUP_WINDOW_MS = 24 * 60 * 60 * 1000;

function createReferenceId() {
  return Math.random().toString(36).slice(2, 9).toUpperCase();
}

function decryptMessage(value: string) {
  return isEncrypted(value) ? decryptField(value) : value;
}

function quoteFields(payload: LeadPayload) {
  return {
    zipCode: payload.zipCode?.trim() || null,
    coverageAmount: payload.coverageAmount ?? null,
    termLength: payload.termLength ?? null,
    age: payload.age ?? null,
    gender: payload.gender?.trim() || null,
  };
}

function encryptedHealthFields(
  payload: LeadPayload,
  message: string,
  existing?: Lead,
) {
  const hasHealthContext = Boolean(
    payload.healthClass?.trim() ||
      payload.quoteSummary?.trim() ||
      existing?.healthClass ||
      existing?.quoteSummary ||
      (existing ? isEncrypted(existing.message) : false),
  );

  return {
    message: hasHealthContext
      ? encryptOptional(message) ?? message
      : message,
    quoteSummary: payload.quoteSummary?.trim()
      ? encryptOptional(payload.quoteSummary)
      : null,
    healthClass: payload.healthClass?.trim()
      ? encryptOptional(payload.healthClass)
      : null,
  };
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
  const now = new Date();
  const email = payload.email.trim().toLowerCase();
  const phone = payload.phone?.trim() || null;
  const hasTcpaConsent = Boolean(phone && payload.tcpaConsent);
  const existing = await findLeadToMerge(payload, email);

  if (existing) {
    return mergeIntoExistingLead(existing, payload, {
      now,
      phone,
      hasTcpaConsent,
    });
  }

  let referenceId = createReferenceId();
  const message = payload.message.trim();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.lead.create({
        data: {
          referenceId,
          source: payload.source,
          name: payload.name.trim(),
          email,
          phone,
          topic: payload.topic?.trim() || null,
          preferredCallbackMethod:
            payload.preferredCallbackMethod?.trim() || null,
          ...encryptedHealthFields(payload, message),
          ...quoteFields(payload),
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

async function findLeadToMerge(payload: LeadPayload, email: string) {
  const referenceId = payload.existingReferenceId?.trim().toUpperCase();
  if (referenceId) {
    const byRef = await prisma.lead.findFirst({
      where: {
        referenceId,
        email,
        markedForDeletionAt: null,
      },
    });
    if (byRef) return byRef;
  }

  return prisma.lead.findFirst({
    where: {
      email,
      createdAt: { gte: new Date(Date.now() - DEDUP_WINDOW_MS) },
      markedForDeletionAt: null,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function mergeIntoExistingLead(
  existing: Lead,
  payload: LeadPayload,
  options: { now: Date; phone: string | null; hasTcpaConsent: boolean },
) {
  const previousMessage = decryptMessage(existing.message);
  const incoming = payload.message.trim();
  const alreadyIncluded = previousMessage.includes(incoming);
  const combinedMessage = alreadyIncluded
    ? previousMessage
    : `${previousMessage}\n\n---\nFollow-up (${payload.source}):\n${incoming}`;

  const nextQuote = quoteFields(payload);
  const nextHealth = encryptedHealthFields(payload, combinedMessage, existing);

  return prisma.lead.update({
    where: { id: existing.id },
    data: {
      name: payload.name.trim() || existing.name,
      phone: options.phone ?? existing.phone,
      topic: payload.topic?.trim() || existing.topic,
      preferredCallbackMethod:
        payload.preferredCallbackMethod?.trim() ||
        existing.preferredCallbackMethod,
      message: nextHealth.message,
      quoteSummary:
        nextHealth.quoteSummary ?? existing.quoteSummary,
      healthClass:
        nextHealth.healthClass ?? existing.healthClass,
      zipCode: nextQuote.zipCode ?? existing.zipCode,
      coverageAmount: nextQuote.coverageAmount ?? existing.coverageAmount,
      termLength: nextQuote.termLength ?? existing.termLength,
      age: nextQuote.age ?? existing.age,
      gender: nextQuote.gender ?? existing.gender,
      tcpaConsentAt: existing.tcpaConsentAt
        ? existing.tcpaConsentAt
        : options.hasTcpaConsent
          ? options.now
          : null,
      tcpaConsentTextVersion: existing.tcpaConsentTextVersion
        ? existing.tcpaConsentTextVersion
        : options.hasTcpaConsent
          ? TCPA_CONSENT_VERSION
          : null,
      tcpaConsentText: existing.tcpaConsentText
        ? existing.tcpaConsentText
        : options.hasTcpaConsent
          ? getTcpaConsentText()
          : null,
    },
  });
}
