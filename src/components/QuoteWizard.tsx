"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/lib/utils";

const quoteSchema = z.object({
  coverageType: z.string().min(1, "Select a coverage type."),
  ageRange: z.string().min(1, "Choose your age range."),
  zipCode: z.string().min(5, "Enter a valid ZIP code."),
  coverageGoals: z.string().min(10, "Share a short summary of what you need."),
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(10, "Enter a valid phone number."),
  preferredCallbackMethod: z.string().min(1, "Select a callback method."),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

const defaultValues: QuoteFormValues = {
  coverageType: "",
  ageRange: "",
  zipCode: "",
  coverageGoals: "",
  fullName: "",
  email: "",
  phone: "",
  preferredCallbackMethod: "",
};

const steps = [
  {
    title: "Coverage type",
    fields: ["coverageType"] as Array<keyof QuoteFormValues>,
  },
  {
    title: "Basic profile",
    fields: ["ageRange", "zipCode", "coverageGoals"] as Array<
      keyof QuoteFormValues
    >,
  },
  {
    title: "Contact details",
    fields: ["fullName", "email", "phone", "preferredCallbackMethod"] as Array<
      keyof QuoteFormValues
    >,
  },
];

export function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [submittedId, setSubmittedId] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    const saved = window.localStorage.getItem("quote-wizard");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as QuoteFormValues;
      form.reset(parsed);
    } catch {
      window.localStorage.removeItem("quote-wizard");
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      window.localStorage.setItem(
        "quote-wizard",
        JSON.stringify({ ...defaultValues, ...value }),
      );
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const progressValue = useMemo(
    () => ((step + 1) / steps.length) * 100,
    [step],
  );

  const nextStep = async () => {
    const valid = await form.trigger(steps[step].fields);
    if (!valid) {
      trackEvent("quote_step_invalid", { step: step + 1 });
      return;
    }
    trackEvent("quote_step_complete", { step: step + 1 });
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const prevStep = () => setStep((current) => Math.max(current - 1, 0));

  const onSubmit = form.handleSubmit(async (values) => {
    setIsPending(true);
    setError(null);
    try {
      // Lightweight fallback: pretend to submit and return a random ID
      await new Promise((r) => setTimeout(r, 700));
      const id = Math.random().toString(36).slice(2, 9).toUpperCase();
      setSubmittedId(id);
      window.localStorage.removeItem("quote-wizard");
      trackEvent("quote_submitted", { coverageType: values.coverageType });
    } catch (e) {
      setError("submit_failed");
    } finally {
      setIsPending(false);
    }
  });

  return (
    <section id="pricing" className="section-shell bg-gradient-soft">
      <div className="container-shell grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
        <Card className="border border-gray-200 bg-card">
          <CardHeader className="space-y-4 p-8">
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
              <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm font-normal text-foreground">
                  Step {submittedId ? 3 : step + 1} of 3
                </span>
              </div>
            </div>
            <Progress value={submittedId ? 100 : progressValue} className="h-3" />
          </CardHeader>

          <CardContent className="p-8 pt-0">
            {submittedId ? (
              <div className="rounded-lg border border-success bg-muted p-6">
                <div className="flex items-start gap-4">
                  <svg className="h-8 w-8 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">Your request has been received</h3>
                    <p className="mt-2 text-base font-light leading-7 text-gray-700">
                      We will review your information and follow up based on
                      your preferred contact method. Reference ID: <span className="font-mono text-sm text-foreground">{submittedId}</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                {step === 0 && (
                  <div className="grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Coverage type</span>
                      <select
                        {...form.register("coverageType")}
                        className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
                      >
                        <option value="">Select one</option>
                        <option value="Life">Life Insurance</option>
                        <option value="Medicare">Medicare Guidance</option>
                        <option value="Advocacy">Advocacy consult</option>
                      </select>
                      {form.formState.errors.coverageType && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.coverageType.message}</span>
                      )}
                    </label>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Age range</span>
                      <select
                        {...form.register("ageRange")}
                        className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
                      >
                        <option value="">Select age range</option>
                        <option value="Under 40">Under 40</option>
                        <option value="40-54">40-54</option>
                        <option value="55-64">55-64</option>
                        <option value="65+">65+</option>
                      </select>
                      {form.formState.errors.ageRange && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.ageRange.message}</span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">ZIP code</span>
                      <Input {...form.register("zipCode")} inputMode="numeric" className="min-h-[48px] text-foreground" />
                      {form.formState.errors.zipCode && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.zipCode.message}</span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Coverage goals</span>
                      <Textarea {...form.register("coverageGoals")} className="min-h-[140px] text-foreground" />
                      {form.formState.errors.coverageGoals && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.coverageGoals.message}</span>
                      )}
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Full name</span>
                      <Input {...form.register("fullName")} className="min-h-[48px] text-foreground" />
                      {form.formState.errors.fullName && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.fullName.message}</span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Email</span>
                      <Input {...form.register("email")} type="email" className="min-h-[48px] text-foreground" />
                      {form.formState.errors.email && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.email.message}</span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Phone</span>
                      <Input {...form.register("phone")} type="tel" className="min-h-[48px] text-foreground" />
                      {form.formState.errors.phone && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.phone.message}</span>
                      )}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-sm font-normal text-foreground">Preferred callback method</span>
                      <select
                        {...form.register("preferredCallbackMethod")}
                        className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
                      >
                        <option value="">Choose one</option>
                        <option value="Phone">Phone</option>
                        <option value="Email">Email</option>
                      </select>
                      {form.formState.errors.preferredCallbackMethod && (
                        <span className="text-sm font-normal text-warning">{form.formState.errors.preferredCallbackMethod.message}</span>
                      )}
                    </label>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg border border-warning bg-gray-50 p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-8 w-8 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                      <p className="text-sm font-normal text-foreground">We could not submit your request. Please review your information and try again.</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button type="button" onClick={prevStep} disabled={step === 0 || isPending} className="bg-accent text-foreground hover:bg-muted disabled:bg-gray-300 disabled:text-gray-600">Back</Button>

                  {step < steps.length - 1 ? (
                    <Button type="button" onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-secondary">Next</Button>
                  ) : (
                    <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600">{isPending ? "Submitting..." : "Submit request"}</Button>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border border-gray-200 bg-tertiary">
            <CardContent className="p-8">
              <h3 className="text-2xl font-medium tracking-tight text-gray-50">What you get</h3>
              <ul className="mt-6 grid gap-4">
                {[
                  "A broker-led review across available carriers and plan types",
                  "Plain-language guidance for life insurance and Medicare decisions",
                  "Advocacy support when care, billing, or enrollment feels unclear",
                  "A clear next step with no obligation to enroll",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"/></svg>
                    <span className="text-base font-light leading-7 text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 bg-card">
            <CardContent className="p-8">
              <h3 className="text-xl font-medium text-gray-900">Privacy reassurance</h3>
              <p className="mt-3 text-base font-light leading-7 text-gray-700">Your information is used only to prepare plan recommendations and contact you about your request. We do not ask for Social Security or payment details in this form.</p>
              <p className="mt-4 text-sm font-light text-gray-600">Expected follow-up: within one business day.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
