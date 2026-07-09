"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { trackEvent } from "@/lib/utils";

export function HeroVideoSection() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const nodes = contentRef.current.querySelectorAll("[data-hero-item]");
    gsap.fromTo(
      nodes,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
    );

    const handleScroll = () => {
      if (!videoRef.current) return;
      const shift = Math.min(window.scrollY * 0.08, 28);
      videoRef.current.style.transform = `translateY(${shift}px) scale(1.06)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuoteClick = () => {
    const target = document.getElementById("pricing");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("hero_cta_click");
  };

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-tertiary"
    >
      <video
        ref={videoRef}
        aria-label="Advisor meeting family at home"
        src="/ai_1.mp4"
        poster="/ai_1-poster.png"
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black" />
      <div className="absolute inset-0 bg-tertiary/50" />
      <div className="container-shell relative z-10 px-8 py-24 lg:px-12">
        <div ref={contentRef} className="max-w-3xl">
          <p
            data-hero-item
            className="mb-4 text-sm font-light uppercase tracking-[0.24em] text-gray-100"
          >
            Life insurance, Medicare guidance, patient advocacy
          </p>
          <h1
            data-hero-item
            className="max-w-2xl text-5xl font-medium leading-tight tracking-tight text-gray-50 md:text-6xl"
          >
            Insurance guidance that helps families choose with confidence.
          </h1>
          <p
            data-hero-item
            className="mt-6 max-w-2xl text-lg font-light leading-8 text-gray-100"
          >
            Compare trusted coverage options, get help understanding Medicare
            choices, and work with a patient advocate who stays with you through
            the decision.
          </p>
          <div data-hero-item className="mt-8">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="inline-flex items-center gap-3 rounded-pill bg-primary px-6 py-4 text-base font-normal text-primary-foreground transition-colors duration-200 ease-in hover:bg-secondary"
            >
              <span className="text-base font-normal text-primary-foreground">
                Get My Quote
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
          <p data-hero-item className="mt-4 text-sm font-light text-gray-100">
            No obligation • 2-minute start
          </p>
        </div>
      </div>
    </section>
  );
}
