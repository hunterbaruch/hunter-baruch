import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Do Not Sell or Share My Personal Information",
  description: `California privacy request page for ${siteConfig.name}.`,
};

/**
 * CCPA-style “Do Not Sell or Share” landing page.
 * Structural placeholder — confirm with counsel. We state we do not sell PI;
 * this page is the visible request channel for access/deletion/opt-out.
 */
export default function DoNotSellPage() {
  const mailSubject = encodeURIComponent(
    "Privacy request — Do Not Sell or Share / access / deletion",
  );
  const mailHref = `mailto:${siteConfig.contact.email}?subject=${mailSubject}`;

  return (
    <div className="section-shell">
      <div className="container-shell max-w-3xl">
        <p className="text-sm font-light uppercase tracking-[0.18em] text-gray-600">
          Privacy
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-gray-900">
          Do Not Sell or Share My Personal Information
        </h1>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-light leading-6 text-amber-950">
          Structural notice for California and similar state privacy rights.
          Confirm final wording with {siteConfig.name}&apos;s compliance advisor
          or counsel before treating as final.
        </p>

        <div className="mt-10 space-y-8 text-base font-light leading-7 text-gray-700">
          <p>
            {siteConfig.name} does not sell your personal information. We also do
            not share personal information for cross-context behavioral
            advertising as those terms are commonly used under the CCPA/CPRA.
          </p>
          <p>
            If you are a California resident (or another state with similar
            rights), you may request access to, correction of, or deletion of
            personal information we collected about you through this website, or
            ask us to confirm our “do not sell/share” practices.
          </p>
          <p>
            To make a request, email{" "}
            <a
              href={mailHref}
              className="font-normal text-primary underline-offset-2 hover:underline"
            >
              {siteConfig.contact.email}
            </a>{" "}
            or call {siteConfig.contact.phone}. Please include enough detail for
            us to locate your inquiry (for example, the email or phone you used
            on a form, and an approximate submission date). We may need to verify
            your identity before fulfilling a request.
          </p>
          <p>
            More detail is in our{" "}
            <Link
              href="/privacy-policy"
              className="font-normal text-primary underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-12 text-sm font-light text-gray-600">
          <Link href="/" className="text-primary hover:underline">
            Return home
          </Link>
        </p>
      </div>
    </div>
  );
}
