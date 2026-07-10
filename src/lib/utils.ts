export function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

/** Keys that must never be sent to analytics (PII / health). */
const BLOCKED_ANALYTICS_KEYS = new Set([
  "name",
  "fullName",
  "email",
  "phone",
  "message",
  "zip",
  "zipCode",
  "healthClass",
  "quoteSummary",
  "address",
  "ssn",
]);

function sanitizeAnalyticsPayload(
  payload?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!payload) return undefined;
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (BLOCKED_ANALYTICS_KEYS.has(key)) continue;
    if (typeof value === "string" && value.includes("@")) continue;
    clean[key] = value;
  }
  return clean;
}

/**
 * Push a GTM/dataLayer event when present.
 * Never pass name, email, phone, health answers, or other PII.
 */
export function trackEvent(name: string, payload?: Record<string, unknown>) {
  try {
    const analyticsWindow = window as AnalyticsWindow;
    if (typeof window !== "undefined" && analyticsWindow.dataLayer) {
      analyticsWindow.dataLayer.push({
        event: name,
        ...sanitizeAnalyticsPayload(payload),
      });
    }
  } catch {
    // swallow errors in analytics helper
  }
}

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
