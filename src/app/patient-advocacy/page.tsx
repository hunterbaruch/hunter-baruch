import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { advocacyPoints, coreServices, siteConfig } from "@/lib/site";

const advocacyService = coreServices[2];

export const metadata: Metadata = {
  title: "Patient Advocacy Atlanta",
  description:
    "Patient advocacy in Atlanta — help with in-network specialists, RX cost programs, ancillary benefits, GLP-1 access, and housing assistance. Complimentary support; outcomes not guaranteed.",
  alternates: { canonical: "/patient-advocacy" },
  openGraph: {
    title: "Patient Advocacy Atlanta | Hunter Baruch Financial",
    description:
      "After a diagnosis, get help exploring specialists, prescription cost programs, benefits setup, and housing support. Not affiliated with Medicare or drug manufacturers.",
    url: "/patient-advocacy",
  },
};

function CtaPrivacyNote() {
  return (
    <p className="mt-3 max-w-md text-xs font-light leading-5 text-gray-600">
      Information you share is encrypted and used only to provide advocacy
      support and respond to your request. See our{" "}
      <Link
        href="/privacy-policy"
        className="font-normal text-primary underline-offset-2 hover:underline"
      >
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export default function PatientAdvocacyPage() {
  const { licensing } = siteConfig;

  return (
    <>
      <PageHero
        title="Patient Advocacy"
        description="After a diagnosis, you shouldn't have to figure out specialists, prescriptions, and benefits alone. We help you explore care options, cost-assistance programs, and support services you may qualify for."
      />

      <section className="section-shell bg-card">
        <div className="container-shell">
          {/* CMS Medicare non-affiliation — page-level for Extra Help / LIS references */}
          <p className="mb-8 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-light leading-relaxed text-gray-600">
            {siteConfig.governmentDisclaimer}
          </p>

          <Card className="overflow-hidden border border-gray-200 bg-card">
            <div className="grid lg:grid-cols-2">
              <img
                src={advocacyService.image}
                alt={advocacyService.alt}
                loading="lazy"
                className="h-full min-h-[320px] w-full object-cover"
              />
              <CardContent className="p-8 lg:p-10">
                <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
                  Core service
                </p>
                <h2 className="section-title mt-3">{advocacyService.title}</h2>
                <p className="body-copy mt-4">{advocacyService.body}</p>
                <ul className="mt-6 grid gap-3">
                  {advocacyService.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm font-light leading-6 text-gray-700"
                    >
                      • {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 rounded-pill bg-tertiary px-5 py-3 text-base font-normal text-tertiary-foreground transition-colors duration-200 ease-in hover:bg-gray-800"
                  >
                    {advocacyService.action}
                  </Link>
                  <CtaPrivacyNote />
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="mt-16 max-w-3xl">
            <h2 className="section-title">
              You focus on healing. We help with the complexity.
            </h2>
            <p className="body-copy mt-4">
              A serious diagnosis or unexpected medical event can create
              financial stress on top of emotional strain. Our patient advocacy
              service pairs financial expertise with hands-on support — helping
              you look for in-network specialists, apply for prescription
              assistance programs when you may qualify, set up ancillary
              benefits, and connect with housing resources when available.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {advocacyPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-xl border border-gray-200 bg-card p-8"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-700">
                  {point.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-gray-200 bg-accent p-8 md:p-10">
            <h2 className="text-xl font-medium text-gray-900">
              Who may benefit from patient advocacy?
            </h2>
            <ul className="mt-6 grid gap-3 text-sm font-light text-gray-700 md:grid-cols-2">
              <li>
                Patients who need help finding an in-network specialist after a
                diagnosis
              </li>
              <li>Anyone exploring options for high prescription costs</li>
              <li>
                Caregivers coordinating treatment, benefits, and daily support
              </li>
              <li>
                People who may qualify for housing or ancillary assistance
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/contact">Request an Advocacy Consultation</Button>
              <CtaPrivacyNote />
            </div>
          </div>

          {/* Compliance block — producer, service limits, third parties */}
          <aside
            className="mt-12 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-6 md:p-8"
            aria-label="Patient advocacy disclosures"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
              Important disclosures
            </p>
            <p className="text-xs font-light leading-relaxed text-gray-600">
              <span className="font-medium text-gray-800">
                Licensed producer:{" "}
              </span>
              {licensing.producerName}. Licensed in {licensing.licensedIn}.
              Georgia License No. {licensing.georgiaLicenseNumber}. National
              Producer Number (NPN): {licensing.npn}.
            </p>
            <p className="text-xs font-light leading-relaxed text-gray-600">
              {siteConfig.advocacyDisclaimer}
            </p>
            <p className="text-xs font-light leading-relaxed text-gray-600">
              {siteConfig.advocacyThirdPartyDisclaimer}
            </p>
            <p className="text-xs font-light leading-relaxed text-gray-600">
              {siteConfig.governmentDisclaimer}
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
