"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TermLength = 10 | 20 | 30;
export type Gender = "male" | "female";
export type HealthClass = "excellent" | "good" | "average" | "tobacco";

export type QuoteInputs = {
  coverageAmount: number;
  termLength: TermLength;
  age: number;
  gender: Gender;
  healthClass: HealthClass;
};

export type PremiumEstimate = {
  baseMonthly: number;
  lowMonthly: number;
  highMonthly: number;
};

// ---------------------------------------------------------------------------
// Rate lookup table
// ---------------------------------------------------------------------------

const AGE_BANDS = [25, 35, 45, 55, 65] as const;
type AgeBand = (typeof AGE_BANDS)[number];

type RateTable = Record<
  AgeBand,
  Record<TermLength, Record<Gender, Record<HealthClass, number>>>
>;

/**
 * PLACEHOLDER DATA — TO BE REPLACED WITH REAL SAMPLE RATES
 *
 * Monthly premium per $1,000 of coverage, keyed by
 * [ageBand][term][gender][healthClass].
 *
 * Placeholder assumptions:
 * - Rates roughly double every ~10 years of age
 * - Tobacco users pay ~2–2.5× non-tobacco
 * - Excellent is the cheapest tier; Average is the most expensive non-tobacco
 * - 30-year term costs more per thousand than 10-year term
 */
const PLACEHOLDER_RATES: RateTable = {
  25: {
    10: {
      male: { excellent: 0.11, good: 0.13, average: 0.15, tobacco: 0.26 },
      female: { excellent: 0.1, good: 0.12, average: 0.14, tobacco: 0.24 },
    },
    20: {
      male: { excellent: 0.15, good: 0.17, average: 0.2, tobacco: 0.35 },
      female: { excellent: 0.13, good: 0.15, average: 0.18, tobacco: 0.32 },
    },
    30: {
      male: { excellent: 0.2, good: 0.23, average: 0.27, tobacco: 0.47 },
      female: { excellent: 0.18, good: 0.21, average: 0.24, tobacco: 0.43 },
    },
  },
  35: {
    10: {
      male: { excellent: 0.16, good: 0.19, average: 0.22, tobacco: 0.38 },
      female: { excellent: 0.14, good: 0.17, average: 0.2, tobacco: 0.35 },
    },
    20: {
      male: { excellent: 0.22, good: 0.26, average: 0.3, tobacco: 0.52 },
      female: { excellent: 0.19, good: 0.23, average: 0.27, tobacco: 0.47 },
    },
    30: {
      male: { excellent: 0.29, good: 0.34, average: 0.39, tobacco: 0.68 },
      female: { excellent: 0.26, good: 0.3, average: 0.35, tobacco: 0.62 },
    },
  },
  45: {
    10: {
      male: { excellent: 0.23, good: 0.27, average: 0.32, tobacco: 0.55 },
      female: { excellent: 0.21, good: 0.25, average: 0.29, tobacco: 0.5 },
    },
    20: {
      male: { excellent: 0.32, good: 0.38, average: 0.44, tobacco: 0.76 },
      female: { excellent: 0.28, good: 0.34, average: 0.39, tobacco: 0.69 },
    },
    30: {
      male: { excellent: 0.42, good: 0.5, average: 0.58, tobacco: 1.0 },
      female: { excellent: 0.38, good: 0.45, average: 0.52, tobacco: 0.91 },
    },
  },
  55: {
    10: {
      male: { excellent: 0.33, good: 0.39, average: 0.46, tobacco: 0.79 },
      female: { excellent: 0.3, good: 0.36, average: 0.42, tobacco: 0.72 },
    },
    20: {
      male: { excellent: 0.46, good: 0.55, average: 0.64, tobacco: 1.1 },
      female: { excellent: 0.41, good: 0.49, average: 0.57, tobacco: 0.99 },
    },
    30: {
      male: { excellent: 0.6, good: 0.72, average: 0.84, tobacco: 1.44 },
      female: { excellent: 0.54, good: 0.65, average: 0.76, tobacco: 1.31 },
    },
  },
  65: {
    10: {
      male: { excellent: 0.47, good: 0.56, average: 0.66, tobacco: 1.13 },
      female: { excellent: 0.43, good: 0.51, average: 0.6, tobacco: 1.03 },
    },
    20: {
      male: { excellent: 0.65, good: 0.78, average: 0.91, tobacco: 1.56 },
      female: { excellent: 0.59, good: 0.7, average: 0.82, tobacco: 1.41 },
    },
    30: {
      male: { excellent: 0.86, good: 1.03, average: 1.2, tobacco: 2.06 },
      female: { excellent: 0.78, good: 0.93, average: 1.09, tobacco: 1.87 },
    },
  },
};

// ---------------------------------------------------------------------------
// Calculation logic
// ---------------------------------------------------------------------------

