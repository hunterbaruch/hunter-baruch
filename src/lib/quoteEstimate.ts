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

function lookupRate(
  ageBand: AgeBand,
  term: TermLength,
  gender: Gender,
  healthClass: HealthClass,
): number {
  return PLACEHOLDER_RATES[ageBand][term][gender][healthClass];
}

export function interpolateRatePerThousand(
  age: number,
  term: TermLength,
  gender: Gender,
  healthClass: HealthClass,
): number {
  const clampedAge = Math.min(
    Math.max(age, AGE_BANDS[0]),
    AGE_BANDS[AGE_BANDS.length - 1],
  );

  if (clampedAge <= AGE_BANDS[0]) {
    return lookupRate(AGE_BANDS[0], term, gender, healthClass);
  }

  if (clampedAge >= AGE_BANDS[AGE_BANDS.length - 1]) {
    return lookupRate(
      AGE_BANDS[AGE_BANDS.length - 1],
      term,
      gender,
      healthClass,
    );
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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCoverage(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return formatCurrency(amount);
}
