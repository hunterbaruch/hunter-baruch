import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { services, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Financial planning, investment management, insurance review, and estate planning services from Hunter Baruch Financial.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        description="Holistic financial strategies designed around your life — not a one-size-fits-all portfolio."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-xl border border-border bg-surface p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-primary">
                  {service.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">
                  {service.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-primary px-8 py-10 text-white">
            <h2 className="text-xl font-bold">A process built around you</h2>
            <ol className="mt-6 space-y-4 text-sm text-white/80">
              <li>
                <span className="font-semibold text-accent">1. Discover</span> —
                We listen to your goals, concerns, and current financial
                picture.
              </li>
              <li>
                <span className="font-semibold text-accent">2. Design</span> —
                We build a tailored plan with clear recommendations and
                rationale.
              </li>
              <li>
                <span className="font-semibold text-accent">3. Deliver</span> —
                We implement, monitor, and adjust as your life evolves.
              </li>
            </ol>
            <p className="mt-6 text-sm text-white/60">
              Questions? Reach us at{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-accent hover:underline"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
