"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { coreServices } from "@/lib/site";
import { scrollToId, trackEvent } from "@/lib/utils";

export function ServiceCards() {
  return (
    <section id="features" className="section-shell bg-card">
      <div className="container-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            Core services
          </p>
          <h2 className="section-title mt-3">
            Outcome-focused guidance for major insurance and care decisions.
          </h2>
          <p className="body-copy mt-4">
            Each service is built to reduce confusion, compare options
            responsibly, and move you toward a confident next step.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {coreServices.map((service) => (
            <Card
              key={service.title}
              className="overflow-hidden border border-gray-200 bg-card"
            >
              <img
                src={service.image}
                alt={service.alt}
                loading="lazy"
                className="h-64 w-full object-cover"
              />
              <CardContent className="p-8">
                <h3 className="text-2xl font-medium tracking-tight text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-4 text-base font-light leading-7 text-gray-700">
                  {service.body}
                </p>
                <ul className="mt-5 grid gap-3">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-sm font-light leading-6 text-gray-700"
                    >
                      • {bullet}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      scrollToId("pricing");
                      trackEvent("service_cta_click", { service: service.title });
                    }}
                    className="inline-flex items-center gap-3 rounded-pill bg-tertiary px-5 py-3 text-base font-normal text-tertiary-foreground transition-colors duration-200 ease-in hover:bg-gray-800"
                  >
                    {service.action}
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </button>
                  <Link
                    href={service.href}
                    className="inline-flex items-center justify-center rounded-pill border border-gray-200 bg-accent px-5 py-3 text-base font-normal text-foreground transition-colors duration-200 ease-in hover:bg-muted"
                  >
                    Learn more
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