function lookupRate(
  ageBand: AgeBand,
  term: TermLength,
  gender: Gender,
  healthClass: HealthClass,
): number {
  return PLACEHOLDER_RATES[ageBand][term][gender][healthClass];
}

/**
 * Linearly interpolates ratePerThousand between the five age bands
 * (25, 35, 45, 55, 65).
 */
export function interpolateRatePerThousand(
  age: number,
  term: TermLength,
  gender: Gender,
  healthClass: HealthClass,
): number {
  const clampedAge = Math.min(Math.max(age, AGE_BANDS[0]), AGE_BANDS[AGE_BANDS.length - 1]);

  if (clampedAge <= AGE_BANDS[0]) {
    return lookupRate(AGE_BANDS[0], term, gender, healthClass);
  }

  if (clampedAge >= AGE_BANDS[AGE_BANDS.length - 1]) {
    return lookupRate(AGE_BANDS[AGE_BANDS.length - 1], term, gender, healthClass);
  }

  for (let i = 0; i < AGE_BANDS.length - 1; i++) {
    const lowerBand = AGE_BANDS[i];
    const upperBand = AGE_BANDS[i + 1];

    if (clampedAge >= lowerBand && clampedAge <= upperBand) {
      const lowerRate = lookupRate(lowerBand, term, gender, healthClass);
      const upperRate = lookupRate(upperBand, term, gender, healthClass);
      const progress = (clampedAge - lowerBand) / (upperBand - lowerBand);
      return lowerRate + progress * (upperRate - lowerRate);
    }
  }

  return lookupRate(AGE_BANDS[0], term, gender, healthClass);
}

/**
 * Estimates a monthly premium range from coverage and applicant details.
 *
 * baseMonthly = (coverageAmount / 1000) × ratePerThousand
 * display range = base × 0.85 … base × 1.15 (rounded to nearest dollar)
 */
