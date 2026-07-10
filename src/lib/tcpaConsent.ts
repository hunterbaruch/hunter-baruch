import { siteConfig } from "@/lib/site";

/**
 * TCPA consent copy versions.
 *
 * COMPLIANCE ASSUMPTION: Wording should be reviewed by Hunter's compliance
 * advisor / counsel before launch. Bump TCPA_CONSENT_VERSION when the text
 * changes so stored consent records remain attributable to the exact language.
 */
export const TCPA_CONSENT_VERSION = "2026-07-v1";

export function getTcpaConsentText(): string {
  return `By providing my phone number, I consent to receive calls and text messages from ${siteConfig.name}, including by autodialer, regarding my insurance quote. Consent is not a condition of purchase. Message and data rates may apply.`;
}
