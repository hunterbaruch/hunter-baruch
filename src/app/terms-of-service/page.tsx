import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
};

/**
 * PLACEHOLDER terms of service — structural only.
 * Hunter's compliance advisor / counsel must review before launch.
 * Governing law: Georgia (confirm venue language with counsel).
 */
export default function TermsOfServicePage() {
  return (
    <div className="section-shell">
      <div className="container-shell max-w-3xl">
        <p className="text-sm font-light uppercase tracking-[0.18em] text-gray-600">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-gray-900">
          Terms of Service
        </h1>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-light leading-6 text-amber-950">
          This page is a structural placeholder. It must be reviewed by{" "}
          {siteConfig.name}&apos;s compliance advisor or counsel before being
          treated as final terms.
        </p>

        <div className="mt-10 space-y-10 text-base font-light leading-7 text-gray-700">
          <section>
            <h2 className="text-xl font-medium text-gray-900">Site usage</h2>
            <p className="mt-3">
              By using this website, you agree to these terms. The site provides
              general information about insurance and related services offered by{" "}
              {siteConfig.name}. Content is for informational purposes and does
              not create an advisor–client or agent–client relationship until you
              and we expressly agree otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Estimates are not quotes or offers
            </h2>
            <p className="mt-3">{siteConfig.estimateDisclaimer}</p>
            <p className="mt-3">
              We do not guarantee that coverage will be available, that a carrier
              will approve an application, or that any illustrated rate will be
              the rate you are offered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Limitation of liability
            </h2>
            <p className="mt-3">
              To the fullest extent permitted by law, {siteConfig.name} and its
              owners, employees, and agents are not liable for any indirect,
              incidental, special, consequential, or punitive damages arising from
              your use of this website or reliance on any estimate or content. Our
              total liability for any claim relating to the site is limited to the
              greater of fifty dollars ($50) or the amount you paid us (if any)
              for site access in the twelve months before the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">
              Governing law and venue
            </h2>
            <p className="mt-3">
              {/* COMPLIANCE: Confirm Georgia governing law / venue with counsel. */}
              These terms are governed by the laws of the State of Georgia,
              without regard to conflict-of-law rules. Any dispute arising out of
              or relating to these terms or this website shall be brought
              exclusively in the state or federal courts located in Georgia, and
              you consent to personal jurisdiction and venue in those courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-gray-900">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                {siteConfig.contact.email}
              </a>{" "}
              or {siteConfig.contact.phone}.
            </p>
          </section>
        </div>

        <p className="mt-12 text-sm font-light text-gray-600">
          <Link href="/" className="text-primary hover:underline">
            Return home
          </Link>
          {" · "}
          <Link href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
