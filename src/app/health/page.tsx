import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { coreServices, healthServices } from "@/lib/site";

const healthService = coreServices[1];

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

      <section className="section-shell bg-card">
        <div className="container-shell">
          <Card className="overflow-hidden border border-gray-200 bg-card">
            <div className="grid lg:grid-cols-2">
              <img
                src={healthService.image}
                alt={healthService.alt}
                loading="lazy"
                className="h-full min-h-[320px] w-full object-cover"
              />
              <CardContent className="p-8 lg:p-10">
                <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
                  Core service
                </p>
                <h2 className="section-title mt-3">{healthService.title}</h2>
                <p className="body-copy mt-4">{healthService.body}</p>
                <ul className="mt-6 grid gap-3">
                  {healthService.bullets.map((bullet) => (
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
                    {healthService.action}
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="mt-16 max-w-3xl">
            <h2 className="section-title">
              Health decisions with financial clarity
            </h2>
            <p className="body-copy mt-4">
              Health coverage choices affect your budget, your providers, and
              your peace of mind. We help you evaluate options, avoid costly
              gaps, and plan ahead for the care you or your family may need.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {healthServices.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-gray-200 bg-card p-8"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-gray-700">
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
