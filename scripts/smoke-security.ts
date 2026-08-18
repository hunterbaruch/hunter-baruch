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

  const withQuoteFields = leadSubmissionSchema.safeParse({
    source: "quote_wizard",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "5551234567",
    message: "Submitted via homepage quote wizard with enough detail.",
    healthClass: "good",
    quoteSummary: "Health class: good",
    zipCode: "30350",
    coverageAmount: 500000,
    termLength: 20,
    age: 35,
    gender: "male",
    existingReferenceId: "ABC1234",
    tcpaConsent: true,
    companyWebsite: "",
  });
  if (!withQuoteFields.success) {
    throw new Error(`Expected structured quote payload: ${withQuoteFields.error.message}`);
  }

  const expires = computeRetentionExpiresAt(new Date("2026-01-01T00:00:00Z"), 24);
  if (expires.toISOString() !== "2028-01-01T00:00:00.000Z") {
    throw new Error(`Unexpected retention expiry: ${expires.toISOString()}`);
  }

  if (!getTcpaConsentText().includes("Hunter Baruch Financial")) {
    throw new Error("TCPA text missing brand name");
  }
  if (!TCPA_CONSENT_VERSION) throw new Error("Missing consent version");

  const { interpolateRatePerThousand } = await import("../src/lib/quoteEstimate");
  const { isGeorgiaZip, isValidUsZip } = await import("../src/lib/georgiaZip");
  const { formatLeadSource } = await import("../src/lib/leadDisplay");

  if (!isValidUsZip("30350") || isValidUsZip("3035") || isValidUsZip("abcde")) {
    throw new Error("ZIP validation failed");
  }
  if (!isGeorgiaZip("30350") || isGeorgiaZip("10001")) {
    throw new Error("Georgia ZIP check failed");
  }
  if (formatLeadSource("quote_wizard") !== "Quote tool") {
    throw new Error("Lead source label failed");
  }

  const young = interpolateRatePerThousand(18, 20, "male", "good");
  const mid = interpolateRatePerThousand(35, 20, "male", "good");
  const older = interpolateRatePerThousand(75, 20, "male", "good");
  if (!(young < mid && mid < older)) {
    throw new Error("Age-band interpolation should increase with age");
  }
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
