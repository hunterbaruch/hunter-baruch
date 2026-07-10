import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Hunter Baruch Financial to schedule a consultation for financial planning or patient advocacy.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        description="Reach out to schedule a consultation or ask a question. We typically respond within one business day."
      />

      <section className="section-shell bg-tertiary">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-100">
              Contact
            </p>
            <h2 className="mt-3 text-4xl font-medium tracking-tight text-gray-50">
              Speak with an advisor or send a quick question.
            </h2>
            <p className="mt-5 text-base font-light leading-7 text-gray-100">
              Office hours: {siteConfig.contact.hours}. Typical response time is
              within one business day.
            </p>

            <div className="mt-8 grid gap-4">
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-5 py-4 text-base font-normal text-gray-50 transition-colors duration-200 ease-in hover:bg-gray-700 hover:underline"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="inline-flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-5 py-4 text-base font-normal text-gray-50 transition-colors duration-200 ease-in hover:bg-gray-700 hover:underline"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4l8 8 8-8" />
                </svg>
                {siteConfig.contact.email}
              </a>
            </div>

            <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
              <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-100">
                Office
              </p>
              <p className="mt-3 whitespace-pre-line text-base font-light leading-7 text-gray-100">
                {siteConfig.contact.address}
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-gray-700 bg-gray-800 p-6">
              <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-100">
                Privacy
              </p>
              <p className="mt-3 text-base font-light leading-7 text-gray-100">
                We protect inquiry details and only use submitted information to
                respond to your request.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-700 bg-card p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
