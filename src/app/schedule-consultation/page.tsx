import type { Metadata } from "next";
import { ScheduleConsultationForm } from "@/components/ScheduleConsultationForm";
import { PageHero } from "@/components/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule a Consultation",
  description:
    "Book a free consultation with a Georgia-licensed producer in Atlanta. Review life insurance, Medicare, or advocacy options — no obligation.",
  alternates: { canonical: "/schedule-consultation" },
  openGraph: {
    title: "Schedule a Consultation | Hunter Baruch Financial",
    description:
      "Pick a time to speak with an advisor about life insurance, Medicare, or patient advocacy. Clear next steps, no pressure.",
    url: "/schedule-consultation",
  },
};

export default function ScheduleConsultationPage() {
  return (
    <>
      <PageHero
        title="Schedule a Consultation"
        description="Pick a time to speak with an advisor. We'll review your situation, answer questions, and outline next steps — no obligation."
      />

      <section className="section-shell bg-tertiary">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-100">
              What to expect
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight text-gray-50">
              A focused conversation about your goals.
            </h2>
            <p className="mt-5 text-base font-light leading-7 text-gray-100">
              Office hours: {siteConfig.contact.hours}. Typical response time is
              within one business day.
            </p>

            <ul className="mt-8 grid gap-4">
              {[
                "Review your coverage needs and budget",
                "Compare options across available carriers",
                "Get plain-language answers — no pressure to enroll",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                  <span className="text-base font-light leading-7 text-gray-100">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-4">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-5 py-4 text-base font-normal text-gray-50 transition-colors duration-200 ease-in hover:bg-gray-700 hover:underline"
              >
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-5 py-4 text-base font-normal text-gray-50 transition-colors duration-200 ease-in hover:bg-gray-700 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-card p-8">
            <ScheduleConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}
