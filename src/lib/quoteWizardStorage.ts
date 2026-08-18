import {
  calculatePremiumEstimate,
  formatCoverage,
  formatCurrency,
  type Gender,
  type HealthClass,
  type TermLength,
} from "@/lib/quoteEstimate";

export const QUOTE_WIZARD_STORAGE_KEY = "quote-wizard";

/** Same-tab notification when quote wizard storage is written. */
const QUOTE_WIZARD_STORAGE_EVENT = "quote-wizard-storage";

/** Drop in-progress answers after a week so health/PII does not linger. */
export const QUOTE_WIZARD_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const LIFE_STEP = {
  TYPE: 0,
  COVERAGE: 1,
  AGE: 2,
  GENDER: 3,
  HEALTH: 4,
  TERM: 5,
  IDENTITY: 6,
  CONTACT: 7,
} as const;

export const LIFE_STEP_COUNT = 8;

export type CoverageType = "" | "Life" | "Medicare" | "Advocacy";

export type QuoteWizardSnapshot = {
  step: number;
  savedAt: number;
  submittedReferenceId: string;
  coverageType: CoverageType;
  coverageAmount: number;
  termLength: TermLength | null;
  age: number;
  gender: Gender | "";
  healthClass: HealthClass | "";
  zipCode: string;
  fullName: string;
  email: string;
  phone: string;
  preferredCallbackMethod: string;
};

export const defaultQuoteWizardSnapshot: QuoteWizardSnapshot = {
  step: 0,
  savedAt: 0,
  submittedReferenceId: "",
  coverageType: "",
  coverageAmount: 500_000,
  termLength: null,
  age: 35,
  gender: "",
  healthClass: "",
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

const GENDERS = new Set<Gender>(["male", "female"]);
const HEALTH_CLASSES = new Set<HealthClass>([
  "excellent",
  "good",
  "average",
  "tobacco",
]);
const COVERAGE_TYPES = new Set<CoverageType>([
  "",
  "Life",
  "Medicare",
  "Advocacy",
]);

export function readQuoteWizardSnapshot(): QuoteWizardSnapshot | null {
  if (typeof window === "undefined") return null;

  const saved = getQuoteWizardStorageRaw();
  if (!saved) return null;

  return parseQuoteWizardStorageRaw(saved);
}

/** Subscribe to quote-wizard localStorage changes (cross-tab + same-tab). */
export function subscribeQuoteWizardStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(QUOTE_WIZARD_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(QUOTE_WIZARD_STORAGE_EVENT, onStoreChange);
  };
}

