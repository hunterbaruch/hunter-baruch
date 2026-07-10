"use client";

import Link from "next/link";
import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "hbf-cookie-consent";
const CHANGE_EVENT = "hbf-cookie-consent-change";

function subscribeConsent(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getConsentVisible(): boolean {
  try {
    return !window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return true;
  }
}

function getServerConsentVisible(): boolean {
  // Avoid SSR flash; banner appears after client hydration if needed.
  return false;
}

/**
 * Lightweight cookie notice for visitors outside Georgia / general online traffic.
 * Not a full CMP — confirm with counsel if a stricter banner is required.
 */
export function CookieConsentBanner() {
  const visible = useSyncExternalStore(
    subscribeConsent,
    getConsentVisible,
    getServerConsentVisible,
  );

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // ignore storage failures
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card px-4 py-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-light leading-6 text-gray-700">
          We use cookies for essential site function and may use analytics to
          understand site usage. See our{" "}
          <Link
            href="/privacy-policy"
            className="font-normal text-primary underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="min-h-[44px] shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
