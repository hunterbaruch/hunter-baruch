"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  ready?: (callback: () => void) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript(): Promise<TurnstileApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window"));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  return new Promise((resolve, reject) => {
    const done = () => {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      reject(new Error("Turnstile API missing after script load"));
    };

    if (existing) {
      if (window.turnstile) {
        done();
        return;
      }
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Turnstile")),
        { once: true },
      );
      // Script may already be loaded; poll briefly.
      const started = Date.now();
      const timer = window.setInterval(() => {
        if (window.turnstile) {
          window.clearInterval(timer);
          done();
        } else if (Date.now() - started > 8000) {
          window.clearInterval(timer);
          reject(new Error("Timed out waiting for Turnstile"));
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = done;
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });
}

/**
 * Cloudflare Turnstile widget for lead forms.
 * Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset.
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

        if (widgetIdRef.current) {
          try {
            turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }

        containerRef.current.innerHTML = "";

        const render = () => {
          if (cancelled || !containerRef.current) return;
          widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: "light",
            size: "normal",
            callback: (token) => {
              setError(null);
              onTokenRef.current(token);
            },
            "expired-callback": () => onTokenRef.current(null),
            "error-callback": () => {
              onTokenRef.current(null);
              setError(
                "Security check could not load. Add this site’s hostname in Cloudflare Turnstile (use localhost for local testing), then refresh.",
              );
            },
          });
        };

        if (typeof turnstile.ready === "function") {
          turnstile.ready(render);
        } else {
          render();
        }
      })
      .catch((loadError) => {
        console.error("[turnstile] script load failed:", loadError);
        onTokenRef.current(null);
        setError(
          "Security check could not load. Check your connection and Turnstile site key, then refresh.",
        );
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, resetSignal]);

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
      ) : (
        <p className="text-xs font-light text-gray-600">
          Protected by Cloudflare Turnstile to reduce spam submissions.
        </p>
      )}
    </div>
  );
}
