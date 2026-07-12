import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { advocacyPoints, coreServices } from "@/lib/site";

const advocacyService = coreServices[2];

export const metadata: Metadata = {
  title: "Patient Advocacy Atlanta",
  description:
    "Patient advocacy in Atlanta — medical bill review, insurance navigation, and care coordination. Most advocacy services can be covered by insurance.",
  alternates: { canonical: "/patient-advocacy" },
  openGraph: {
    title: "Patient Advocacy Atlanta | Hunter Baruch Financial",
    description:
      "Support with medical bills, insurance questions, and care pathways so your family is not navigating complex healthcare alone.",
    url: "/patient-advocacy",
  },
};

export default function PatientAdvocacyPage() {
  return (
    <>
      <PageHero
        title="Patient Advocacy"
        description="Navigating healthcare costs and insurance shouldn't fall entirely on you. We advocate for fair outcomes and financial clarity at every step."
      />

      <section className="section-shell bg-card">
        <div className="container-shell">
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
                    href="/#pricing"
                    className="inline-flex items-center gap-3 rounded-pill bg-tertiary px-5 py-3 text-base font-normal text-tertiary-foreground transition-colors duration-200 ease-in hover:bg-gray-800"
                  >
                    {advocacyService.action}
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="mt-16 max-w-3xl">
            <h2 className="section-title">
              You focus on healing. We handle the complexity.
            </h2>
            <p className="body-copy mt-4">
              A serious diagnosis or unexpected medical event can create
              financial stress on top of emotional strain. Our patient advocacy
              service pairs financial expertise with hands-on support — reviewing
              bills, challenging errors, decoding insurance language, and
              helping your family make informed care decisions.
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
              Who benefits from patient advocacy?
            </h2>
            <ul className="mt-6 grid gap-3 text-sm font-light text-gray-700 md:grid-cols-2">
              <li>Families facing large or confusing medical bills</li>
              <li>Patients navigating insurance denials or appeals</li>
              <li>Caregivers coordinating treatment and costs</li>
              <li>Anyone who wants a knowledgeable advocate in their corner</li>
            </ul>
            <div className="mt-8">
              <Button href="/contact">Request an Advocacy Consultation</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
