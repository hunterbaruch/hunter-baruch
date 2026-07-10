"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { carrierCategories, carrierDirectory } from "@/lib/site";

export function CarriersDirectory() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const carriers = useMemo(
    () =>
      carrierDirectory.filter(
        (carrier) =>
          activeCategory === "All" || carrier.category === activeCategory,
      ),
    [activeCategory],
  );

  return (
    <section className="section-shell bg-gray-50">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            Carrier network
          </p>
          <h2 className="section-title mt-3">
            Browse represented carriers by product category.
          </h2>
          <p className="body-copy mt-4">
            Availability varies by state, underwriting, enrollment period, and
            individual eligibility. Carrier appointments and plan availability
            may change.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {carrierCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-pill border px-5 py-3 text-sm font-normal transition-colors duration-200 ease-in ${
                activeCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-200 bg-card text-foreground hover:bg-muted"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {carriers.map((carrier) => (
            <Card key={carrier.name} className="border border-gray-200 bg-card">
              <CardContent className="flex min-h-[180px] flex-col justify-between p-6">
                <div className="flex min-h-[64px] items-center">
                  <h3 className="text-xl font-medium text-gray-900">
                    {carrier.name}
                  </h3>
                </div>
                <div className="mt-6">
                  <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
                    Category
                  </p>
                  <p className="mt-2 text-base font-light text-gray-700">
                    {carrier.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
