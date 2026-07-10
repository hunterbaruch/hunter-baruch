import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/submitLead";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatLeadEmail(payload: LeadPayload, referenceId: string) {
  const lines = [
    `Reference: ${referenceId}`,
    `Source: ${payload.source}`,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.topic) lines.push(`Topic: ${payload.topic}`);
  if (payload.preferredCallbackMethod) {
    lines.push(`Preferred callback: ${payload.preferredCallbackMethod}`);
  }

  lines.push("", "Message:", payload.message);

  if (payload.quoteSummary) {
    lines.push("", payload.quoteSummary);
  }

  return lines.join("\n");
}

async function sendLeadEmail(payload: LeadPayload, referenceId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.warn(
      "[leads] Email delivery skipped. Set RESEND_API_KEY, LEAD_NOTIFICATION_EMAIL, and LEAD_FROM_EMAIL.",
    );
    return false;
  }

  const subjectTopic = payload.topic ?? "General inquiry";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: payload.email,
      subject: `New ${payload.source} lead — ${subjectTopic} (${referenceId})`,
      text: formatLeadEmail(payload, referenceId),
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
  let payload: LeadPayload;

  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!payload.name?.trim() || payload.name.trim().length < 2) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid name." },
      { status: 400 },
    );
  }

  if (!payload.email?.trim() || !isValidEmail(payload.email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }

  if (!payload.message?.trim() || payload.message.trim().length < 10) {
    return NextResponse.json(
      { ok: false, error: "Add a few details so we can help." },
      { status: 400 },
    );
  }

  if (payload.source === "schedule" && !payload.topic?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Select a consultation topic." },
      { status: 400 },
    );
  }

  const referenceId = Math.random().toString(36).slice(2, 9).toUpperCase();
  const emailSent = await sendLeadEmail(payload, referenceId);

  if (!emailSent && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not deliver your request right now. Please call or email us directly.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, referenceId });
}
