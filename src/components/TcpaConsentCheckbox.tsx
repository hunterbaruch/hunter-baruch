"use client";

import { getTcpaConsentText } from "@/lib/tcpaConsent";

/**
 * TCPA consent checkbox — unchecked by default, visible near the phone field.
 * COMPLIANCE ASSUMPTION: Exact wording should be confirmed with counsel.
 */
export function TcpaConsentCheckbox({
  checked,
  onChange,
  error,
  id = "tcpa-consent",
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  id?: string;
}) {
  const consentText = getTcpaConsentText();
  const errorId = `${id}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary"
        />
        <span className="text-sm font-light leading-6 text-gray-700">
          {consentText}
        </span>
      </label>
      {error && (
        <span id={errorId} role="alert" className="text-sm font-normal text-warning">
          {error}
        </span>
      )}
    </div>
  );
}