export function getQuoteWizardStorageRaw(): string {
  try {
    return window.localStorage.getItem(QUOTE_WIZARD_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function getServerQuoteWizardStorageRaw(): string {
  return "";
}

function asTermLength(value: unknown): TermLength | null {
  return value === 10 || value === 20 || value === 30 ? value : null;
}

function asGender(value: unknown): Gender | "" {
  return typeof value === "string" && GENDERS.has(value as Gender)
    ? (value as Gender)
    : "";
}

function asHealthClass(value: unknown): HealthClass | "" {
  return typeof value === "string" && HEALTH_CLASSES.has(value as HealthClass)
    ? (value as HealthClass)
    : "";
}

function asCoverageType(value: unknown): CoverageType {
  return typeof value === "string" && COVERAGE_TYPES.has(value as CoverageType)
    ? (value as CoverageType)
    : "";
}

export function parseQuoteWizardStorageRaw(raw: string): QuoteWizardSnapshot {
  if (!raw) return defaultQuoteWizardSnapshot;

  try {
    const parsed = JSON.parse(raw) as Partial<QuoteWizardSnapshot>;
    const savedAt =
      typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt)
        ? parsed.savedAt
        : 0;

    if (savedAt > 0 && Date.now() - savedAt > QUOTE_WIZARD_TTL_MS) {
      return defaultQuoteWizardSnapshot;
    }

    const coverageAmount = Number(parsed.coverageAmount);
    const age = Number(parsed.age);
    const step = Number(parsed.step);

    return {
      ...defaultQuoteWizardSnapshot,
      savedAt,
      submittedReferenceId:
        typeof parsed.submittedReferenceId === "string"
          ? parsed.submittedReferenceId
          : "",
      step: Number.isFinite(step)
        ? Math.min(Math.max(Math.trunc(step), 0), LIFE_STEP_COUNT - 1)
        : 0,
      coverageType: asCoverageType(parsed.coverageType),
      coverageAmount:
        Number.isFinite(coverageAmount) && coverageAmount > 0
          ? coverageAmount
          : defaultQuoteWizardSnapshot.coverageAmount,
      termLength: asTermLength(parsed.termLength),
      age:
        Number.isFinite(age) && age >= 18 && age <= 75
          ? Math.round(age)
          : defaultQuoteWizardSnapshot.age,
      gender: asGender(parsed.gender),
      healthClass: asHealthClass(parsed.healthClass),
      zipCode: typeof parsed.zipCode === "string" ? parsed.zipCode : "",
      fullName: typeof parsed.fullName === "string" ? parsed.fullName : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      preferredCallbackMethod:
        typeof parsed.preferredCallbackMethod === "string"
          ? parsed.preferredCallbackMethod
          : "",
    };
  } catch {
    try {
      window.localStorage.removeItem(QUOTE_WIZARD_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
    return defaultQuoteWizardSnapshot;
  }
}

export function writeQuoteWizardSnapshot(snapshot: QuoteWizardSnapshot) {
  try {
    window.localStorage.setItem(
      QUOTE_WIZARD_STORAGE_KEY,
      JSON.stringify({ ...snapshot, savedAt: Date.now() }),
    );
    window.dispatchEvent(new Event(QUOTE_WIZARD_STORAGE_EVENT));
  } catch {
    // ignore storage failures
  }
}

export function clearQuoteWizardSnapshot() {
  try {
    window.localStorage.removeItem(QUOTE_WIZARD_STORAGE_KEY);
    window.dispatchEvent(new Event(QUOTE_WIZARD_STORAGE_EVENT));
  } catch {
    // ignore storage failures
  }
}

export function topicFromCoverageType(
  coverageType: CoverageType,
): ConsultationTopic | "" {
  if (!coverageType) return "";
  return TOPIC_BY_COVERAGE[coverageType];
}

export function canCalculateEstimate(snapshot: QuoteWizardSnapshot): boolean {
  return Boolean(
    snapshot.coverageType === "Life" &&
      snapshot.termLength &&
      snapshot.gender &&
      snapshot.healthClass,
  );
}

export function buildQuoteSummary(snapshot: QuoteWizardSnapshot): string | null {
  if (snapshot.coverageType !== "Life") return null;

  const lines = ["Quote tool context:"];

  if (canCalculateEstimate(snapshot) && snapshot.termLength && snapshot.gender && snapshot.healthClass) {
    const estimate = calculatePremiumEstimate({
      coverageAmount: snapshot.coverageAmount,
      termLength: snapshot.termLength,
      age: snapshot.age,
      gender: snapshot.gender,
      healthClass: snapshot.healthClass,
    });
    lines.push(
      `Estimated range: ${formatCurrency(estimate.lowMonthly)}–${formatCurrency(estimate.highMonthly)}/mo`,
    );
  }

  lines.push(`Coverage: ${formatCoverage(snapshot.coverageAmount)}`);

  if (snapshot.termLength) {
    lines.push(`Term: ${snapshot.termLength} years`);
  }

  lines.push(`Age: ${snapshot.age}`);

  if (snapshot.gender) {
    lines.push(`Gender: ${snapshot.gender}`);
  }

  if (snapshot.healthClass) {
    lines.push(`Health class: ${snapshot.healthClass}`);
  }

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
