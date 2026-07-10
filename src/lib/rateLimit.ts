/**
 * Simple in-memory IP rate limiter for lead submissions.
 *
 * Default: 5 submissions per IP per 10 minutes.
 *
 * NOTE: This is process-local. On multi-instance serverless (e.g. Vercel),
 * each instance has its own map — consider Upstash Redis for production
 * hardening if traffic or abuse risk warrants it.
 */

type Bucket = {
  count: number;
  windowStartMs: number;
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(
  ip: string,
  options?: { max?: number; windowMs?: number },
): RateLimitResult {
  const max = options?.max ?? MAX_REQUESTS;
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const now = Date.now();
  const key = ip || "unknown";

  let bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStartMs >= windowMs) {
    bucket = { count: 0, windowStartMs: now };
    buckets.set(key, bucket);
  }

  if (bucket.count >= max) {
    const retryAfterSeconds = Math.ceil(
      (bucket.windowStartMs + windowMs - now) / 1000,
    );
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, max - bucket.count),
    retryAfterSeconds: 0,
  };
}

/** Extract a client IP from common proxy headers. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
