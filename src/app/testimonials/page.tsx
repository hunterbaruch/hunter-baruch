import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { TestimonialsVideoGridCarousel } from "@/components/TestimonialsVideoGridCarousel";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "Client stories from families who worked with Hunter Baruch Financial on life insurance, Medicare, and patient advocacy in Georgia.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        title="Client Testimonials"
        description="Hear from families and individuals who have worked with us on financial planning and patient advocacy."
      />

      <TestimonialsVideoGridCarousel />

      <section className="section-shell bg-gray-50">
        <div className="container-shell text-center">
          <p className="body-copy">Ready to write your own success story?</p>
          <div className="mt-6">
            <Button href="/contact">Schedule a Consultation</Button>
          </div>
        </div>
      </section>
    </>
  );
}
