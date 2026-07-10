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
