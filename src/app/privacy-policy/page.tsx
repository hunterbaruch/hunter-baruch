import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name} — how we collect, use, and protect your information.`,
};

/**
 * PLACEHOLDER privacy policy for structural compliance (GLBA / NAIC 668 context).
 * This is NOT legally final — Hunter's compliance advisor / counsel must review
 * and approve before being treated as a final privacy notice.
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="section-shell">
      <div className="container-shell max-w-3xl">
        <p className="text-sm font-light uppercase tracking-[0.18em] text-gray-600">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-gray-900">
          Privacy Policy
        </h1>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-light leading-6 text-amber-950">
          This page is a structural placeholder. It must be reviewed by{" "}
          {siteConfig.name}&apos;s compliance advisor or counsel before being
          treated as a final privacy notice.
        </p>

        <div className="mt-10 space-y-10 text-base font-light leading-7 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-gray-900">
              What we collect
            </h2>
            <p className="mt-3">
              When you use our quote estimator, contact form, or consultation
              request form, we may collect information you provide such as your
              name, email address, phone number, ZIP code, preferred contact
              method, and details about the coverage or support you are seeking.
              The life insurance estimator may also collect self-reported
              information used for a preliminary estimate (for example age,
              gender, and a general health class). We may also collect limited
              technical data such as browser type, pages visited, and cookie
              preferences if you interact with analytics or consent tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              How we use information
            </h2>
            <p className="mt-3">
              We use the information you submit to respond to your inquiry,
              prepare a preliminary estimate or consultation, follow up by your
              preferred method, operate and improve this website, and meet legal
              or regulatory obligations. We do not sell your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Who we share with
            </h2>
            <p className="mt-3">
              We may share information with service providers who help us operate
              this website (for example hosting, email delivery, and database
              services), and with insurance carriers or partners only as needed
              to evaluate coverage options or quotes you request. We may also
              disclose information when required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Retention and deletion
            </h2>
            <p className="mt-3">
              {/* COMPLIANCE ASSUMPTION: default retention aligns with lead
                  retention settings (e.g. 24 months) — confirm with E&O / counsel. */}
              We retain inquiry and lead records for a limited period consistent
              with business and regulatory needs, then delete or de-identify them.
              You may request deletion of personal information you submitted
              through this site by contacting us at the email below. We will
              respond within a reasonable time, subject to legal retention
              requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              California residents (CCPA-style notice)
            </h2>
            <p className="mt-3">
              {/* Structural CCPA-style clause for out-of-state visitors — not a
                  full CCPA compliance program. Confirm with counsel. */}
              California residents have the right to request access to or
              deletion of their personal information. Contact{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.contact.email}
              </a>{" "}
              to make a request. We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Calls and text messages
            </h2>
            <p className="mt-3">
              If you provide a phone number and consent to be contacted, we may
              call or text you about your insurance inquiry. Consent is not a
              condition of purchase. Message and data rates may apply. You may
              opt out of texts by following the instructions in the message or
              contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Cookies and analytics
            </h2>
            <p className="mt-3">
              We may use cookies or similar technologies for essential site
              function and, if enabled, aggregated analytics. You can dismiss or
              manage the on-site cookie notice and control cookies through your
              browser settings. Analytics events are configured not to include
              names, email addresses, phone numbers, or health answers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Security
            </h2>
            <p className="mt-3">
              We apply administrative and technical safeguards appropriate to
              the sensitivity of the information we collect, including access
              controls for lead records and field-level encryption for certain
              health-related fields.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">Contact</h2>
            <p className="mt-3">
              Questions about this policy or your information may be directed to{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.contact.email}
              </a>{" "}
              or {siteConfig.contact.phone}.
            </p>
            <p className="mt-3 whitespace-pre-line">
              {siteConfig.name}
              {"\n"}
              {siteConfig.contact.address}
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm font-light text-gray-600">
          <Link href="/" className="text-primary hover:underline">
            Return home
          </Link>
          {" · "}
          <Link
            href="/terms-of-service"
            className="text-primary hover:underline"
          >
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
}
