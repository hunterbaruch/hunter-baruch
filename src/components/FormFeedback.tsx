"use client";

import { siteConfig } from "@/lib/site";

/** Graceful submit failure — always offer phone fallback. */
export function FormSubmitError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-warning/40 bg-amber-50 px-4 py-3 text-sm font-normal leading-6 text-amber-950"
    >
      <p>{message}</p>
      <p className="mt-2">
        Something went wrong. Please try again or call{" "}
        <a
          href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {siteConfig.contact.phone}
        </a>
        .
      </p>
    </div>
  );
}

/** Announces validation errors to screen readers. */
export function FormValidationStatus({
  errors,
}: {
  errors: Array<string | undefined | null>;
}) {
  const messages = errors.filter((value): value is string => Boolean(value));
  if (messages.length === 0) return null;

  return (
    <div className="sr-only" role="alert" aria-live="polite" aria-atomic="true">
      {messages.join(". ")}
    </div>
  );
}
