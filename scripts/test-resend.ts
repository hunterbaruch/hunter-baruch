/**
 * Verify Resend configuration and optionally send test emails.
 *
 * Usage:
 *   npx tsx scripts/test-resend.ts
 *   npx tsx scripts/test-resend.ts --send
 *
 * Reads .env / .env.local via @next/env (same as Next.js).
 */

import { loadEnvConfig } from "@next/env";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendLeadConfirmation } from "../src/lib/sendLeadConfirmation";
import { sendLeadNotification } from "../src/lib/sendLeadNotification";
import { getSiteBaseUrl } from "../src/lib/siteUrl";

const projectDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
loadEnvConfig(projectDir, true);

const shouldSend = process.argv.includes("--send");

function checkEnv(name: string): boolean {
  const value = process.env[name]?.trim();
  const ok = Boolean(value);
  console.log(`${name}: ${ok ? "set" : "MISSING"}`);
  return ok;
}

async function main() {
  console.log("Resend configuration check\n");

  const ok =
    checkEnv("RESEND_API_KEY") &&
    checkEnv("LEAD_NOTIFICATION_EMAIL") &&
    checkEnv("LEAD_FROM_EMAIL");

  console.log(`\nAdmin link base URL: ${getSiteBaseUrl()}`);
  console.log(
    "Optional SITE_URL override:",
    process.env.SITE_URL?.trim() || "(not set — using Vercel URL or siteConfig.url)",
  );

  if (!ok) {
    console.error(
      "\nMissing Resend env vars. See .env.example and docs/RESEND.md",
    );
    process.exit(1);
  }

  if (!shouldSend) {
    console.log(
      "\nConfig looks complete. Run with --send to deliver admin + confirmation test emails.",
    );
    return;
  }

  const to = process.env.LEAD_NOTIFICATION_EMAIL!;
  console.log("\nSending admin notification test...");
  const adminResult = await sendLeadNotification({
    name: "Resend Test",
    email: to,
    referenceId: "TEST000",
    leadId: "test-lead-id",
    source: "quote_wizard",
    topic: "Life Insurance",
    createdAt: new Date(),
  });

  if (!adminResult.ok) {
    console.error("Admin send failed:", adminResult.reason, adminResult.detail);
    console.error(
      "\nCommon fixes:",
      "- Verify domain in Resend before using a custom FROM address",
      "- For testing only, use FROM onboarding@resend.dev and TO your Resend account email",
    );
    process.exit(1);
  }

  console.log(
    "Admin test sent.",
    adminResult.resendId ? `id: ${adminResult.resendId}` : "",
  );

  console.log("\nSending prospect confirmation test...");
  const confirmResult = await sendLeadConfirmation({
    name: "Resend Test",
    email: to,
    referenceId: "TEST000",
    source: "quote_wizard",
    topic: "Life Insurance",
  });

  if (!confirmResult.ok) {
    console.error(
      "Confirmation send failed:",
      confirmResult.reason,
      confirmResult.detail,
    );
    process.exit(1);
  }

  console.log(
    "Confirmation test sent.",
    confirmResult.resendId ? `id: ${confirmResult.resendId}` : "",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
