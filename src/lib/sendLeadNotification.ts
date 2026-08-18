import { formatLeadSource } from "@/lib/leadDisplay";
import { getResendConfig, sendResendEmail } from "@/lib/resend";
import { getSiteBaseUrl } from "@/lib/siteUrl";
import type { ResendSendResult } from "@/lib/resend";

export type LeadNotificationParams = {
  name: string;
  email: string;
  referenceId: string;
  leadId: string;
  source: string;
  topic?: string | null;
  createdAt: Date;
};

export type LeadNotificationResult = ResendSendResult;

/**
 * Minimal admin alert via Resend.
 * Body intentionally omits health answers and full submission details.
 */
function formatLeadNotificationText(params: {
  name: string;
  referenceId: string;
  leadId: string;
  source: string;
  topic?: string | null;
  createdAt: Date;
}) {
  const dashboardUrl = `${getSiteBaseUrl()}/admin/leads/${params.leadId}`;
  const sourceLabel = formatLeadSource(params.source);
  const topic = params.topic?.trim() || "General inquiry";
  return [
    `New ${sourceLabel} lead — ${params.name}`,
    `Submitted: ${params.createdAt.toISOString()}`,
    `Topic: ${topic}`,
    "",
    `Reference: ${params.referenceId}`,
    `View full details (sign-in required): ${dashboardUrl}`,
    "",
    "This notification intentionally omits health answers and full submission details.",
  ].join("\n");
}

export async function sendLeadNotification(
  params: LeadNotificationParams,
): Promise<LeadNotificationResult> {
  const { apiKey, fromEmail, adminEmail } = getResendConfig();

  if (!apiKey || !fromEmail || !adminEmail) {
    return {
      ok: false,
      reason: "not_configured",
      detail:
        "Set RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, and LEAD_FROM_EMAIL.",
    };
  }

  const sourceLabel = formatLeadSource(params.source);
  const subjectTopic = params.topic?.trim() || "General inquiry";

  return sendResendEmail({
    to: adminEmail,
    replyTo: params.email,
    subject: `New ${sourceLabel} lead — ${subjectTopic} (${params.referenceId})`,
    text: formatLeadNotificationText(params),
  });
}
