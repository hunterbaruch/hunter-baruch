import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { coreServices, lifeServices } from "@/lib/site";

const lifeService = coreServices[0];

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

      <section className="section-shell bg-card">
        <div className="container-shell">
          <Card className="overflow-hidden border border-gray-200 bg-card">
            <div className="grid lg:grid-cols-2">
              <img
                src={lifeService.image}
                alt={lifeService.alt}
                loading="lazy"
                className="h-full min-h-[320px] w-full object-cover"
              />
              <CardContent className="p-8 lg:p-10">
                <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
                  Core service
                </p>
                <h2 className="section-title mt-3">{lifeService.title}</h2>
                <p className="body-copy mt-4">{lifeService.body}</p>
                <ul className="mt-6 grid gap-3">
                  {lifeService.bullets.map((bullet) => (
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
                    {lifeService.action}
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>

          <div className="mt-16 max-w-3xl">
            <h2 className="section-title">
              Coverage and planning that work together
            </h2>
            <p className="body-copy mt-4">
              Life planning is more than a single policy. We help you balance
              protection, savings, and legacy so your family has clarity if
              something happens — and confidence for every stage that follows.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {lifeServices.map((item) => (
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
            <Button href="/contact">Talk About Life Planning</Button>
          </div>
        </div>
      </section>
    </>
  );
}
