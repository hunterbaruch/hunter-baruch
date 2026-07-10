"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { HoneypotField } from "@/components/HoneypotField";
import { Input } from "@/components/ui/input";
import { PrivacyPolicyLink } from "@/components/PrivacyPolicyLink";
import { FormSubmitError, FormValidationStatus } from "@/components/FormFeedback";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/submitLead";
import { siteConfig } from "@/lib/site";
import { isTurnstileEnforcedOnClient } from "@/lib/turnstile";
import { trackEvent } from "@/lib/utils";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  message: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submittedId, setSubmittedId] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const turnstileRequired = isTurnstileEnforcedOnClient();

  function validate(): boolean {
    const nextErrors: Partial<FormState> = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your name.";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Enter a valid email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email.";
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = "Add a few details so we can help.";
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
      source: "contact",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      companyWebsite,
      turnstileToken: turnstileToken ?? undefined,
    });

    setIsPending(false);

    if (!result.ok) {
      setTurnstileToken(null);
      setTurnstileReset((value) => value + 1);
      setSubmitError(
        result.error ??
          `We could not send your message. Please try again or call ${siteConfig.contact.phone}.`,
      );
      return;
    }

    setSubmittedId(result.referenceId ?? "");
    setForm(initialState);
    setErrors({});
    trackEvent("contact_submit");
  }

  if (submittedId) {
    return (
      <div className="rounded-lg border border-success bg-accent p-6" role="status">
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
            <h3 className="text-xl font-medium text-gray-900">Message sent</h3>
            <p className="mt-2 text-base font-light leading-7 text-gray-700">
              Thank you. We will reply as soon as possible during business
              hours. Reference ID:{" "}
              <span className="font-mono text-sm text-foreground">{submittedId}</span>
            </p>
            <button
              type="button"
              className="mt-6 text-sm font-normal text-primary hover:underline"
              onClick={() => setSubmittedId("")}
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-4" noValidate>
      <label className="grid gap-2" htmlFor="contact-name">
        <span className="text-sm font-normal text-foreground">Name</span>
        <Input
          id="contact-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          aria-invalid={Boolean(errors.name)}
          className="min-h-[48px] text-foreground"
        />
        {errors.name && (
          <span role="alert" className="text-sm font-normal text-warning">
            {errors.name}
          </span>
        )}
      </label>

      <label className="grid gap-2" htmlFor="contact-email">
        <span className="text-sm font-normal text-foreground">Email</span>
        <Input
          id="contact-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          aria-invalid={Boolean(errors.email)}
          className="min-h-[48px] text-foreground"
        />
        {errors.email && (
          <span role="alert" className="text-sm font-normal text-warning">
            {errors.email}
          </span>
        )}
      </label>

      <label className="grid gap-2" htmlFor="contact-message">
        <span className="text-sm font-normal text-foreground">Message</span>
        <Textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={Boolean(errors.message)}
          className="min-h-[160px] text-foreground"
        />
        {errors.message && (
          <span role="alert" className="text-sm font-normal text-warning">
            {errors.message}
          </span>
        )}
      </label>

      <HoneypotField value={companyWebsite} onChange={setCompanyWebsite} />

      <TurnstileWidget onToken={setTurnstileToken} resetSignal={turnstileReset} />

      <FormValidationStatus
        errors={[errors.name, errors.email, errors.message]}
      />

      {submitError && <FormSubmitError message={submitError} />}

      <PrivacyPolicyLink />

      <Button
        type="submit"
        disabled={isPending || (turnstileRequired && !turnstileToken)}
        className="mt-2 bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-600"
      >
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
