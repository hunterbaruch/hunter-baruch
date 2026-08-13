"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: (errorCode: string) => void | boolean;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const API_WAIT_MS = 8000;

function waitForTurnstileApi(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window"));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);

  return new Promise((resolve, reject) => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer);
        resolve(window.turnstile);
        return;
      }
      if (Date.now() - started > API_WAIT_MS) {
        window.clearInterval(timer);
        reject(new Error("Timed out waiting for Turnstile"));
      }
    }, 50);
  });
}

function loadTurnstileScript(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window"));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  if (!existing) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => {
      script.dataset.turnstileError = "1";
    };
    document.head.appendChild(script);
  }

  const scriptEl = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  return new Promise((resolve, reject) => {
    const fail = (message: string) => reject(new Error(message));

    if (scriptEl) {
      scriptEl.addEventListener(
        "error",
        () => fail("Failed to load Turnstile"),
        { once: true },
      );
      if (scriptEl.dataset.turnstileError === "1") {
        fail("Failed to load Turnstile");
        return;
      }
    }

    waitForTurnstileApi().then(resolve).catch(reject);
  });
}

function messageForTurnstileError(errorCode?: string): string {
  const code = errorCode?.trim() ?? "";
  if (code === "110200") {
    return "Security check could not load. Add this site’s hostname in Cloudflare Turnstile (use localhost for local testing), then refresh.";
  }
  if (code === "110100" || code === "110110" || code === "400020" || code === "400070") {
    return "Security check could not load. Check the Turnstile site key in your environment, then refresh.";
  }
  if (code === "200500") {
    return "Security check could not load. Check your connection (and that challenges.cloudflare.com is not blocked), then refresh.";
  }
  return "Security check could not load. Check your connection and Turnstile site key, then refresh.";
}

function removeWidget(widgetId: string | null) {
  if (!widgetId || !window.turnstile) return;
  try {
    window.turnstile.remove(widgetId);
  } catch {
    // Widget may already be gone after a remount.
  }
}

/**
 * Cloudflare Turnstile widget for lead forms.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
 *
 * Do not call turnstile.ready() after loading api.js with async — Cloudflare
 * throws, which previously left this widget in a permanent error state.
 */
export function TurnstileWidget({
  onToken,
  resetSignal = 0,
}: {
  onToken: (token: string | null) => void;
  /** Increment to reset the widget after a failed submit. */
  resetSignal?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    let cancelled = false;
    setError(null);
    onTokenRef.current(null);

    loadTurnstileScript()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;

        removeWidget(widgetIdRef.current);
        widgetIdRef.current = null;
        containerRef.current.innerHTML = "";

        try {
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "light",
            size: "flexible",
            callback: (token) => {
              setError(null);
              onTokenRef.current(token);
            },
            "expired-callback": () => onTokenRef.current(null),
            "error-callback": (errorCode) => {
              onTokenRef.current(null);
              console.error("[turnstile] widget error:", errorCode);
              setError(messageForTurnstileError(errorCode));
              return true;
            },
          });
        } catch (renderError) {
          console.error("[turnstile] render failed:", renderError);
          onTokenRef.current(null);
          setError(messageForTurnstileError());
        }
      })
      .catch((loadError) => {
        if (cancelled) return;
        console.error("[turnstile] script load failed:", loadError);
        onTokenRef.current(null);
        setError(messageForTurnstileError());
      });

    return () => {
      cancelled = true;
      removeWidget(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [siteKey, resetSignal, retryCount]);

  if (!siteKey) {
    return null;
  }

  const hostnameHint =
    typeof window !== "undefined" && window.location.hostname === "127.0.0.1"
      ? " Open this site at http://localhost:3000 (not 127.0.0.1) so Turnstile can load."
      : "";

  return (
    <div className="grid gap-2">
      <div ref={containerRef} className="min-h-[65px]" />
      {error ? (
        <div className="grid gap-2">
          <p role="alert" className="text-sm font-normal text-warning">
            {error}
            {hostnameHint}
            {process.env.NODE_ENV !== "production" ? (
              <span className="mt-1 block text-gray-600">
                Local dev: you can still submit — Turnstile is enforced on the
                live site only.
              </span>
            ) : null}
          </p>
          <button
            type="button"
            className="justify-self-start text-sm font-normal text-primary underline underline-offset-2"
            onClick={() => setRetryCount((value) => value + 1)}
          >
            Retry security check
          </button>
        </div>
      ) : (
        <p className="text-xs font-light text-gray-600">
          Protected by Cloudflare Turnstile to reduce spam submissions.
        </p>
      )}
    </div>
  );
}
