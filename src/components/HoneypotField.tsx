/**
 * Honeypot field — hidden from users via CSS/ARIA, visible to naive bots.
 * If filled, the API rejects the submission.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      aria-hidden="true"
    >
      <label htmlFor="companyWebsite">Company website</label>
      <input
        id="companyWebsite"
        name="companyWebsite"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
