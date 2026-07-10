import type { Metadata } from "next";
import { AboutCredentials } from "@/components/AboutCredentials";
import { CarriersDirectory } from "@/components/CarriersDirectory";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroVideoSection } from "@/components/HeroVideoSection";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { QuoteEstimator } from "@/components/QuoteEstimator";
import { QuoteWizard } from "@/components/QuoteWizard";
import { ServiceCards } from "@/components/ServiceCards";
import { TestimonialsVideoGridCarousel } from "@/components/TestimonialsVideoGridCarousel";
import { TrustStrip } from "@/components/TrustStrip";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description: siteConfig.description,
};

export default function Home() {
  return (
    <>
      <HeroVideoSection />
      <div className="home-sections">
        <TrustStrip />
        <QuoteEstimator />
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
