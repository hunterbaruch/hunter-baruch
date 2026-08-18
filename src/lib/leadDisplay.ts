export const LEAD_STATUSES = [
  "new",
  "contacted",
  "booked",
  "closed",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function formatLeadSource(source: string): string {
  switch (source) {
    case "quote_wizard":
      return "Quote tool";
    case "schedule":
      return "Consultation";
    case "contact":
      return "Contact";
    default:
      return source;
  }
}

export function formatLeadStatus(status: string): string {
  switch (status) {
    case "new":
      return "New";
    case "contacted":
      return "Contacted";
    case "booked":
      return "Booked";
    case "closed":
      return "Closed";
    default:
      return status;
  }
}

export function phoneHref(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return `tel:${digits}`;
}
