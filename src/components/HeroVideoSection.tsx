"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/utils";

const LOGO_SEQUENCE_START_BEFORE_END = 2.2;

export function HeroVideoSection() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const logoAnimatedRef = useRef(false);

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

  useEffect(() => {
    const video = videoRef.current;
    const logo = logoRef.current;
    if (!video || !logo) return;

    gsap.set(logo, { opacity: 0 });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let logoTimeline: gsap.core.Timeline | null = null;

    const resetLogoSequence = () => {
      logoAnimatedRef.current = false;
      logoTimeline?.kill();
      logoTimeline = null;
      gsap.set(logo, { opacity: 0 });
    };

    const playLogoSequence = () => {
      if (logoAnimatedRef.current) return;
      logoAnimatedRef.current = true;

      logoTimeline = gsap
        .timeline()
        .to(logo, { opacity: 1, duration: 0.7, ease: "power2.inOut" })
        .to(logo, { opacity: 1, duration: 0.3 })
        .to(logo, { opacity: 0, duration: 0.7, ease: "power2.inOut" });
    };

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const timeRemaining = duration - video.currentTime;
      if (
        timeRemaining <= LOGO_SEQUENCE_START_BEFORE_END &&
        timeRemaining > 0.1
      ) {
        playLogoSequence();
      }
    };

    // Native loop seeks to 0 without firing `ended`; `seeked` is reliable
    // even when timeupdate is throttled in background tabs.
    const handleSeeked = () => {
      if (video.currentTime < 0.5) {
        resetLogoSequence();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeked", handleSeeked);
      logoTimeline?.kill();
    };
  }, []);

  const handleQuoteClick = () => {
    const target = document.getElementById("pricing");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    trackEvent("hero_cta_click");
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[min(62svh,560px)] items-end overflow-hidden bg-tertiary"
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
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center opacity-0"
        aria-hidden
      >
        <img
          src={siteConfig.logo}
          alt=""
          className="h-20 w-auto drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] md:h-28"
        />
      </div>
      <div className="container-shell relative z-10 w-full px-8 pb-8 pt-16 lg:px-12 lg:pb-10">
        <div ref={contentRef} className="max-w-2xl text-left">
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
              className="inline-flex items-center gap-3 rounded-pill bg-primary px-5 py-3 text-base font-normal text-primary-foreground transition-colors duration-200 ease-in hover:bg-secondary"
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
          <p data-hero-item className="mt-3 text-sm font-light text-gray-100">
            No obligation • 2-minute start
          </p>
        </div>
      </div>
    </section>
  );
}
