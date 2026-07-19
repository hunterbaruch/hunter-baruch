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
 * PLACEHOLDER DATA — illustrative estimate rates only (not carrier quotes).
 *
 * Monthly premium per $1,000 of coverage, keyed by
 * [ageBand][term][gender][healthClass]. Tuned slightly lower for marketing
 * appeal; final rates always come from underwriting.
 */
const PLACEHOLDER_RATES: RateTable = {
  25: {
    10: {
      male: { excellent: 0.08, good: 0.1, average: 0.12, tobacco: 0.2 },
      female: { excellent: 0.07, good: 0.09, average: 0.11, tobacco: 0.18 },
    },
    20: {
      male: { excellent: 0.11, good: 0.13, average: 0.15, tobacco: 0.27 },
      female: { excellent: 0.1, good: 0.12, average: 0.14, tobacco: 0.24 },
    },
    30: {
      male: { excellent: 0.15, good: 0.18, average: 0.21, tobacco: 0.36 },
      female: { excellent: 0.14, good: 0.16, average: 0.19, tobacco: 0.33 },
    },
  },
  35: {
    10: {
      male: { excellent: 0.12, good: 0.14, average: 0.17, tobacco: 0.29 },
      female: { excellent: 0.11, good: 0.13, average: 0.15, tobacco: 0.26 },
    },
    20: {
      male: { excellent: 0.17, good: 0.2, average: 0.23, tobacco: 0.4 },
      female: { excellent: 0.14, good: 0.17, average: 0.2, tobacco: 0.36 },
    },
    30: {
      male: { excellent: 0.22, good: 0.26, average: 0.3, tobacco: 0.52 },
      female: { excellent: 0.2, good: 0.23, average: 0.27, tobacco: 0.47 },
    },
  },
  45: {
    10: {
      male: { excellent: 0.17, good: 0.21, average: 0.24, tobacco: 0.42 },
      female: { excellent: 0.16, good: 0.19, average: 0.22, tobacco: 0.38 },
    },
    20: {
      male: { excellent: 0.24, good: 0.29, average: 0.33, tobacco: 0.58 },
      female: { excellent: 0.21, good: 0.26, average: 0.3, tobacco: 0.52 },
    },
    30: {
      male: { excellent: 0.32, good: 0.38, average: 0.44, tobacco: 0.76 },
      female: { excellent: 0.29, good: 0.34, average: 0.4, tobacco: 0.69 },
    },
  },
  55: {
    10: {
      male: { excellent: 0.25, good: 0.3, average: 0.35, tobacco: 0.6 },
      female: { excellent: 0.23, good: 0.27, average: 0.32, tobacco: 0.55 },
    },
    20: {
      male: { excellent: 0.35, good: 0.42, average: 0.49, tobacco: 0.84 },
      female: { excellent: 0.31, good: 0.37, average: 0.43, tobacco: 0.75 },
    },
    30: {
      male: { excellent: 0.46, good: 0.55, average: 0.64, tobacco: 1.1 },
      female: { excellent: 0.41, good: 0.49, average: 0.58, tobacco: 1.0 },
    },
  },
  65: {
    10: {
      male: { excellent: 0.36, good: 0.43, average: 0.5, tobacco: 0.86 },
      female: { excellent: 0.33, good: 0.39, average: 0.46, tobacco: 0.78 },
    },
    20: {
      male: { excellent: 0.49, good: 0.59, average: 0.69, tobacco: 1.19 },
      female: { excellent: 0.45, good: 0.53, average: 0.62, tobacco: 1.07 },
    },
    30: {
      male: { excellent: 0.65, good: 0.78, average: 0.91, tobacco: 1.56 },
      female: { excellent: 0.59, good: 0.71, average: 0.83, tobacco: 1.42 },
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
