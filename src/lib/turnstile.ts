/**
 * Cloudflare Turnstile server-side verification.
 * Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * When TURNSTILE_SECRET_KEY is set, submissions without a valid token are rejected.
 * In production, missing config fails closed. In development, missing config is
 * allowed so local work is not blocked — set keys before relying on bot protection.
 */

export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; error: string };

export async function verifyTurnstileToken(
  token: string | undefined,
  ip?: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const isProd = process.env.NODE_ENV === "production";

  if (!secret) {
    if (isProd) {
      console.error("[turnstile] TURNSTILE_SECRET_KEY is not configured.");
      return {
        ok: false,
        error: "Bot protection is not configured. Please try again later.",
      };
    }
    console.warn(
      "[turnstile] TURNSTILE_SECRET_KEY missing — skipping verification in development.",
    );
    return { ok: true };
  }

  if (!token?.trim()) {
    return {
      ok: false,
      error: "Please complete the security check and try again.",
    };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });
    if (ip && ip !== "unknown") {
      body.set("remoteip", ip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      },
    );

    if (!response.ok) {
      console.error("[turnstile] siteverify HTTP", response.status);
      return {
        ok: false,
        error: "Security check failed. Please try again.",
      };
    }

    const data = (await response.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      console.warn("[turnstile] verification failed:", data["error-codes"]);
      return {
        ok: false,
        error: "Security check failed. Please try again.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[turnstile] verification error:", error);
    return {
      ok: false,
      error: "Security check failed. Please try again.",
    };
  }
}

export function getTurnstileSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined;
}
