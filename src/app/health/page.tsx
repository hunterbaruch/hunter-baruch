import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { healthServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Health",
  description:
    "Health coverage review, Medicare guidance, long-term care planning, and benefits optimization from Hunter Baruch Financial.",
};

export default function HealthPage() {
  return (
    <>
      <PageHero
        title="Health"
        description="Understand your coverage options, control costs, and plan for care needs with guidance that connects health decisions to your finances."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-primary">
              Health decisions with financial clarity
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Health coverage choices affect your budget, your providers, and
              your peace of mind. We help you evaluate options, avoid costly
              gaps, and plan ahead for the care you or your family may need.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {healthServices.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-border bg-surface p-8 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <Button href="/contact">Talk About Health Planning</Button>
          </div>
        </div>
      </section>
    </>
  );
}
