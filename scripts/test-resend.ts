/**
 * Verify Resend configuration and optionally send a test notification.
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
      "\nConfig looks complete. Run with --send to deliver a test email.",
    );
    return;
  }

  console.log("\nSending test notification...");
  const result = await sendLeadNotification({
    name: "Resend Test",
    email: process.env.LEAD_NOTIFICATION_EMAIL!,
    referenceId: "TEST000",
    leadId: "test-lead-id",
    source: "contact",
    topic: "Resend setup test",
    createdAt: new Date(),
  });

  if (!result.ok) {
    console.error("Send failed:", result.reason, result.detail);
    console.error(
      "\nCommon fixes:",
      "- Verify domain in Resend before using a custom FROM address",
      "- For testing only, use FROM onboarding@resend.dev and TO your Resend account email",
    );
    process.exit(1);
  }

  console.log("Test email sent.", result.resendId ? `id: ${result.resendId}` : "");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
