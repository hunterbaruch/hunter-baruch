"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [submitted, setSubmitted] = useState(false);

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitted(true);
    setForm(initialState);
    setErrors({});
    trackEvent("contact_submit");
  }

  if (submitted) {
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
            <h3 className="text-xl font-medium text-gray-900">Message sent</h3>
            <p className="mt-2 text-base font-light leading-7 text-gray-700">
              Thank you. We will reply as soon as possible during business
              hours.
            </p>
            <button
              type="button"
              className="mt-6 text-sm font-normal text-primary hover:underline"
              onClick={() => setSubmitted(false)}
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Name</span>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="min-h-[48px] text-foreground"
        />
        {errors.email && (
          <span className="text-sm font-normal text-warning">{errors.email}</span>
        )}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-normal text-foreground">Message</span>
        <Textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="min-h-[160px] text-foreground"
        />
        {errors.message && (
          <span className="text-sm font-normal text-warning">
            {errors.message}
          </span>
        )}
      </label>

      <Button
        type="submit"
        className="mt-2 bg-primary text-primary-foreground hover:bg-secondary"
      >
        Send message
      </Button>
    </form>
  );
}
