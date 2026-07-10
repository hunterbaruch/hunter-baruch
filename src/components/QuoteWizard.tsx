"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculatePremiumEstimate,
  formatCoverage,
  formatCurrency,
  type Gender,
  type HealthClass,
  type TermLength,
} from "@/lib/quoteEstimate";
import { trackEvent } from "@/lib/utils";

type CoverageType = "" | "Life" | "Medicare" | "Advocacy";

type WizardState = {
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

const STORAGE_KEY = "quote-wizard";

const defaultState: WizardState = {
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

const LIFE_STEP_COUNT = 8;

const HEALTH_OPTIONS: {
  value: HealthClass;
  label: string;
  description: string;
}[] = [
  { value: "excellent", label: "Excellent", description: "No major conditions" },
  { value: "good", label: "Good", description: "Well-managed health" },
  { value: "average", label: "Average", description: "Some health concerns" },
  {
    value: "tobacco",
    label: "Tobacco User",
    description: "Uses tobacco/nicotine",
  },
];

const WHAT_YOU_GET = [
  "A broker-led review across available carriers and plan types",
  "Plain-language guidance for life insurance and Medicare decisions",
  "Advocacy support when care, billing, or enrollment feels unclear",
  "A clear next step with no obligation to enroll",
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function QuoteWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(defaultState);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof WizardState, string>>>({});
  const [submittedId, setSubmittedId] = useState("");
  const [isPending, setIsPending] = useState(false);

  const isLifeFlow = state.coverageType === "Life";
  const showEstimate = isLifeFlow && !submittedId;
  const totalSteps = isLifeFlow ? LIFE_STEP_COUNT : 1;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      setState({ ...defaultState, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const estimate = useMemo(
    () =>
      calculatePremiumEstimate({
        coverageAmount: state.coverageAmount,
        termLength: state.termLength,
        age: state.age,
        gender: state.gender,
        healthClass: state.healthClass,
      }),
    [state.coverageAmount, state.termLength, state.age, state.gender, state.healthClass],
  );

  const progressValue = submittedId
    ? 100
    : ((step + 1) / totalSteps) * 100;

  const updateState = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const errors: Partial<Record<keyof WizardState, string>> = {};

    if (step === 0 && !state.coverageType) {
      errors.coverageType = "Select a coverage type.";
    }

    if (isLifeFlow && step === 6) {
      if (state.zipCode.trim().length < 5) {
        errors.zipCode = "Enter a valid ZIP code.";
      }
      if (state.fullName.trim().length < 2) {
        errors.fullName = "Enter the name for this coverage.";
      }
    }

    if (isLifeFlow && step === 7) {
      if (!isValidEmail(state.email)) {
        errors.email = "Enter a valid email.";
      }
      if (state.phone.replace(/\D/g, "").length < 10) {
        errors.phone = "Enter a valid phone number.";
      }
      if (!state.preferredCallbackMethod) {
        errors.preferredCallbackMethod = "Select a callback method.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
      trackEvent("quote_step_invalid", { step: step + 1 });
      return;
    }

    if (step === 0 && (state.coverageType === "Medicare" || state.coverageType === "Advocacy")) {
      trackEvent("quote_schedule_redirect", { coverageType: state.coverageType });
      router.push("/schedule-consultation");
      return;
    }

    trackEvent("quote_step_complete", { step: step + 1, coverageType: state.coverageType });
    setStep((current) => Math.min(current + 1, LIFE_STEP_COUNT - 1));
  };

  const prevStep = () => {
    setFieldErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsPending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      const id = Math.random().toString(36).slice(2, 9).toUpperCase();
      setSubmittedId(id);
      window.localStorage.removeItem(STORAGE_KEY);
      trackEvent("quote_submitted", {
        coverageType: state.coverageType,
        coverageAmount: state.coverageAmount,
        termLength: state.termLength,
      });
    } finally {
      setIsPending(false);
    }
  };

  const isLastLifeStep = isLifeFlow && step === LIFE_STEP_COUNT - 1;

  return (
    <section id="pricing" className="section-shell bg-gradient-soft">
      <div className="container-shell">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
        <Card className="border border-gray-200 bg-card">
          <CardHeader className="space-y-3 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-medium tracking-tight text-gray-900">
                  Start your quote
                </CardTitle>
                <CardDescription className="mt-2 text-base font-light leading-7 text-gray-700">
                  A guided intake for life insurance, Medicare guidance, or
                  patient advocacy support.
                </CardDescription>
              </div>
              {!submittedId && (
                <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                  <span className="text-sm font-normal text-foreground">
                    Step {step + 1} of {totalSteps}
                  </span>
                </div>
              )}
            </div>
            <Progress value={progressValue} className="h-3" />
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {submittedId ? (
              <div className="rounded-lg border border-success bg-muted p-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="h-8 w-8 text-success"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Your estimate request has been received
                    </h3>
                    <p className="mt-2 text-base font-light leading-7 text-gray-700">
                      We&apos;ll follow up with personalized options based on
                      your answers. Reference ID:{" "}
                      <span className="font-mono text-sm text-foreground">
                        {submittedId}
                      </span>
                    </p>
                    <Link
                      href="/schedule-consultation"
                      className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                    >
                      Schedule a Free Consultation
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  {step === 0 && (
                    <div className="grid gap-4">
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">
                          Coverage type
                        </span>
                        <select
                          value={state.coverageType}
                          onChange={(event) =>
                            updateState(
                              "coverageType",
                              event.target.value as CoverageType,
                            )
                          }
                          className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
                        >
                          <option value="">Select one</option>
                          <option value="Life">Life Insurance</option>
                          <option value="Medicare">Medicare Guidance</option>
                          <option value="Advocacy">Advocacy consult</option>
                        </select>
                        {fieldErrors.coverageType && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.coverageType}
                          </span>
                        )}
                      </label>
                      {state.coverageType === "Medicare" && (
                        <p className="text-sm font-light leading-6 text-gray-600">
                          Medicare guidance is best started with a one-on-one
                          consultation. Continue to schedule yours.
                        </p>
                      )}
                      {state.coverageType === "Advocacy" && (
                        <p className="text-sm font-light leading-6 text-gray-600">
                          Advocacy support begins with a personal consultation.
                          Continue to schedule yours.
                        </p>
                      )}
                    </div>
                  )}

                  {isLifeFlow && step === 1 && (
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
                          {formatCoverage(state.coverageAmount)}
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
                          value={state.coverageAmount}
                          onChange={(event) =>
                            updateState("coverageAmount", Number(event.target.value))
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

                  {isLifeFlow && step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          How long should coverage last?
                        </h3>
                        <p className="mt-2 text-sm font-light text-gray-600">
                          Choose a level term length that matches your protection
                          window.
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
                            onClick={() => updateState("termLength", term)}
                            className={`rounded-xl border px-4 py-4 text-center transition-colors ${
                              state.termLength === term
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

                  {isLifeFlow && step === 3 && (
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
                          {state.age}
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
                          value={state.age}
                          onChange={(event) =>
                            updateState("age", Number(event.target.value))
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary"
                        />
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>18</span>
                          <span>75</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {isLifeFlow && step === 4 && (
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
                            onClick={() => updateState("gender", option.value)}
                            className={`rounded-xl border px-4 py-5 text-center text-lg font-medium transition-colors ${
                              state.gender === option.value
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

                  {isLifeFlow && step === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          Health &amp; tobacco status
                        </h3>
                        <p className="mt-2 text-sm font-light text-gray-600">
                          Select the option that best describes your current
                          situation.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {HEALTH_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateState("healthClass", option.value)}
                            className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                              state.healthClass === option.value
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

                  {isLifeFlow && step === 6 && (
                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          Personalize your estimate
                        </h3>
                        <p className="mt-2 text-sm font-light text-gray-600">
                          Your location and name help us tailor options to your
                          situation.
                        </p>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">
                          ZIP code
                        </span>
                        <Input
                          value={state.zipCode}
                          onChange={(event) => updateState("zipCode", event.target.value)}
                          inputMode="numeric"
                          placeholder="Where you live"
                          className="min-h-[48px] text-foreground"
                        />
                        {fieldErrors.zipCode && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.zipCode}
                          </span>
                        )}
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">
                          Full name
                        </span>
                        <Input
                          value={state.fullName}
                          onChange={(event) => updateState("fullName", event.target.value)}
                          placeholder="As it would appear on a policy"
                          className="min-h-[48px] text-foreground"
                        />
                        {fieldErrors.fullName && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.fullName}
                          </span>
                        )}
                      </label>
                    </div>
                  )}

                  {isLifeFlow && step === 7 && (
                    <div className="grid gap-4">
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          How can we reach you?
                        </h3>
                        <p className="mt-2 text-sm font-light text-gray-600">
                          We&apos;ll send your personalized comparison and follow
                          up about your estimate.
                        </p>
                      </div>
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">Email</span>
                        <Input
                          value={state.email}
                          onChange={(event) => updateState("email", event.target.value)}
                          type="email"
                          className="min-h-[48px] text-foreground"
                        />
                        {fieldErrors.email && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.email}
                          </span>
                        )}
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">Phone</span>
                        <Input
                          value={state.phone}
                          onChange={(event) => updateState("phone", event.target.value)}
                          type="tel"
                          className="min-h-[48px] text-foreground"
                        />
                        {fieldErrors.phone && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.phone}
                          </span>
                        )}
                      </label>
                      <label className="grid gap-2">
                        <span className="text-sm font-normal text-foreground">
                          Preferred callback method
                        </span>
                        <select
                          value={state.preferredCallbackMethod}
                          onChange={(event) =>
                            updateState("preferredCallbackMethod", event.target.value)
                          }
                          className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
                        >
                          <option value="">Choose one</option>
                          <option value="Phone">Phone</option>
                          <option value="Email">Email</option>
                        </select>
                        {fieldErrors.preferredCallbackMethod && (
                          <span className="text-sm font-normal text-warning">
                            {fieldErrors.preferredCallbackMethod}
                          </span>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 0 || isPending}
                    className="bg-accent text-foreground hover:bg-muted disabled:bg-gray-300 disabled:text-gray-600"
                  >
                    Back
                  </Button>

                  {step === 0 && state.coverageType !== "Life" ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!state.coverageType || isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      {state.coverageType === "Medicare" || state.coverageType === "Advocacy"
                        ? "Schedule a Free Consultation"
                        : "Next"}
                    </Button>
                  ) : isLastLifeStep ? (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600"
                    >
                      {isPending ? "Submitting..." : "Submit request"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={isPending}
                      className="bg-primary text-primary-foreground hover:bg-secondary"
                    >
                      {step === 0 ? "Next" : "Continue"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:sticky lg:top-8">
          {showEstimate ? (
            <>
              <Card className="border border-gray-200 bg-tertiary">
                <CardContent className="p-6 sm:p-8">
                  <p className="text-sm font-light uppercase tracking-[0.18em] text-gray-300">
                    Your estimate
                  </p>
                  <p className="mt-4 text-4xl font-medium tracking-tight text-gray-50 sm:text-5xl">
                    {formatCurrency(estimate.lowMonthly)}–
                    {formatCurrency(estimate.highMonthly)}
                    <span className="text-2xl font-light text-gray-300">/mo</span>
                  </p>
                  <p className="mt-3 text-sm font-light leading-6 text-gray-300">
                    {formatCoverage(state.coverageAmount)} · {state.termLength}-year
                    term · age {state.age}
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs font-light leading-5 text-gray-300">
                      This is a preliminary estimate for planning purposes only.
                      Your actual rate depends on underwriting and may vary. Not
                      a quote or offer of insurance.
                    </p>
                  </div>

                  <Link
                    href="/schedule-consultation"
                    className="mt-6 inline-flex w-full min-h-[52px] items-center justify-center rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                  >
                    Get Your Exact Rate — Schedule a Free Consultation
                  </Link>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-gray-900">Why a range?</h3>
                  <p className="mt-3 text-base font-light leading-7 text-gray-700">
                    Final pricing depends on underwriting details, medical history,
                    and carrier-specific guidelines. A consultation narrows this
                    to your exact options — with no carrier bias.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border border-gray-200 bg-tertiary">
              <CardContent className="p-6">
                <h3 className="text-2xl font-medium tracking-tight text-gray-50">
                  What you get
                </h3>
                <ul className="mt-6 grid gap-4">
                  {WHAT_YOU_GET.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="h-6 w-6 shrink-0 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      <span className="text-base font-light leading-7 text-gray-100">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-card px-5 py-4 sm:px-6">
          <p className="text-base font-medium text-gray-900">Privacy reassurance</p>
          <p className="mt-2 text-sm font-light leading-6 text-gray-700">
            Your information is used only to prepare plan recommendations and contact
            you about your request. We do not ask for Social Security or payment
            details in this form.{" "}
            <span className="text-gray-600">
              Expected follow-up: within one business day.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
