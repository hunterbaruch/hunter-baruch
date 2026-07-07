import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { advocacyPoints } from "@/lib/site";

export const metadata: Metadata = {
  title: "Patient Advocacy",
  description:
    "Medical bill review, insurance navigation, and care coordination support from Hunter Baruch Financial.",
};

export default function PatientAdvocacyPage() {
  return (
    <>
      <PageHero
        title="Patient Advocacy"
        description="Navigating healthcare costs and insurance shouldn't fall entirely on you. We advocate for fair outcomes and financial clarity at every step."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-primary">
              You focus on healing. We handle the complexity.
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
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
                className="rounded-xl border border-border bg-surface p-8 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {point.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {point.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-accent/30 bg-accent/5 p-8 md:p-10">
            <h2 className="text-xl font-bold text-primary">
              Who benefits from patient advocacy?
            </h2>
            <ul className="mt-6 grid gap-3 text-sm text-muted md:grid-cols-2">
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
