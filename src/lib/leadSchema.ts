import { z } from "zod";

export const leadSourceSchema = z.enum(["contact", "schedule", "quote_wizard"]);

/**
 * Server-side Zod schema for lead submissions.
 * Do not trust client-side validation alone.
 */
export const leadSubmissionSchema = z
  .object({
    source: leadSourceSchema,
    name: z
      .string()
      .trim()
      .min(2, "Enter a valid name.")
      .max(200, "Name is too long."),
    email: z
      .string()
      .trim()
      .email("Enter a valid email.")
      .max(320, "Email is too long."),
    phone: z
      .string()
      .trim()
      .max(40, "Phone number is too long.")
      .optional()
      .or(z.literal("")),
    topic: z.string().trim().max(120).optional().or(z.literal("")),
    preferredCallbackMethod: z
      .string()
      .trim()
      .max(40)
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, "Add a few details so we can help.")
      .max(10_000, "Message is too long."),
    quoteSummary: z
      .string()
      .trim()
      .max(5_000)
      .nullable()
      .optional(),
    /** Self-reported underwriting class — health-related; encrypted at rest. */
    healthClass: z
      .enum(["excellent", "good", "average", "tobacco"])
      .optional()
      .nullable(),
    /**
     * Honeypot — checked before Zod parse in the API route.
     * Allowed here so leftover empty values do not fail validation.
     */
    companyWebsite: z.string().optional(),
    /** TCPA consent checkbox — required when a phone number is provided. */
    tcpaConsent: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.source === "schedule" && !data.topic?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["topic"],
        message: "Select a consultation topic.",
      });
    }

    const phoneDigits = (data.phone ?? "").replace(/\D/g, "");
    if (data.phone?.trim() && phoneDigits.length < 10) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number.",
      });
    }

    // TCPA: explicit consent required whenever a phone number is submitted.
    if (phoneDigits.length >= 10 && data.tcpaConsent !== true) {
      ctx.addIssue({
        code: "custom",
        path: ["tcpaConsent"],
        message:
          "Please confirm consent to be contacted by phone or text.",
      });
    }
  });

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

export function formatZodError(error: z.ZodError): string {
  const first = error.issues[0];
  return first?.message ?? "Invalid submission.";
}