export function calculatePremiumEstimate(inputs: QuoteInputs): PremiumEstimate {
  const ratePerThousand = interpolateRatePerThousand(
    inputs.age,
    inputs.termLength,
    inputs.gender,
    inputs.healthClass,
  );

  const baseMonthly = (inputs.coverageAmount / 1000) * ratePerThousand;
  const lowMonthly = Math.round(baseMonthly * 0.85);
  const highMonthly = Math.round(baseMonthly * 1.15);

  return { baseMonthly, lowMonthly, highMonthly };
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

const STEPS = [
  { id: "coverage", label: "Coverage" },
  { id: "term", label: "Term" },
  { id: "age", label: "Age" },
  { id: "gender", label: "Gender" },
  { id: "health", label: "Health" },
] as const;

const HEALTH_OPTIONS: { value: HealthClass; label: string; description: string }[] = [
  { value: "excellent", label: "Excellent", description: "No major conditions" },
  { value: "good", label: "Good", description: "Well-managed health" },
  { value: "average", label: "Average", description: "Some health concerns" },
  { value: "tobacco", label: "Tobacco User", description: "Uses tobacco/nicotine" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCoverage(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return formatCurrency(amount);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function QuoteEstimator() {
  const [step, setStep] = useState(0);
  const [coverageAmount, setCoverageAmount] = useState(500_000);
  const [termLength, setTermLength] = useState<TermLength>(20);
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<Gender>("male");
  const [healthClass, setHealthClass] = useState<HealthClass>("good");

  const inputs: QuoteInputs = useMemo(
    () => ({ coverageAmount, termLength, age, gender, healthClass }),
    [coverageAmount, termLength, age, gender, healthClass],
  );

  const estimate = useMemo(() => calculatePremiumEstimate(inputs), [inputs]);

  const progressValue = ((step + 1) / STEPS.length) * 100;

  const goNext = () => setStep((current) => Math.min(current + 1, STEPS.length - 1));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <section
      id="term-quote-estimator"
      className="section-shell bg-gradient-soft"
      aria-label="Term life insurance estimate"
    >
      <div className="container-shell">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            Planning tool
          </p>
          <h2 className="section-title mt-3">Term Life Estimate</h2>
          <p className="body-copy mt-4">
            See a preliminary monthly premium range in under a minute. Your broker
            compares options across carriers to find your best fit.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {/* Wizard panel */}
          <div className="rounded-xl border border-gray-200 bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {STEPS.map((item, index) => (
                  <span
                    key={item.id}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      index <= step ? "bg-primary" : "bg-gray-200"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="shrink-0 text-sm text-gray-600">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>

            <Progress value={progressValue} className="mb-8 h-2" />

            <div className="min-h-[220px]">
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      How much coverage do you need?
                    </h3>
                    <p className="mt-2 text-sm font-light text-gray-600">
                      Drag the slider to set your desired death benefit.
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted px-5 py-4 text-center">
                    <p className="text-3xl font-medium tracking-tight text-gray-900">
                      {formatCoverage(coverageAmount)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">coverage amount</p>
                  </div>
                  <label className="block">
                    <span className="sr-only">Coverage amount</span>
                    <input
                      type="range"
                      min={100_000}
                      max={2_000_000}
                      step={50_000}
                      value={coverageAmount}
                      onChange={(event) =>
                        setCoverageAmount(Number(event.target.value))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary"
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>$100K</span>
                      <span>$2M</span>
                    </div>
                  </label>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      How long should coverage last?
                    </h3>
                    <p className="mt-2 text-sm font-light text-gray-600">
                      Choose a level term length that matches your protection window.
                    </p>
                  </div>
                  <div
                    className="grid grid-cols-3 gap-3"
                    role="group"
                    aria-label="Term length"
                  >
                    {([10, 20, 30] as TermLength[]).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setTermLength(term)}
                        className={`rounded-xl border px-4 py-4 text-center transition-colors ${
                          termLength === term
                            ? "border-primary bg-accent text-gray-900 shadow-sm"
                            : "border-gray-200 bg-card text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span className="block text-2xl font-medium">{term}</span>
                        <span className="mt-1 block text-xs text-gray-600">years</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      What is your current age?
                    </h3>
                    <p className="mt-2 text-sm font-light text-gray-600">
                      Age is a primary factor in term life pricing.
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted px-5 py-4 text-center">
                    <p className="text-3xl font-medium tracking-tight text-gray-900">
                      {age}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">years old</p>
                  </div>
                  <label className="block">
                    <span className="sr-only">Age</span>
                    <input
                      type="range"
                      min={18}
                      max={75}
                      step={1}
                      value={age}
                      onChange={(event) => setAge(Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary"
                    />
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>18</span>
                      <span>75</span>
                    </div>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm text-gray-700">Or enter your age</span>
                    <input
                      type="number"
                      min={18}
                      max={75}
                      value={age}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        if (!Number.isNaN(next)) {
                          setAge(Math.min(75, Math.max(18, next)));
                        }
                      }}
                      className="min-h-[48px] rounded-xl border border-gray-200 bg-card px-4 text-base text-gray-900"
                    />
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">Gender</h3>
                    <p className="mt-2 text-sm font-light text-gray-600">
                      Used for actuarial pricing estimates only.
                    </p>
                  </div>
                  <div
                    className="grid grid-cols-2 gap-3"
                    role="group"
                    aria-label="Gender"
                  >
                    {(
                      [
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ] as const
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setGender(option.value)}
                        className={`rounded-xl border px-4 py-5 text-center text-lg font-medium transition-colors ${
                          gender === option.value
                            ? "border-primary bg-accent text-gray-900 shadow-sm"
                            : "border-gray-200 bg-card text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Health &amp; tobacco status
                    </h3>
                    <p className="mt-2 text-sm font-light text-gray-600">
                      Select the option that best describes your current situation.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {HEALTH_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setHealthClass(option.value)}
                        className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                          healthClass === option.value
                            ? "border-primary bg-accent shadow-sm"
                            : "border-gray-200 bg-card hover:border-gray-300"
                        }`}
                      >
                        <span className="block font-medium text-gray-900">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-sm font-light text-gray-600">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-card px-6 text-sm font-medium text-gray-700 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              {step < STEPS.length - 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                >
                  Continue
                </button>
              )}
            </div>
          </div>

          {/* Live estimate panel */}
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-xl border border-gray-200 bg-tertiary p-6 text-tertiary-foreground shadow-sm sm:p-8">
              <p className="text-sm font-light uppercase tracking-[0.18em] text-gray-300">
                Your estimate
              </p>
              <p className="mt-4 text-4xl font-medium tracking-tight text-gray-50 sm:text-5xl">
                {formatCurrency(estimate.lowMonthly)}–{formatCurrency(estimate.highMonthly)}
                <span className="text-2xl font-light text-gray-300">/mo</span>
              </p>
              <p className="mt-3 text-sm font-light leading-6 text-gray-300">
                {formatCoverage(coverageAmount)} · {termLength}-year term · age {age}
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-light leading-5 text-gray-300">
                  This is a preliminary estimate for planning purposes only. Your
                  actual rate depends on underwriting and may vary. Not a quote or
                  offer of insurance.
                </p>
              </div>

              <Link
                href="/schedule-consultation"
                className="mt-6 inline-flex w-full min-h-[52px] items-center justify-center rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
              >
                Get Your Exact Rate — Schedule a Free Consultation
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-card p-5 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">Why a range?</h3>
              <p className="mt-2 text-sm font-light leading-6 text-gray-600">
                Final pricing depends on underwriting details, medical history, and
                carrier-specific guidelines. A consultation narrows this to your
                exact options — with no carrier bias.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
