"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { videoTestimonials } from "@/lib/site";
import { trackEvent } from "@/lib/utils";

function StarIcon() {
  return (
    <svg
      className="h-6 w-6 text-primary"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof videoTestimonials)[number];
}) {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-card">
      <div className="relative">
        <video
          src={testimonial.videoUrl}
          poster={testimonial.posterUrl}
          className="h-64 w-full object-cover"
          controls
          preload="metadata"
          onPlay={() =>
            trackEvent("testimonial_play", { client: testimonial.clientName })
          }
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 to-black/70" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-1">
          {Array.from({ length: testimonial.starRating }).map((_, index) => (
            <StarIcon key={index} />
          ))}
        </div>
        <h3 className="mt-4 text-xl font-medium text-gray-900">
          {testimonial.clientName}
        </h3>
        <p className="mt-1 text-sm font-light text-gray-600">
          {testimonial.context}
        </p>
        <p className="mt-4 font-serif text-lg leading-8 text-gray-700">
          &ldquo;{testimonial.transcriptSnippet}&rdquo;
        </p>
        <p className="mt-4 text-sm font-light text-gray-600">
          Transcript excerpt included for accessibility and search visibility.
        </p>
      </CardContent>
    </Card>
  );
}

export function TestimonialsVideoGridCarousel() {
  const [index, setIndex] = useState(0);

  const previous = () =>
    setIndex(
      (current) =>
        (current - 1 + videoTestimonials.length) % videoTestimonials.length,
    );
  const next = () =>
    setIndex((current) => (current + 1) % videoTestimonials.length);

  return (
    <section className="section-shell bg-card">
      <div className="container-shell">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
              Video testimonials
            </p>
            <h2 className="section-title mt-3">
              Trusted by families who wanted clear answers and steady support.
            </h2>
            <p className="body-copy mt-4">
              Average satisfaction:{" "}
              <span className="font-normal text-foreground">4.9/5</span> across
              quote, enrollment, and advocacy support.
            </p>
          </div>
          <div className="flex gap-3 lg:hidden">
            <button
              type="button"
              onClick={previous}
              className="rounded-full bg-accent p-3 text-foreground transition-colors duration-200 ease-in hover:bg-muted"
              aria-label="Previous testimonial"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-accent p-3 text-foreground transition-colors duration-200 ease-in hover:bg-muted"
              aria-label="Next testimonial"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 hidden gap-8 lg:grid lg:grid-cols-3">
          {videoTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-10 lg:hidden">
          <TestimonialCard testimonial={videoTestimonials[index]} />
        </div>
      </div>
    </section>
  );
}
