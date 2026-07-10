"use client";

import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { HoneypotField } from "@/components/HoneypotField";
import { Input } from "@/components/ui/input";
import { PrivacyPolicyLink } from "@/components/PrivacyPolicyLink";
import { FormSubmitError, FormValidationStatus } from "@/components/FormFeedback";
import { TcpaConsentCheckbox } from "@/components/TcpaConsentCheckbox";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { Textarea } from "@/components/ui/textarea";
import {
  buildSchedulePrefill,
  getQuoteWizardStorageRaw,
  getServerQuoteWizardStorageRaw,
  parseQuoteWizardStorageRaw,
  subscribeQuoteWizardStorage,
  type ConsultationTopic,
} from "@/lib/quoteWizardStorage";
import { submitLead } from "@/lib/submitLead";
import { siteConfig } from "@/lib/site";
import { isTurnstileEnforcedOnClient } from "@/lib/turnstile";
import { trackEvent } from "@/lib/utils";

type FormState = {
  topic: ConsultationTopic | "";
  name: string;
  email: string;
  phone: string;
  preferredCallbackMethod: string;
  message: string;
};

const TOPIC_OPTIONS: ConsultationTopic[] = [
  "Life Insurance",
  "Medicare Guidance",
  "Patient Advocacy",
];

export function ScheduleConsultationForm() {
  const storedRaw = useSyncExternalStore(
    subscribeQuoteWizardStorage,
    getQuoteWizardStorageRaw,
    getServerQuoteWizardStorageRaw,
  );
  const snapshot = useMemo(
    () => (storedRaw ? parseQuoteWizardStorageRaw(storedRaw) : null),
    [storedRaw],
  );
  const prefill = useMemo(() => buildSchedulePrefill(snapshot), [snapshot]);
  const quoteSummary = prefill.quoteSummary;
  const healthClass = snapshot?.healthClass ?? null;

  // Local edits overlay prefill so we avoid setState-in-effect hydration.
  const [edits, setEdits] = useState<Partial<FormState>>({});
  const form: FormState = {
    topic: edits.topic ?? prefill.topic,
    name: edits.name ?? prefill.name,
    email: edits.email ?? prefill.email,
    phone: edits.phone ?? prefill.phone,
    preferredCallbackMethod:
      edits.preferredCallbackMethod ?? prefill.preferredCallbackMethod,
    message: edits.message ?? prefill.message,
  };
  const setForm = (next: FormState) => setEdits(next);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState | "tcpaConsent", string>>
  >({});
  const [submittedId, setSubmittedId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const turnstileRequired = isTurnstileEnforcedOnClient();

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState | "tcpaConsent", string>> =
      {};

    if (!form.topic) nextErrors.topic = "Select a consultation topic.";
    if (form.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email.";
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if (!form.preferredCallbackMethod) {
      nextErrors.preferredCallbackMethod = "Select a callback method.";
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = "Add a short note so we know how to prepare.";
    }
    if (form.phone.replace(/\D/g, "").length >= 10 && !tcpaConsent) {
      nextErrors.tcpaConsent =
        "Please confirm consent to be contacted by phone or text.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    if (turnstileRequired && !turnstileToken) {
      setSubmitError("Please complete the security check and try again.");
      return;
    }

    setIsPending(true);
    setSubmitError("");

    const result = await submitLead({
      source: "schedule",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      topic: form.topic,
      preferredCallbackMethod: form.preferredCallbackMethod,
      message: form.message.trim(),
      quoteSummary,
      healthClass,
      companyWebsite,
      tcpaConsent,
      turnstileToken: turnstileToken ?? undefined,
    });

    setIsPending(false);

    if (!result.ok) {
      setTurnstileToken(null);
      setTurnstileReset((value) => value + 1);
      setSubmitError(
        result.error ??
          `We could not send your request. Please try again or call ${siteConfig.contact.phone}.`,
      );
      return;
    }

    setSubmittedId(result.referenceId ?? "");
    trackEvent("schedule_consultation_submit", { topic: form.topic });
  }

  if (submittedId) {
    return (
      <div className="rounded-lg border border-success bg-accent p-6">
        <div className="flex items-start gap-4">
          <svg
            className="h-8 w-8 text-success"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
            />
          </svg>
          <div>
            <h3 className="text-xl font-medium text-gray-900">Request received</h3>
            <p className="mt-2 text-base font-light leading-7 text-gray-700">
              We&apos;ll follow up within one business day to schedule your
              consultation. Reference ID:{" "}
              <span className="font-mono text-sm text-foreground">{submittedId}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-4" noValidate>
      {quoteSummary && (
        <div className="rounded-lg border border-gray-200 bg-muted p-4">
          <p className="text-sm font-medium text-gray-900">
            Your quote details are attached
          </p>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm font-light leading-6 text-gray-700">
            {quoteSummary}
          </pre>
        </div>
      )}

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Topic</span>
        <select
          value={form.topic}
          onChange={(event) =>
            setForm({ ...form, topic: event.target.value as ConsultationTopic | "" })
          }
          className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
        >
          <option value="">Select one</option>
          {TOPIC_OPTIONS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        {errors.topic && (
          <span className="text-sm font-normal text-warning">{errors.topic}</span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Name</span>
        <Input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          className="min-h-[48px] text-foreground"
        />
        {errors.name && (
          <span className="text-sm font-normal text-warning">{errors.name}</span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Email</span>
        <Input
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="min-h-[48px] text-foreground"
        />
        {errors.email && (
          <span className="text-sm font-normal text-warning">{errors.email}</span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Phone</span>
        <Input
          type="tel"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
          className="min-h-[48px] text-foreground"
        />
        {errors.phone && (
          <span className="text-sm font-normal text-warning">{errors.phone}</span>
        )}
      </label>

      <TcpaConsentCheckbox
        checked={tcpaConsent}
        onChange={setTcpaConsent}
        error={errors.tcpaConsent}
      />

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">
          Preferred callback method
        </span>
        <select
          value={form.preferredCallbackMethod}
          onChange={(event) =>
            setForm({ ...form, preferredCallbackMethod: event.target.value })
          }
          className="min-h-[48px] rounded-lg border border-input bg-card px-4 py-3 text-base font-light text-foreground"
        >
          <option value="">Choose one</option>
          <option value="Phone">Phone</option>
          <option value="Email">Email</option>
        </select>
        {errors.preferredCallbackMethod && (
          <span className="text-sm font-normal text-warning">
            {errors.preferredCallbackMethod}
          </span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">
          Anything else we should know?
        </span>
        <Textarea
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          className="min-h-[140px] text-foreground"
        />
        {errors.message && (
          <span className="text-sm font-normal text-warning">{errors.message}</span>
        )}
      </label>

      <HoneypotField value={companyWebsite} onChange={setCompanyWebsite} />

      <TurnstileWidget onToken={setTurnstileToken} resetSignal={turnstileReset} />

      <FormValidationStatus
        errors={[
          errors.topic,
          errors.name,
          errors.email,
          errors.phone,
          errors.preferredCallbackMethod,
          errors.message,
          errors.tcpaConsent,
        ]}
      />

      {submitError && <FormSubmitError message={submitError} />}

      <PrivacyPolicyLink />

      <Button
        type="submit"
        disabled={isPending || (turnstileRequired && !turnstileToken)}
        className="mt-2 bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600"
      >
        {isPending ? "Sending..." : "Request consultation"}
      </Button>
    </form>
  );
}
