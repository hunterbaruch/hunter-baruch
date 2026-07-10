"use client";

import { useState } from "react";
import { faqs } from "@/lib/site";

export function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section className="section-shell bg-gray-50">
      <div className="container-shell max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-600">
            Frequently asked questions
          </p>
          <h2 className="section-title mt-3">
            Answers to the questions people ask before they commit.
          </h2>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-card p-4 sm:p-5">
          <div className="w-full">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-normal text-foreground hover:underline"
                    aria-expanded={isOpen}
                  >
                    {faq.question}
                    <svg
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="pb-4 text-base font-light leading-7 text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
