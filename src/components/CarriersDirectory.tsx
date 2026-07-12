"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { carrierCategories, carrierDirectory } from "@/lib/site";
import { cn } from "@/lib/utils";

const categoryOrder: Record<string, number> = {
  Life: 0,
  Medicare: 1,
};

/** Card body height used to size the All-view 2-row viewport. */
const CARD_H = "11rem";
const ROW_GAP = "1.5rem"; // matches lg:gap-6

export function CarriersDirectory() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  /** All + Medicare scroll inside the panel; Life uses the same box without a height cap. */
  const isScrollViewport =
    activeCategory === "All" || activeCategory === "Medicare";

  const carriers = useMemo(() => {
    const filtered = carrierDirectory.filter(
      (carrier) =>
        activeCategory === "All" || carrier.category === activeCategory,
    );

    return [...filtered].sort((a, b) => {
      // All: Life first, then Medicare; within each category A–Z
      if (activeCategory === "All") {
        const byCategory =
          (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99);
        if (byCategory !== 0) return byCategory;
      }
      return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
    });
  }, [activeCategory]);

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

        <div
          className="mt-6 flex flex-wrap gap-3"
          role="tablist"
          aria-label="Filter carriers by category"
        >
          {carrierCategories.map((category) => {
            const selected = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCategory(category)}
                className={`rounded-pill border px-5 py-3 text-sm font-normal transition-colors duration-200 ease-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-200 bg-card text-foreground hover:bg-muted"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/*
          Shared bordered panel for All / Life / Medicare (uniform chrome).
          All + Medicare: max-height = 2 rows × 3 cols with scroll.
          Life: same box, content fits without scrolling.
        */}
        <div
          className={cn(
            "mt-8 rounded-2xl border border-gray-200 bg-card/40 p-3 shadow-sm sm:p-4",
            isScrollViewport && "overflow-y-auto overscroll-contain",
          )}
          style={
            isScrollViewport
              ? {
                  // 2 card rows + 1 gap + vertical padding
                  maxHeight: `calc(2 * ${CARD_H} + ${ROW_GAP} + 2rem)`,
                }
              : undefined
          }
          role="tabpanel"
          aria-label={`${activeCategory} carriers`}
          tabIndex={isScrollViewport ? 0 : undefined}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {carriers.map((carrier) => (
              <Card
                key={carrier.name}
                className="h-[11rem] border border-gray-200 bg-card shadow-sm transition-all duration-200 ease-in hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <CardContent className="flex h-full min-h-0 items-stretch gap-5 p-6">
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <h3 className="text-left text-xl font-medium leading-snug text-gray-900">
                      {carrier.name}
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
                        Category
                      </p>
                      <p className="mt-2 text-base font-light text-gray-700">
                        {carrier.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex h-[5.25rem] w-[5.25rem] shrink-0 items-center justify-center self-center sm:h-[5.6rem] sm:w-[5.6rem]">
                    <img
                      src={carrier.logo}
                      alt={`${carrier.name} logo`}
                      width={90}
                      height={90}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
