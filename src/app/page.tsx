import type { Metadata } from "next";
import { AboutCredentials } from "@/components/AboutCredentials";
import { CarriersDirectory } from "@/components/CarriersDirectory";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroVideoSection } from "@/components/HeroVideoSection";
import { JsonLd } from "@/components/JsonLd";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { QuoteWizard } from "@/components/QuoteWizard";
import { ServiceCards } from "@/components/ServiceCards";
import { TestimonialsVideoGridCarousel } from "@/components/TestimonialsVideoGridCarousel";
import { TrustStrip } from "@/components/TrustStrip";
import { faqs, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.seo.homeTitle,
  },
  description: siteConfig.seo.homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.seo.homeTitle,
    description: siteConfig.seo.homeDescription,
    url: "/",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <HeroVideoSection />
      <div className="home-sections">
        <TrustStrip />
        <QuoteWizard />
        <ServiceCards />
        <ProcessTimeline />
        <TestimonialsVideoGridCarousel />
        <CarriersDirectory />
        <AboutCredentials />
        <FAQAccordion />
      </div>
    </>
  );
}
