import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { testimonials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Client stories and testimonials for Hunter Baruch Financial planning and patient advocacy services.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Client Testimonials"
        description="Hear from families and individuals who have worked with us on financial planning and patient advocacy."
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="flex flex-col rounded-xl border border-border bg-surface p-8 shadow-sm"
              >
                <p className="flex-1 text-sm leading-relaxed text-primary">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-border pt-4">
                  <p className="font-semibold text-primary">{item.name}</p>
                  <p className="text-sm text-muted">{item.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted">
              Ready to write your own success story?
            </p>
            <div className="mt-6">
              <Button href="/contact">Schedule a Consultation</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
