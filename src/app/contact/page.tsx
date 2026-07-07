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

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-primary">Get in touch</h2>
            <p className="mt-4 text-muted">
              Whether you need financial planning guidance or patient advocacy
              support, we are here to help. Fill out the form and we will follow
              up promptly.
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
                    className="text-primary hover:text-accent"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-primary hover:text-accent"
                  >
                    {siteConfig.contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Office
                </dt>
                <dd className="mt-1 whitespace-pre-line text-primary">
                  {siteConfig.contact.address}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Hours
                </dt>
                <dd className="mt-1 text-primary">{siteConfig.contact.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
