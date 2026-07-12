import { siteConfig } from "@/lib/site";

/**
 * Public site base URL for links in emails (admin dashboard, etc.).
 * Prefer SITE_URL when set; otherwise Vercel preview URL; else siteConfig.url.
 */
export function getSiteBaseUrl(): string {
  const explicit =
    process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return siteConfig.url.replace(/\/$/, "");
}
