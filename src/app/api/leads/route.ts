import { NextResponse } from "next/server";
import { persistLead } from "@/lib/persistLead";
import { leadSubmissionSchema, formatZodError } from "@/lib/leadSchema";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { siteConfig } from "@/lib/site";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { LeadPayload } from "@/lib/submitLead";

/**
 * Lightweight operational visibility for lead failures.
 * Vercel logs capture these console.error lines. For alerting beyond logs,
 * wire Sentry (or similar) here — do not silently drop failed submissions.
 * Example: Sentry.captureException(error, { tags: { route: "leads" } })
 */
function reportLeadFailure(
  stage:
    | "parse"
    | "validate"
    | "persist"
    | "email"
    | "rate_limit"
    | "turnstile",
  detail: string,
  error?: unknown,
) {
  console.error("[leads][ops]", {
    stage,
    detail,
    at: new Date().toISOString(),
    error:
      error instanceof Error
        ? { name: error.name, message: error.message }
        : error,
  });
}

/**
 * Notification email — intentionally minimal.
 * Do NOT include health answers, phone, full message, or quote details.
 * Full details are available in the authenticated admin dashboard.
 */
function formatLeadNotificationEmail(params: {
  name: string;
  referenceId: string;
  leadId: string;
  createdAt: Date;
}) {
  const dashboardUrl = `${siteConfig.url}/admin/leads/${params.leadId}`;
  return [
    `New lead submitted — ${params.name}, ${params.createdAt.toISOString()}`,
    "",
    `Reference: ${params.referenceId}`,
    `View full details (sign-in required): ${dashboardUrl}`,
    "",
    "This notification intentionally omits health answers and full submission details.",
  ].join("\n");
}

async function sendLeadEmail(params: {
  name: string;
  email: string;
  referenceId: string;
  leadId: string;
  source: string;
  topic?: string | null;
  createdAt: Date;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.warn(
      "[leads] Email delivery skipped. Set RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, and LEAD_FROM_EMAIL.",
    );
    return false;
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
      text: formatLeadNotificationEmail({
        name: params.name,
        referenceId: params.referenceId,
        leadId: params.leadId,
        createdAt: params.createdAt,
      }),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[leads] Resend error:", errorBody);
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);

  if (!rate.allowed) {
    reportLeadFailure("rate_limit", `IP limited: ${ip}`);
    return NextResponse.json(
      {
        ok: false,
        error: "Too many submissions. Please try again in a few minutes.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: reject silently-looking success if filled (don't tip off bots).
  const honeypot =
    typeof body === "object" &&
    body !== null &&
    "companyWebsite" in body &&
    typeof (body as { companyWebsite?: unknown }).companyWebsite === "string"
      ? (body as { companyWebsite: string }).companyWebsite
      : "";

  if (honeypot.trim().length > 0) {
    return NextResponse.json({ ok: true, referenceId: "OK" });
  }

  const turnstileToken =
    typeof body === "object" &&
    body !== null &&
    "turnstileToken" in body &&
    typeof (body as { turnstileToken?: unknown }).turnstileToken === "string"
      ? (body as { turnstileToken: string }).turnstileToken
      : undefined;

  const turnstile = await verifyTurnstileToken(turnstileToken, ip);
  if (!turnstile.ok) {
    reportLeadFailure("turnstile", turnstile.error);
    return NextResponse.json(
      { ok: false, error: turnstile.error },
      { status: 403 },
    );
  }

  const parsed = leadSubmissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    reportLeadFailure("persist", "DATABASE_URL is not configured");
    return NextResponse.json(
      {
        ok: false,
        error: `We could not save your request right now. Please try again or call ${siteConfig.contact.phone}.`,
      },
      { status: 503 },
    );
  }

  const payload: LeadPayload = {
    source: parsed.data.source,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
    topic: parsed.data.topic || undefined,
    preferredCallbackMethod: parsed.data.preferredCallbackMethod || undefined,
    message: parsed.data.message,
    quoteSummary: parsed.data.quoteSummary ?? null,
    healthClass: parsed.data.healthClass ?? null,
    tcpaConsent: parsed.data.tcpaConsent,
  };

  let lead;

  try {
    lead = await persistLead(payload);
  } catch (error) {
    reportLeadFailure("persist", "Database write failed", error);
    return NextResponse.json(
      {
        ok: false,
        error: `We could not save your request right now. Please try again or call ${siteConfig.contact.phone}.`,
      },
      { status: 503 },
    );
  }

  const emailSent = await sendLeadEmail({
    name: payload.name,
    email: payload.email,
    referenceId: lead.referenceId,
    leadId: lead.id,
    source: payload.source,
    topic: payload.topic,
    createdAt: lead.createdAt,
  });

  if (!emailSent) {
    reportLeadFailure(
      "email",
      `Lead ${lead.referenceId} saved without email delivery`,
    );
  }

  return NextResponse.json({ ok: true, referenceId: lead.referenceId });
}
