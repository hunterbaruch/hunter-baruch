export type ResendSendResult =
  | { ok: true; resendId?: string }
  | { ok: false; reason: "not_configured" | "api_error"; detail: string };

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.LEAD_FROM_EMAIL?.trim();
  const adminEmail = process.env.LEAD_NOTIFICATION_EMAIL?.trim();
  return { apiKey, fromEmail, adminEmail };
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendResendEmail(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<ResendSendResult> {
  const { apiKey, fromEmail } = getResendConfig();

  if (!apiKey || !fromEmail) {
    return {
      ok: false,
      reason: "not_configured",
      detail: "Set RESEND_API_KEY and LEAD_FROM_EMAIL.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [params.to],
      reply_to: params.replyTo,
      subject: params.subject,
      text: params.text,
      html: params.html,
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
