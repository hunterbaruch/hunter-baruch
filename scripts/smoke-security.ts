/**
 * Smoke tests for encryption + Zod lead schema (no DB required).
 * Run: npx tsx scripts/smoke-security.ts
 */

import { createHash, randomBytes } from "node:crypto";

process.env.FIELD_ENCRYPTION_KEY = randomBytes(32).toString("base64");

async function main() {
  const { encryptField, decryptField, isEncrypted } = await import(
    "../src/lib/encryption"
  );
  const { leadSubmissionSchema } = await import("../src/lib/leadSchema");
  const { computeRetentionExpiresAt } = await import("../src/lib/retention");
  const { getTcpaConsentText, TCPA_CONSENT_VERSION } = await import(
    "../src/lib/tcpaConsent"
  );

  const plain = "health class: good";
  const enc = encryptField(plain);
  if (!isEncrypted(enc)) throw new Error("Expected encrypted prefix");
  if (decryptField(enc) !== plain) throw new Error("Decrypt mismatch");

  const valid = leadSubmissionSchema.safeParse({
    source: "quote_wizard",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "5551234567",
    message: "Submitted via homepage quote wizard with enough detail.",
    healthClass: "good",
    quoteSummary: "Health class: good",
    tcpaConsent: true,
    companyWebsite: "",
  });
  if (!valid.success) {
    throw new Error(`Expected valid payload: ${valid.error.message}`);
  }

  const missingConsent = leadSubmissionSchema.safeParse({
    source: "schedule",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "5551234567",
    topic: "Life Insurance",
    message: "Please call me about my estimate soon.",
    tcpaConsent: false,
  });
  if (missingConsent.success) {
    throw new Error("Expected TCPA consent failure");
  }

  const honeypotHandledSeparately = leadSubmissionSchema.safeParse({
    source: "contact",
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I have a general question about coverage options.",
    companyWebsite: "http://spam.example",
  });
  // Honeypot is rejected in the API before Zod; schema still accepts the field.
  if (!honeypotHandledSeparately.success) {
    throw new Error("Schema should allow companyWebsite string for API pre-check");
  }

  const expires = computeRetentionExpiresAt(new Date("2026-01-01T00:00:00Z"), 24);
  if (expires.toISOString() !== "2028-01-01T00:00:00.000Z") {
    throw new Error(`Unexpected retention expiry: ${expires.toISOString()}`);
  }

  if (!getTcpaConsentText().includes("Hunter Baruch Financial")) {
    throw new Error("TCPA text missing brand name");
  }
  if (!TCPA_CONSENT_VERSION) throw new Error("Missing consent version");

  // Stable fingerprint so CI can assert helpers load
  const fingerprint = createHash("sha256")
    .update(getTcpaConsentText())
    .digest("hex")
    .slice(0, 12);

  console.log("smoke-security: ok", { fingerprint, consentVersion: TCPA_CONSENT_VERSION });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
