import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { advocacyPoints, services, siteConfig, testimonials } from "@/lib/site";
import { HeroVideoSection } from "@/components/HeroVideoSection";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <HeroVideoSection />
      <QuoteWizard />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-primary md:text-3xl">
              Financial guidance rooted in trust
            </h2>
            <p className="mt-4 text-muted">
              We combine disciplined financial planning with compassionate
              patient advocacy — so you never have to navigate complex decisions
              alone.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Patient Advocacy
            </p>
            <h2 className="mt-3 text-2xl font-bold text-primary md:text-3xl">
              When health and finances collide, we stand with you
            </h2>
            <p className="mt-4 text-muted">
              Medical bills, insurance disputes, and care decisions can
              overwhelm even the most prepared families. Our patient advocacy
              service brings clarity, negotiation support, and a steady voice
              through every step.
            </p>
            <div className="mt-8">
              <Button href="/patient-advocacy">Learn About Advocacy</Button>
            </div>
          </div>

          <ul className="space-y-4">
            {advocacyPoints.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="font-semibold text-primary">{point.title}</h3>
                <p className="mt-2 text-sm text-muted">{point.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary md:text-3xl">
                What clients are saying
              </h2>
              <p className="mt-2 text-muted">
                Real stories from families we have helped.
              </p>
            </div>
            <Button href="/testimonials" variant="outline">
              Read All Testimonials
            </Button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-xl border border-border bg-surface p-6 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-primary">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold text-primary">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Ready to take the next step?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Schedule a complimentary consultation to discuss your financial
            goals or patient advocacy needs.
          </p>
          <div className="mt-8">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </div>
      </section>
    </>
  );
}
