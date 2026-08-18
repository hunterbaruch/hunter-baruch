import { siteConfig } from "@/lib/site";
import { escapeHtml, sendResendEmail } from "@/lib/resend";
import type { ResendSendResult } from "@/lib/resend";

export type LeadConfirmationParams = {
  name: string;
  email: string;
  referenceId: string;
  source: string;
  topic?: string | null;
};

export type LeadConfirmationResult = ResendSendResult;

function requestLabel(source: string, topic?: string | null): string {
  if (source === "quote_wizard") {
    return "life insurance estimate request";
  }
  if (source === "schedule") {
    return topic?.trim()
      ? `${topic.trim()} consultation request`
      : "consultation request";
  }
  return "message";
}

export function formatConfirmationText(params: LeadConfirmationParams): string {
  const request = requestLabel(params.source, params.topic);
  return [
    `Hi ${params.name},`,
    "",
    `Thank you for contacting ${siteConfig.name}. We received your ${request}.`,
    "",
    `Reference ID: ${params.referenceId}`,
    `We will follow up within one business day (${siteConfig.contact.hours}).`,
    "",
    "This email confirms we received your request. It is not a final quote, offer of coverage, or guarantee of insurability.",
    "",
    `Questions in the meantime? Call ${siteConfig.contact.phone} or reply to this email.`,
    "",
    siteConfig.name,
    siteConfig.contact.address.replace("\n", ", "),
  ].join("\n");
}

function formatConfirmationHtml(params: LeadConfirmationParams): string {
  const request = escapeHtml(requestLabel(params.source, params.topic));
  const name = escapeHtml(params.name);
  const referenceId = escapeHtml(params.referenceId);
  const phone = escapeHtml(siteConfig.contact.phone);
  const hours = escapeHtml(siteConfig.contact.hours);
  const brand = escapeHtml(siteConfig.name);
  const address = escapeHtml(siteConfig.contact.address.replace("\n", ", "));
  const mail = escapeHtml(siteConfig.contact.email);

  return [
    `<p>Hi ${name},</p>`,
    `<p>Thank you for contacting ${brand}. We received your ${request}.</p>`,
    `<p><strong>Reference ID:</strong> ${referenceId}<br />We will follow up within one business day (${hours}).</p>`,
    `<p>This email confirms we received your request. It is not a final quote, offer of coverage, or guarantee of insurability.</p>`,
    `<p>Questions in the meantime? Call <a href="tel:${phone.replace(/\D/g, "")}">${phone}</a> or reply to this email (${mail}).</p>`,
    `<p>${brand}<br />${address}</p>`,
  ].join("");
}

function confirmationSubject(source: string, referenceId: string): string {
  if (source === "quote_wizard") {
    return `We received your life quote request (${referenceId})`;
  }
  if (source === "schedule") {
    return `We received your consultation request (${referenceId})`;
  }
  return `We received your message (${referenceId})`;
}

export async function sendLeadConfirmation(
  params: LeadConfirmationParams,
): Promise<LeadConfirmationResult> {
  return sendResendEmail({
    to: params.email,
    replyTo: siteConfig.contact.email,
    subject: confirmationSubject(params.source, params.referenceId),
    text: formatConfirmationText(params),
    html: formatConfirmationHtml(params),
  });
}
