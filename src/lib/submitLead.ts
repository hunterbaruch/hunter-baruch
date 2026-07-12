export type LeadSource = "contact" | "schedule" | "quote_wizard";

export type LeadPayload = {
  source: LeadSource;
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  preferredCallbackMethod?: string;
  message: string;
  quoteSummary?: string | null;
  /** Health-related — encrypted at rest on the server. */
  healthClass?: string | null;
  /** Honeypot field — must remain empty. */
  companyWebsite?: string;
  /** TCPA consent checkbox — required when phone is provided. */
  tcpaConsent?: boolean;
  /** Cloudflare Turnstile token — verified server-side when configured. */
  turnstileToken?: string;
};

export type LeadSubmissionResult = {
  ok: boolean;
  referenceId?: string;
  error?: string;
};

export async function submitLead(
  payload: LeadPayload,
): Promise<LeadSubmissionResult> {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as LeadSubmissionResult;

  if (!response.ok) {
    return {
      ok: false,
      error: data.error ?? "We could not send your request. Please try again.",
    };
  }

  return data;
}
