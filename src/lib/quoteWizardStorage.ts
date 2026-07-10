import {
  calculatePremiumEstimate,
  formatCoverage,
  formatCurrency,
  type Gender,
  type HealthClass,
  type TermLength,
} from "@/lib/quoteEstimate";

export const QUOTE_WIZARD_STORAGE_KEY = "quote-wizard";

export type CoverageType = "" | "Life" | "Medicare" | "Advocacy";

export type QuoteWizardSnapshot = {
  coverageType: CoverageType;
  coverageAmount: number;
  termLength: TermLength;
  age: number;
  gender: Gender;
  healthClass: HealthClass;
  zipCode: string;
  fullName: string;
  email: string;
  phone: string;
  preferredCallbackMethod: string;
};

export const defaultQuoteWizardSnapshot: QuoteWizardSnapshot = {
  coverageType: "",
  coverageAmount: 500_000,
  termLength: 20,
  age: 35,
  gender: "male",
  healthClass: "good",
  zipCode: "",
  fullName: "",
  email: "",
  phone: "",
  preferredCallbackMethod: "",
};

export type ConsultationTopic =
  | "Life Insurance"
  | "Medicare Guidance"
  | "Patient Advocacy";

const TOPIC_BY_COVERAGE: Record<Exclude<CoverageType, "">, ConsultationTopic> = {
  Life: "Life Insurance",
  Medicare: "Medicare Guidance",
  Advocacy: "Patient Advocacy",
};

export function readQuoteWizardSnapshot(): QuoteWizardSnapshot | null {
  if (typeof window === "undefined") return null;

  const saved = window.localStorage.getItem(QUOTE_WIZARD_STORAGE_KEY);
  if (!saved) return null;

  try {
    return { ...defaultQuoteWizardSnapshot, ...JSON.parse(saved) };
  } catch {
    window.localStorage.removeItem(QUOTE_WIZARD_STORAGE_KEY);
    return null;
  }
}

export function topicFromCoverageType(
  coverageType: CoverageType,
): ConsultationTopic | "" {
  if (!coverageType) return "";
  return TOPIC_BY_COVERAGE[coverageType];
}

export function buildQuoteSummary(snapshot: QuoteWizardSnapshot): string | null {
  if (snapshot.coverageType !== "Life") return null;

  const estimate = calculatePremiumEstimate({
    coverageAmount: snapshot.coverageAmount,
    termLength: snapshot.termLength,
    age: snapshot.age,
    gender: snapshot.gender,
    healthClass: snapshot.healthClass,
  });

  const lines = [
    "Quote tool context:",
    `Estimated range: ${formatCurrency(estimate.lowMonthly)}–${formatCurrency(estimate.highMonthly)}/mo`,
    `Coverage: ${formatCoverage(snapshot.coverageAmount)}`,
    `Term: ${snapshot.termLength} years`,
    `Age: ${snapshot.age}`,
    `Gender: ${snapshot.gender}`,
    `Health class: ${snapshot.healthClass}`,
  ];

  if (snapshot.zipCode.trim()) {
    lines.push(`ZIP: ${snapshot.zipCode.trim()}`);
  }

  if (snapshot.preferredCallbackMethod) {
    lines.push(`Preferred callback: ${snapshot.preferredCallbackMethod}`);
  }

  return lines.join("\n");
}

export type ScheduleFormPrefill = {
  topic: ConsultationTopic | "";
  name: string;
  email: string;
  phone: string;
  preferredCallbackMethod: string;
  message: string;
  quoteSummary: string | null;
};

export function buildSchedulePrefill(
  snapshot: QuoteWizardSnapshot | null,
): ScheduleFormPrefill {
  if (!snapshot) {
    return {
      topic: "",
      name: "",
      email: "",
      phone: "",
      preferredCallbackMethod: "",
      message: "",
      quoteSummary: null,
    };
  }

  const quoteSummary = buildQuoteSummary(snapshot);
  const topic = topicFromCoverageType(snapshot.coverageType);

  return {
    topic,
    name: snapshot.fullName,
    email: snapshot.email,
    phone: snapshot.phone,
    preferredCallbackMethod: snapshot.preferredCallbackMethod,
    message: quoteSummary
      ? `I'd like to discuss my life insurance estimate and next steps.\n\n${quoteSummary}`
      : "",
    quoteSummary,
  };
}
