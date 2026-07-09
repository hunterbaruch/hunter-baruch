import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { lifeServices } from "@/lib/site";

export const metadata: Metadata = {
  title: "Life",
  description:
    "Life insurance, income protection, retirement, and legacy planning from Hunter Baruch Financial.",
};

export default function LifePage() {
  return (
    <>
      <PageHero
        title="Life"
        description="Protect the people who depend on you and plan for the decades ahead — with strategies built around your real life, not a product checklist."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-primary">
              Coverage and planning that work together
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Life planning is more than a single policy. We help you balance
              protection, savings, and legacy so your family has clarity if
              something happens — and confidence for every stage that follows.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {lifeServices.map((item) => (
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
            <Button href="/contact">Talk About Life Planning</Button>
          </div>
        </div>
      </section>
    </>
  );
}
