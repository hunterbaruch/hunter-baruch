"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trackEvent } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function HeroVideoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!contentRef.current || !sectionRef.current || !videoRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    const nodes = content.querySelectorAll("[data-hero-item]");

    const intro = gsap.fromTo(
      nodes,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
    );

    // Start slightly zoomed so edges never show as the parallax moves.
    gsap.set(video, {
      scale: 1.08,
      yPercent: 0,
      transformOrigin: "center center",
      force3D: true,
    });

    const parallax = gsap.to(video, {
      scale: 1.32,
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.45,
      },
    });

    const contentParallax = gsap.to(content, {
      y: -48,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.45,
      },
    });

    return () => {
      intro.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
      contentParallax.scrollTrigger?.kill();
      contentParallax.kill();
    };
  }, []);

  const handleQuoteClick = () => {
    const target = document.getElementById("pricing");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("hero_cta_click");
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[min(62svh,560px)] items-end overflow-hidden bg-tertiary"
    >
      <video
        ref={videoRef}
        aria-label="Advisor meeting family at home"
        src="/ai_1.mp4"
        poster="/ai_1-poster.png"
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black" />
      <div className="absolute inset-0 bg-tertiary/50" />
      <div
        className="pointer-events-none absolute bottom-8 right-12 z-10 hidden md:block lg:bottom-10 lg:right-16"
        aria-hidden
      >
        <div
          className="hb-hero-logo relative overflow-hidden rounded-2xl"
          style={{ padding: 2, backgroundColor: "hsl(158 88% 38%)" }}
        >
          <span className="hb-hero-logo-spin" aria-hidden />
          <div
            className="relative z-[1] rounded-[14px] px-4 py-4 lg:px-5 lg:py-5"
            style={{
              backgroundColor: "#000",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <img
              src="/hb-logo-hero.svg"
              alt=""
              className="h-24 w-auto lg:h-28"
            />
          </div>
        </div>
        <style>{`
          .hb-hero-logo-spin {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 0;
            width: 250%;
            height: 250%;
            translate: -50% -50%;
            background: conic-gradient(
              from 0deg,
              hsl(158 88% 38%) 0deg,
              hsl(158 88% 38%) 320deg,
              hsl(158 100% 75%) 332deg,
              #fff 340deg,
              hsl(158 100% 75%) 348deg,
              hsl(158 88% 38%) 360deg
            );
            animation: hb-hero-logo-spin 5.5s linear infinite;
          }
          @keyframes hb-hero-logo-spin {
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .hb-hero-logo-spin { animation: none; }
          }
        `}</style>
      </div>
      <div className="container-shell relative z-10 w-full px-8 pb-8 pt-16 lg:px-12 lg:pb-10">
        <div ref={contentRef} className="max-w-2xl text-left will-change-transform">
          <p
            data-hero-item
            className="mb-3 text-sm font-light uppercase tracking-[0.24em] text-gray-100"
          >
            Life insurance, Medicare guidance, patient advocacy
          </p>
          <h1
            data-hero-item
            className="max-w-2xl text-4xl font-medium leading-tight tracking-tight text-gray-50 md:text-5xl"
          >
            Insurance guidance that helps families choose with confidence.
          </h1>
          <p
            data-hero-item
            className="mt-4 max-w-2xl text-base font-light leading-7 text-gray-100 md:text-lg md:leading-8"
          >
            Compare trusted coverage options, get help understanding Medicare
            choices, and work with a patient advocate who stays with you through
            the decision.
          </p>
          <div data-hero-item className="mt-6">
            <button
              type="button"
              onClick={handleQuoteClick}
              className="inline-flex items-center gap-3 rounded-pill border border-white/25 bg-primary/45 px-5 py-3 text-base font-normal text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md transition-colors duration-200 ease-in hover:bg-primary/60"
            >
              <span className="text-base font-normal text-white">
                Get My Quote
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-6 w-6 text-white"
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
          <p data-hero-item className="mt-3 text-sm font-light text-gray-100">
            No obligation • 2-minute start
          </p>
        </div>
      </div>
    </section>
  );
}
