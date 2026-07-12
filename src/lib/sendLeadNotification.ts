import { getSiteBaseUrl } from "@/lib/siteUrl";

export type LeadNotificationParams = {
  name: string;
  email: string;
  referenceId: string;
  leadId: string;
  source: string;
  topic?: string | null;
  createdAt: Date;
};

export type LeadNotificationResult =
  | { ok: true; resendId?: string }
  | { ok: false; reason: "not_configured" | "api_error"; detail: string };

/**
 * Minimal lead notification via Resend REST API.
 * Body intentionally omits health answers and full submission details.
 */
function formatLeadNotificationText(params: {
  name: string;
  referenceId: string;
  leadId: string;
  createdAt: Date;
}) {
  const dashboardUrl = `${getSiteBaseUrl()}/admin/leads/${params.leadId}`;
  return [
    `New lead submitted — ${params.name}, ${params.createdAt.toISOString()}`,
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
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  const fromEmail = process.env.LEAD_FROM_EMAIL?.trim();

  if (!apiKey || !toEmail || !fromEmail) {
    return {
      ok: false,
      reason: "not_configured",
      detail:
        "Set RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, and LEAD_FROM_EMAIL.",
    };
  }

  const subjectTopic = params.topic ?? "General inquiry";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: params.email,
      subject: `New ${params.source} lead — ${subjectTopic} (${params.referenceId})`,
      text: formatLeadNotificationText({
        name: params.name,
        referenceId: params.referenceId,
        leadId: params.leadId,
        createdAt: params.createdAt,
      }),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    return {
      ok: false,
      reason: "api_error",
      detail: errorBody || `HTTP ${response.status}`,
    };
  }

  let resendId: string | undefined;
  try {
    const data = (await response.json()) as { id?: string };
    resendId = data.id;
  } catch {
    // response was ok; id optional
  }

  return { ok: true, resendId };
}
