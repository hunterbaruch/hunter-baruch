import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { QuoteWizard } from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "Life Insurance Quote Georgia",
  description:
    "Get a term life insurance estimate in Georgia. Compare coverage amounts, see a monthly range, and request personalized options from a licensed Atlanta producer.",
  alternates: { canonical: "/life/quote" },
  openGraph: {
    title: "Life Insurance Quote Georgia | Hunter Baruch Financial",
    description:
      "Run a term life quote without leaving the Life section. Estimate a monthly range and request a follow-up from a Georgia-licensed producer.",
    url: "/life/quote",
  },
};

export default function LifeQuotePage() {
  return (
    <>
      <PageHero
        title="Life quote"
        description="Estimate term life coverage in a few steps. This is not a final offer — we'll follow up with options that fit your situation."
      />

      <div className="bg-card px-6 pt-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-light text-gray-600">
            <Link href="/life" className="text-primary hover:underline">
              ← Life
            </Link>
          </p>
        </div>
      </div>

      <QuoteWizard variant="life" />
    </>
  );
}
